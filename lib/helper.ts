import { bridgeBank, bridgeToken } from '../lib/contracts'
import config from '../config'
const ethTokens = require('../assets.sifchain.localnet.json')
import { ethWallet } from '../wallet'

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

export const getWeb3 = function() {
  return web3
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

export const sleep = (ms: number) =>
  new Promise((done) => setTimeout(done, ms));

export const getChainRpc = (chaidId: string): string => {
  if (chaidId === 'cosmoshub-testnet') {
    return 'https://sifchain-proxies.vercel.app/api/cosmoshub-testnet/rpc'
  }
  if (chaidId === 'akash-testnet-6') {
    return 'https://sifchain-proxies.vercel.app/api/akash-testnet-6/rpc'
  }
  // etc ... 
}