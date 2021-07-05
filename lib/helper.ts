import { bridgeBank, bridgeToken } from '../lib/contracts'
import config from '../config'
const ethTokens = require('../ethereum_tokens.json')
const { time } = require("@openzeppelin/test-helpers")
import { ethWallet } from '../wallet'

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))


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

export const approveSpend = async function (ethAddress: string, amount: string, gas: number) {

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

  const tx = {
    // nonce: await web3.eth.getTransactionCount(ethWallet.address),
    to: config.bridgeTokenAddress,
    // from: ethWallet.address,
    value: 0,
    gas,
    data: bridgeToken().methods.approve(config.bridgeBankAddress, amount).encodeABI(),
  }

  const signed = await web3.eth.accounts.signTransaction(tx, ethWallet.privateKey);
  const approveRes = await web3.eth.sendSignedTransaction(signed.rawTransaction)

   console.log({ approveRes })
   return
}

beforeEach(async () => {
  require("@openzeppelin/test-helpers/configure")({
    provider: new Web3.providers.HttpProvider('http://localhost:7545'),
  });
});


export async function advanceBlock(count: number) {
  console.log("Advancing time by " + count + " blocks")
  for (let i = 0; i < count; i++) {

    try {
      
      const xx = await time.advanceBlock()
      // console.log("Finished advancing time.", xx)
      
    } catch (error) {
      console.log('advanceBlock Error: ', error);
      
    }
  }
}
