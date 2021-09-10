import config from '../config'

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

export const bridgeBank = function () {
  const abi = require('./smartContracts/BridgeBank.json')
  return new web3.eth.Contract(abi, config.bridgeBankAddress)
}

export const bridgeToken = function () {
  const { abi } = require('./smartContracts/BridgeToken.json')
  return new web3.eth.Contract(abi, config.bridgeTokenAddress)
}
