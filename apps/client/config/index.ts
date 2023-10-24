let envConf = require(`./${process.env.NEXT_PUBLIC_CHAIN}`).default;

export const geckoApi = 'https://api.coingecko.com/api/v3';

export const officialURL = 'https://securecenter-poc.soulwallets.me';

export const backendURL = 'https://api.pactsmith.com';

export const infuraId = '997ec38ed1ff4c818b45a09f14546530';

export const socials = {
  discord: 'https://discord.org',
  twitter: 'https://twitter.com',
};

export const chainIdMapping = {
  1: 'ETH Mainnet',
  5: 'Goerli',
  42: 'KOVAN',
  56: 'BSC Mainnet',
  128: 'HECO Mainnet',
  97: 'BSC Testnet',
  420: 'Optimism Ethereum Testnet',
};

export const openseaApi = 'https://api.opensea.io/api/v1';

export const zeroAddress = '0x0000000000000000000000000000000000000000';

export const eip1271MagicValue = '0x1626ba7e';

export default {
  socials,
  officialURL,
  openseaApi,
  chainIdMapping,
  zeroAddress,
  backendURL,
  ...envConf,
};
