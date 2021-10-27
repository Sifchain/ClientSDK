import { DirectSecp256k1HdWallet, coins } from '@cosmjs/proto-signing'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/.env' })

// using ethers here instead because Web3 doesn't have any way to generate wallets via mnemonics
const ethMnemonic = process.env.ETH_MNEMONIC
if (!ethMnemonic) {
  console.error(
    'No eth wallet mnemonic found. Add ETH_MNEMONIC string to .env file.'
  )
}
export const ethWallet = ethers.Wallet.fromMnemonic(ethMnemonic)

export const setupWallet = async function (
  prefix: string = 'sif',
  mnemonic: string = process.env.SIF_MNEMONIC
) {
  if (!process.env.SIF_MNEMONIC) {
    console.error(
      'No sif wallet mnemonic found. Add SIF_MNEMONIC string to .env file.'
    )
  }
  return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix,
  })
}
