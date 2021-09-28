import config from '../config'
const ethTokens = require('assets.sifchain.mainnet.json')

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

export const getWeb3 = function () {
  return web3
}

export const getERC20Token = function (symbol: string) {
  return ethTokens.find(
    (token) => token.symbol === symbol && token.homeNetwork === 'ethereum'
  )
}
