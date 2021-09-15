import config from '../config'
const ethTokens = require('./assets.sifchain.localnet.json')

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

export const getWeb3 = function() {
  return web3
}

export const getToken = function (symbol: string) {
  return ethTokens.find(token => token.symbol === symbol)
}

export const sleep = (ms: number) =>
  new Promise((done) => setTimeout(done, ms));
