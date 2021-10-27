import { DirectSecp256k1HdWallet, coins } from '@cosmjs/proto-signing'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/.env' })

// using ethers here instead because Web3 doesn't have any way to generate wallets via mnemonics
export const ethWallet = ethers.Wallet.fromMnemonic(process.env.ETH_MNEMONIC)

export const setupWallet = async function (
  prefix: string = 'sif',
  mnemonic: string = process.env.SIF_MNEMONIC
) {
  return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix })
}
