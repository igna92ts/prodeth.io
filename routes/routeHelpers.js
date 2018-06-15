exports.common = {
  ropstenProvider: process.env.ETHEREUM_NETWORK !== 'MAINNET' ? `https://ropsten.infura.io/${process.env.INFURA_KEY}` : '',
  socketURL: process.env.API_BASE_URL
};
