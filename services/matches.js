const Match = require('../models/match'),
  errors = require('../errors'),
  Web3 = require('web3'),
  web3 = new Web3(),
  moment = require('moment-timezone'),
  Tx = require('ethereumjs-tx');
  

if (process.env.ETHEREUM_NETWORK === "MAINNET") {
  web3.setProvider(new Web3.providers.HttpProvider(`https://mainnet.infura.io/${process.env.INFURA_KEY}`));
} else {
  web3.setProvider(new Web3.providers.HttpProvider(`https://ropsten.infura.io/${process.env.INFURA_KEY}`));
}
  

exports.getMatches = async () => {
  return Match.find({}, { 'team1.privateKey': 0, 'team2.privateKey': 0 }).sort('date');
};

exports.matchesCalculations = rawMatches => {
  //  calculate balance and payoff
  const matches = rawMatches.map(m => {
    m = m.toJSON();
    //  balance
    m.team1.balance = m.team1.transactions.reduce((total, t) => total + t.amount, 0);
    m.team2.balance = m.team2.transactions.reduce((total, t) => total + t.amount, 0);

    //  payoff
    m.team1.payoff = 1.50;
    m.team2.payoff = 1.50;

    let calculated = false;

    if (m.team1.balance > 0 || m.team2.balance > 0) {
      if (m.team1.balance <= 0 && m.team2.balance > 0) {
        m.team1.payoff = 2
        m.team2.payoff = 1.50
        calculated = true;
      } else {
        m.team1.payoff = (m.team2.balance / m.team1.balance < 1) ? m.team2.balance / m.team1.balance + 1 : m.team2.balance / m.team1.balance;
      }

      if(!calculated) {
        if (m.team2.balance <= 0 && m.team1.balance > 0) {
          m.team2.payoff = 2
          m.team1.payoff = 1.50
        } else {
          m.team2.payoff = (m.team1.balance / m.team2.balance < 1) ? m.team1.balance / m.team2.balance + 1 : m.team1.balance / m.team2.balance;
        }
      }
    }

    return m;
  });

  return matches;
};

const countries = {
  "RUS": {
    name: "Russia",
    flag: "russia"
  },
  "KSA": {
    name: "Saudi Arabia",
    flag: "saudi-arabia"
  },
  "EGY": {
    name: "Egypt",
    flag: "egypt"
  },
  "URU": {
    name: "Uruguay",
    flag: "uruguay"
  },
  "MAR": {
    name: "Morocco",
    flag: "morocco"
  },
  "IRN": {
    name: "Iran",
    flag: "iran"
  },
  "POR": {
    name: "Portugal",
    flag: "portugal"
  },
  "ESP": {
    name: "Spain",
    flag: "spain"
  },
  "FRA": {
    name: "France",
    flag: "france"
  },
  "AUS": {
    name: "Australia",
    flag: "australia"
  },
  "ARG": {
    name: "Argentina",
    flag: "argentina"
  },
  "ISL": {
    name: "Iceland",
    flag: "iceland"
  },
  "PER": {
    name: "Peru",
    flag: "peru"
  },
  "DEN": {
    name: "Denmark",
    flag: "denmark"
  },
  "CRO": {
    name: "Croatia",
    flag: "croatia"
  },
  "NGA": {
    name: "Nigeria",
    flag: "nigeria"
  },
  "CRC": {
    name: "Costa Rica",
    flag: "costa-rica"
  },
  "SRB": {
    name: "Serbia",
    flag: "serbia"
  },
  "GER": {
    name: "Germany",
    flag: "germany"
  },
  "MEX": {
    name: "Mexico",
    flag: "mexico"
  },
  "BRA": {
    name: "Brazil",
    flag: "brazil"
  },
  "SUI": {
    name: "Switzerland",
    flag: "switzerland"
  },
  "SWE": {
    name: "Sweden",
    flag: "sweden"
  },
  "KOR": {
    name: "Korea Republic",
    flag: "south-korea"
  },
  "BEL": {
    name: "Belgium",
    flag: "belgium"
  },
  "PAN": {
    name: "Panama",
    flag: "panama"
  },
  "TUN": {
    name: "Tunisia",
    flag: "tunisia"
  },
  "ENG": {
    name: "England",
    flag: "england"
  },
  "COL": {
    name: "Colombia",
    flag: "colombia"
  },
  "JPN": {
    name: "Japan",
    flag: "japan"
  },
  "POL": {
    name: "Poland",
    flag: "republic-of-poland"
  },
  "SEN": {
    name: "Senegal",
    flag: "senegal"
  },
};

exports.createMatch = async (countryCode1, countryCode2, date, timezone) => {
  const account1 = web3.eth.accounts.create();
  const account2 = web3.eth.accounts.create();

  const existingMatch = await Match.findOne({
    'team1.country.code': countryCode1,
    'team2.country.code': countryCode2,
    date: moment.tz(date, timezone).valueOf()
  });
  if (existingMatch) throw new Error('Match already exists');
  else {
    const match = new Match({
      team1: {
        address: account1.address,
        privateKey: account1.privateKey,
        transactions: [],
        country: {
          name: countries[countryCode1].name,
          code: countryCode1,
          flag: countries[countryCode1].flag
        }
      },
      team2: {
        address: account2.address,
        privateKey: account2.privateKey,
        transactions: [],
        country: {
          name: countries[countryCode2].name,
          code: countryCode2,
          flag: countries[countryCode2].flag
        }
      },
      date: moment.tz(date, timezone).valueOf(),
      payed: false
    });
    return match.save();
  }
};

exports.deleteMatch = (countryCode1, countryCode2, date, timezone) => {
  return Match.deleteOne({
    'team1.country.code': countryCode1,
    'team2.country.code': countryCode2,
    date: moment.tz(date, timezone).valueOf()
  });
};

let gasPrice = 10e9;
let gasLimit = 21000;
const feeCost = web3.utils.fromWei((gasPrice * gasLimit).toString(),"ether");

gasPrice = web3.utils.toHex(gasPrice);
gasLimit = web3.utils.toHex(gasLimit);

function sendSigned(txData, privateKey, cb){
  const privateKeyBuffer = new Buffer(privateKey.substring(2), 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKeyBuffer)
  const serializedTx = transaction.serialize().toString('hex')
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

exports.payMatch = async (countryCode1, countryCode2, date, timezone, winnerCode) => {
  const matchToPay = await Match.findOne({
    'team1.country.code': countryCode1,
    'team2.country.code': countryCode2,
    date: moment.tz(date, timezone).valueOf(), 
    payed: false
  });

  const winningFee = 5.00 // 5% fee;
  const tieFee = 1.00 // 1% fee;

  if(matchToPay.team1.transactions.length <= 0 || matchToPay.team2.transactions.length <= 0){
    //one of the two teams has no bets so refund everything with no fees
    await refundTransactions(matchToPay.team1, 0);
    await refundTransactions(matchToPay.team2, 0);
  } else {
    if(matchToPay.team1.country.code === winnerCode) {
      //team1 win so refund original bets with no fees and pay from team2 with winningFee
      await refundTransactions(matchToPay.team1, 0);
      await payTransactions(matchToPay.team2, matchToPay.team1, winningFee);
    } else if(matchToPay.team2.country.code === winnerCode) {
      //team2 win so refund original bets with no fees and pay from team1 with winningFee
      await refundTransactions(matchToPay.team2, 0);
      await payTransactions(matchToPay.team1, matchToPay.team2, winningFee);
    } else if(winnerCode === "TIE"){
      //refund everything with the tie fee
      await refundTransactions(matchToPay.team1, tieFee);
      await refundTransactions(matchToPay.team2, tieFee);
    } else {
      error.log('Invalid winner code');
      return;
    }
  }
}

const refundTransactions = async (team, fee) => {
  let totalProfit = 0;

  let txCounter = 0;

  for(let i = 0; i < team.transactions.length; i++){
    const transactionProfit = (team.transactions[i].amount * fee / 100);
    const amount = team.transactions[i].amount - transactionProfit - feeCost;

    web3.eth.getTransactionCount(team.address).then(txCount => {
      const txData = {
        nonce: web3.utils.toHex(txCount + txCounter),
        gasPrice,
        gasLimit,
        to: team.transactions[i].sender,
        from: team.address,
        value: web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether'))
      }

      sendSigned(txData, team.privateKey, function(err, result) {
        if (err) return console.log('error', err)
        console.log('sent', result)
      })

      txCounter++;
    });

    totalProfit += transactionProfit;
  }

  totalProfit -= feeCost;

  if(totalProfit > 0){

    web3.eth.getTransactionCount(team.address).then(txCount => {
      const txData = {
        nonce: web3.utils.toHex(txCount + txCounter),
        gasPrice,
        gasLimit,
        to: process.env.PRODETH_ADDRESS,
        from: team.address,
        value: web3.utils.toHex(web3.utils.toWei(totalProfit.toString(), 'ether'))
      }

      sendSigned(txData, team.privateKey, function(err, result) {
        if (err) return console.log('error', err)
        console.log('sent', result)
      })
    });
  }
}

const payTransactions = async (teamLoser, teamWinner, fee) => {
  let totalProfit = 0;

  let totalWinningPool = 0;
  let totalWinnersPool = 0;

  let txCounter = 0;

  for(let i = 0; i < teamLoser.transactions.length; i++){
    //the pool that is used to pay everyone
    totalWinningPool += teamLoser.transactions[i].amount;
  }

  for(let i = 0; i < teamWinner.transactions.length; i++){
    //the pool of everyone that won
    totalWinnersPool += teamWinner.transactions[i].amount;
  }

  for(let i = 0; i < teamWinner.transactions.length; i++){
    //how much percentage you win from the winning pool
    const winningPercentage = teamWinner.transactions[i].amount / totalWinnersPool;

    //how much amount you win from the winning pool
    const winningAmount = winningPercentage * totalWinningPool;

    //prodeth profit
    const transactionProfit = winningAmount * fee / 100;

    //amount with the fee applied
    const amountWithFee = winningAmount - transactionProfit - feeCost;

    web3.eth.getTransactionCount(teamLoser.address).then(txCount => {
      const txData = {
        nonce: web3.utils.toHex(txCount + i),
        gasPrice,
        gasLimit,
        to: teamWinner.transactions[i].sender,
        from: teamLoser.address,
        value: web3.utils.toHex(web3.utils.toWei(amountWithFee.toString(), 'ether'))
      }

      sendSigned(txData, teamLoser.privateKey, function(err, result) {
        if (err) return console.log('error', err)
        console.log('sent', result)
      })

      txCounter++;
    });

    totalProfit += transactionProfit;
  }

  totalProfit -= feeCost;

  if(totalProfit > 0){
    web3.eth.getTransactionCount(teamLoser.address).then(txCount => {
      const txData = {
        nonce: web3.utils.toHex(txCount + txCounter),
        gasPrice,
        gasLimit,
        to: process.env.PRODETH_ADDRESS,
        from: teamLoser.address,
        value: web3.utils.toHex(web3.utils.toWei(totalProfit.toString(), 'ether'))
      }

      sendSigned(txData, teamLoser.privateKey, function(err, result) {
        if (err) return console.log('error', err)
        console.log('sent', result)
      })
    });
  }
}