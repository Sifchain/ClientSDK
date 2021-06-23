import Web3 from 'web3'
import config from '../config'

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))

export const bridgeBank = function () {
  const { BridgeBankABI } = require('../BridgeBank')
  return new web3.eth.Contract(
    JSON.parse(BridgeBankABI),
    config.bridgeBankAddress
  )
}

export const bridgeToken = function () {
  const { abi } = require('../BridgeToken.json')
  return new web3.eth.Contract(abi, config.bridgeTokenAddress)
}
