import { DirectSecp256k1HdWallet, coins } from '@cosmjs/proto-signing'
import config from './config'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/.env' });

// using ethers here instead because Web3 doesn't have any way to generate wallets via mnemonics
export const ethWallet = ethers.Wallet.fromMnemonic(process.env.ETH_MNEMONIC)

export const setupWallet = async function() {
  return await DirectSecp256k1HdWallet.fromMnemonic(process.env.SIF_MNEMONIC, {
    prefix: 'sif',
  })
}

export const setupCosmosWallet = async function() {
  return await DirectSecp256k1HdWallet.fromMnemonic(process.env.SIF_MNEMONIC, {
		prefix: 'cosmos',
	})
}

export const fee = {
	amount: coins(150000, 'rowan'),
	gas: '300000',
};

export const broadcastUrl = 'https://rpc-testnet.sifchain.finance';