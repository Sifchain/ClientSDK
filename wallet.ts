import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import config from './config'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/.env' });

// using ethers here instead because Web3 doesn't have any way to generate wallets via mnemonics
export const ethWallet = ethers.Wallet.fromMnemonic(process.env.ETH_MNEMONIC)
export const setupWallet = async function() {
  return await DirectSecp256k1HdWallet.fromMnemonic(process.env.SIF_MNEMONIC, config.sifwallet)
} 