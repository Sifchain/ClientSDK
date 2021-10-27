import config from '../../config'
import {
  SigningStargateClient,
  MsgTransferEncodeObject,
} from '@cosmjs/stargate'
import { StdFee } from '@cosmjs/launchpad'
import { NativeDexClient } from '../client'
import * as IbcTransferV1Tx from '@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx'
import { setupWallet } from '../../wallet'
import chainsIBC from './chainsConfigIBC'

export const importTokenIBC = async (symbol: string, amount: string) => {
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

  const { denom, ibcCounterpartyChannelId, ibcCounterpartyChainId } = entry
  const ibcDenom = denom

  // get sender chain info
  const senderChain = chainsIBC.find(
    (chain) => chain.chainId === ibcCounterpartyChainId
  )

  const sifWallet = await setupWallet('sif')
  const [firstAccount] = await sifWallet.getAccounts()
  const receiver = firstAccount.address

  const senderWallet = await setupWallet(
    senderChain.bech32PrefixAccAddr,
    senderChain.walletMnemonic
  )
  const [senderFirstAccount] = await senderWallet.getAccounts()
  const sender = senderFirstAccount.address

  // if symbol is native token to chain then use symbol denom else use ibcDenom
  const tokenDenom = symbol === senderChain.nativeFeeToken ? symbol : ibcDenom

  const unsignedTransferMsg: MsgTransferEncodeObject = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: IbcTransferV1Tx.MsgTransfer.fromPartial({
      sourcePort: 'transfer',
      sourceChannel: ibcCounterpartyChannelId,
      sender,
      receiver,
      token: { denom: tokenDenom, amount },
      timeoutHeight: {
        // revisionHeight: timeoutHeight,
        // revisionHeight: timeoutHeight,
      },
      timeoutTimestamp: config.timeoutTimestampNanoseconds,
    }),
  }
  const client = await SigningStargateClient.connectWithSigner(
    senderChain.rpcUrl,
    senderWallet
  )

  // const senderBalances = await client.getAllBalances(sender);
  // console.log({ senderBalances });

  const fee: StdFee = {
    amount: [
      {
        denom: senderChain.nativeFeeToken,
        amount: senderChain.nativeFee,
      },
    ],
    gas: senderChain.gas,
  }
  const txnStatus = await client.signAndBroadcast(
    sender,
    [unsignedTransferMsg],
    fee
  )
  return txnStatus
}
