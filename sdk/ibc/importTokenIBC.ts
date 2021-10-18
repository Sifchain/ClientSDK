import config from '../../config'
import {
  SigningStargateClient,
  MsgTransferEncodeObject,
} from '@cosmjs/stargate'
import { StdFee } from '@cosmjs/launchpad'
import * as IbcTransferV1Tx from '@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx'
import { setupWallet } from '../wallet'
import chainsIBC from './chainsConfigIBC'
import { getDexEntryFromSymbol, getDexSymbols } from '../helpers'


export const importTokenIBC = async (symbol: string, amount: string) => {
  const entry = await getDexEntryFromSymbol(symbol)
  const { denom, baseDenom, ibcCounterpartyChannelId, ibcCounterpartyChainId } =
    entry
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
  const tokenDenom =
    baseDenom === senderChain.nativeFeeToken ? baseDenom : ibcDenom

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
