const request = require('request'),
  Match = require('../models/match'),
  Web3 = require('web3'),
  web3 = new Web3(),
  moment = require('moment-timezone');

const apiKey = 'RQBPFA2V6GCPXV3RBX3R6AXKF3X78UYKP9';
const apiHost = 'http://api.etherscan.io';
const apiUrls = {
  transactions: `${apiHost}/api?module=account&action=txlist&startblock=5694716&apikey=${apiKey}&sort=desc&address=`
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
    flag: "poland"
  },
  "SEN": {
    name: "Senegal",
    flag: "senegal"
  },
};

exports.createMatch = async (countryCode1, countryCode2, date, timezone) => {
  const account1 = web3.eth.accounts.create();
  const account2 = web3.eth.accounts.create();

  console.log(countryCode1)
  console.log(countryCode2)

  const match = new Match({
    team1: {
      address: account1.address,
      privateKey: account1.privateKey,
      transactions: [],
      country: {
        name: countries[countryCode1].name,
        code: countryCode1,
        flag: countries[countryCode1].flag,
      }
    },
    team2: {
      address: account2.address,
      privateKey: account2.privateKey,
      transactions: [],
      country: {
        name: countries[countryCode2].name,
        code: countryCode2,
        flag: countries[countryCode2].flag,
      }
    },
    date: moment.tz(date, timezone).valueOf(),
    payed: false
  });
  await match.save();
};

const getTransaction = address => {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: `${apiUrls.transactions}${address}`,
        json: true
      },
      (err, res, body) => {
        if (err) return reject(err);
        else if (!body.result) return reject(body);
        const results = body.result.filter(t => t.from !== address && parseInt(t.isError) === 0);
        return resolve(
          results.map(r => {
            return {
              id: r.hash,
              amount: web3.utils.fromWei(r.value, 'ether'),
              sender: r.from,
              time: new Date(r.timeStamp * 1000)
            };
          })
        );
      }
    );
  });
};

exports.getTransactions = async match => {
  const transactions = await Promise.all([
    getTransaction(match.team1.address),
    getTransaction(match.team2.address)
  ]);
  return {
    team1: transactions[0],
    team2: transactions[1]
  };
};
