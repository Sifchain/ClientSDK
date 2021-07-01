import { bridgeBank, bridgeToken } from '../lib/contracts'
import config from '../config'

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

export const approveSpend = async function (ethAddress: string, amount: string, ) {
    // params: argv.ethereum_address, argv.bridgebank_address, requestParameters
    const allowance = await bridgeToken().methods
    .allowance(ethAddress, config.bridgeBankAddress)
    .call()

  console.log({ allowance });

  if (BigInt(amount) <= BigInt(allowance)) {
    // argv.bridgebank_address, sifchainUtilities.SOLIDITY_MAX_INT, requestParameters
    return { 
      message: 'spend already approved',
      allowance,
    }
  }

  const approveRes = await bridgeToken().methods
    .approve(config.bridgeBankAddress, amount)
    .send({
      from: ethAddress,
      value: 0,
      gas: 100000,
    })

   console.log({ approveRes })
   return
}