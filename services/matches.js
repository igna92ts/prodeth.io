const Match = require('../models/match'),
  errors = require('../errors'),
  Web3 = require('web3'),
  web3 = new Web3(),
  moment = require('moment-timezone');

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
    m.team1.payoff = 1.00;
    m.team2.payoff = 1.00;

    if (m.team1.balance > 0 || m.team2.balance > 0) {
      if (m.team1.balance <= 0) {
        m.team1.payoff = 2
      } else {
        m.team1.payoff = (m.team2.balance / m.team1.balance < 1) ? m.team2.balance / m.team1.balance + 1 : m.team2.balance / m.team1.balance;
      }

      if (m.team2.balance <= 0) {
        m.team2.payoff = 2
      } else {
        m.team2.payoff = (m.team1.balance / m.team2.balance < 1) ? m.team1.balance / m.team2.balance + 1 : m.team1.balance / m.team2.balance;
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
