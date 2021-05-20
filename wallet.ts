import { Secp256k1HdWallet, coins } from '@cosmjs/launchpad'
import config from './config'

export const setupWallet = async () => await Secp256k1HdWallet.fromMnemonic(config.mnemonic, config.sifwallet)

export const fee = {
  amount: coins(150000, 'rowan'),
  gas: '300000',
}

export const broadcastUrl = 'https://api-testnet.sifchain.finance'
