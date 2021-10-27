import config from '../../config'
import { getWeb3 } from '../helpers'
import { SigningStargateClient } from '@cosmjs/stargate'
import { setupWallet, ethWallet } from '../../wallet'
import { MsgLock, MsgBurn } from '../generated/proto/sifnode/ethbridge/v1/tx'
import { NativeDexClient } from '../client'
import { Registry } from '@cosmjs/proto-signing'
import Long from 'long'
const web3 = getWeb3()

type MsgLockEncodeObject = {
  typeUrl: string
  value: MsgLock
}
type MsgBurnEncodeObject = {
  typeUrl: string
  value: MsgBurn
}

export const exportToken = async (symbol: string, amount: string) => {
  const wallet = await setupWallet('sif')
  const [firstAccount] = await wallet.getAccounts()
  const cosmosSender = firstAccount.address
  const ethereumChainId = await web3.eth.net.getId()
  const value = {
    cosmosSender,
    amount, // amount to send
    symbol, // sif token e.g: ceth, rowan
    ethereumChainId: new Long(ethereumChainId),
    ethereumReceiver: ethWallet.address,
    cethAmount: config.exportEthbridgeCethThresholdFee,
  }
  const unsignedLockTxn: MsgLockEncodeObject = {
    typeUrl: `/sifnode.ethbridge.v1.MsgLock`,
    value,
  }
  const unsignedBurnTxn: MsgBurnEncodeObject = {
    typeUrl: `/sifnode.ethbridge.v1.MsgBurn`,
    value,
  }
  const unsignedTxn =
    symbol.toLowerCase() === 'rowan' ? unsignedLockTxn : unsignedBurnTxn

  const client = await SigningStargateClient.connectWithSigner(
    config.sifRpc,
    wallet,
    { registry: new Registry([...NativeDexClient.getGeneratedTypes()]) }
  )
  const txnStatus = await client.signAndBroadcast(
    firstAccount.address,
    [unsignedTxn],
    config.fee
  )
  return txnStatus
}
