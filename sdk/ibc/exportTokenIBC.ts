import config from '../../config'
import {
  SigningStargateClient,
  MsgTransferEncodeObject,
} from '@cosmjs/stargate'
import { NativeDexClient } from '../client'
import * as IbcTransferV1Tx from '@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx'
import { setupWallet } from '../wallet'
import chainsIBC from './chainsConfigIBC'

export const exportTokenIBC = async (symbol: string, amount: string) => {
  // look up ibc denom and channel id from dex entries
  const dex = await NativeDexClient.connect(config.sifRpc)
  const { entries } = (await dex.query.tokenregistry.Entries({})).registry
  // console.log({ entries }) // list of IBC tokens on the dex
  const entry = entries.find(
    (entry) => entry.baseDenom === symbol.toLocaleLowerCase()
  )

  if (!entry) {
    console.log(
      'Available tokens: ',
      entries.map((e) => e.baseDenom)
    )
    throw new Error(`Token "${symbol}" not found on dex.`)
  }

  const { denom, ibcChannelId, ibcCounterpartyChainId } = entry

  // get receiver chain info
  const receiverChain = chainsIBC.find(
    (chain) => chain.chainId === ibcCounterpartyChainId
  )

  const wallet = await setupWallet('sif')
  const [firstAccount] = await wallet.getAccounts()
  const sender = firstAccount.address

  const receiverWallet = await setupWallet(
    receiverChain.bech32PrefixAccAddr,
    receiverChain.walletMnemonic
  )
  const [receiverFirstAccount] = await receiverWallet.getAccounts()
  const receiver = receiverFirstAccount.address

  const unsignedTransferMsg: MsgTransferEncodeObject = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: IbcTransferV1Tx.MsgTransfer.fromPartial({
      sourcePort: 'transfer',
      sourceChannel: ibcChannelId,
      sender,
      receiver,
      token: { denom, amount },
      timeoutHeight: {
        // revisionHeight: timeoutHeight,
        // revisionHeight: timeoutHeight,
      },
      timeoutTimestamp: config.timeoutTimestampNanoseconds,
    }),
  }
  const client = await SigningStargateClient.connectWithSigner(
    config.sifRpc,
    wallet
  )
  const txnStatus = await client.signAndBroadcast(
    firstAccount.address,
    [unsignedTransferMsg],
    config.fee
  )
  return txnStatus
}
