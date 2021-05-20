import { Secp256k1HdWallet } from '@cosmjs/launchpad'
import config from './config'

export const setupWallet = async () => await Secp256k1HdWallet.fromMnemonic(config.mnemonic, config.sifwallet)
