import Web3 from 'web3'
import config from '../config'

const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

export const bridgeBank = function () {
  const abi = require('../BridgeBank.json')
  return new web3.eth.Contract(abi, config.bridgeBankAddress)
}

export const bridgeToken = function () {
  const { abi } = require('../BridgeToken.json')
  return new web3.eth.Contract(abi, config.bridgeTokenAddress)
}
