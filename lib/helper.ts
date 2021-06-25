const ethTokens = require('../ethereum_tokens.json')

export const isEthAddress = async function (ethAddress) {
  const regex = new RegExp('/^0x[a-fA-F0-9]{40}$/')
  return regex.test(ethAddress)
}

export const isSifAddress = async function (sifAddress) {
  const regex = new RegExp('/^sif[a-zA-Z0-9]{39}$/')
  return regex.test(sifAddress)
}

export const getToken = function (symbol: string) {
  return ethTokens.find(token => token.symbol === symbol)
}
