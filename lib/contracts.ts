import Web3 from 'web3'
import config from '../config'
import { getWeb3 } from './helper'

const web3 = getWeb3()

export const bridgeBank = function () {
  const abi = require('../BridgeBank.json')
  return new web3.eth.Contract(abi, config.bridgeBankAddress)
}

export const bridgeToken = function () {
  const { abi } = require('../BridgeToken.json')
  return new web3.eth.Contract(abi, config.bridgeTokenAddress)
}
