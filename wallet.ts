import { Secp256k1HdWallet, coins } from '@cosmjs/launchpad'
import config from './config'
import { ethers } from 'ethers'

export const setupWallet = async () => await Secp256k1HdWallet.fromMnemonic(config.mnemonic, config.sifwallet)

// using ethers here instead because Web3 doesn't have any way to generate wallets via mnemonics
export const ethWallet = ethers.Wallet.fromMnemonic(config.mnemonic)


export const fee = {
  amount: coins(150000, 'rowan'),
  gas: '300000',
}

export const broadcastUrl = 'https://api-testnet.sifchain.finance'
