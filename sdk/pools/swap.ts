import { Registry } from '@cosmjs/proto-signing'
import { SigningStargateClient } from '@cosmjs/stargate'
import { NativeDexClient } from '../client'
import { setupWallet } from '../wallet'
import { MsgSwap } from '../generated/proto/sifnode/clp/v1/tx'
import config from '../../config'
import { getDexEntryFromSymbol } from '../helpers'

type MsgSwapEncodeObject = {
  typeUrl: string
  value: MsgSwap
}

type Asset = {
  symbol: string
}

export const swap = async (
  sentAssetSymbol: string,
  receivedAssetSymbol: string,
  sentAmount: string,
  minReceivingAmount: string
) => {
  try {
    const [sentAssetEntry, receivedAssetEntry] = await Promise.all([
      getDexEntryFromSymbol(sentAssetSymbol),
      getDexEntryFromSymbol(receivedAssetSymbol),
    ])

    const wallet = await setupWallet('sif')
    const [firstAccount] = await wallet.getAccounts()
    const signer = firstAccount.address

    const unsigned_txn: MsgSwapEncodeObject = {
      typeUrl: '/sifnode.clp.v1.MsgSwap',
      value: {
        sentAsset: {
          symbol: sentAssetEntry.denom,
        },
        receivedAsset: {
          symbol: receivedAssetEntry.denom,
        },
        sentAmount,
        minReceivingAmount,
        signer,
      },
    }
    const client = await SigningStargateClient.connectWithSigner(
      config.sifRpc,
      wallet,
      {
        registry: new Registry([...NativeDexClient.getGeneratedTypes()]),
      }
    )

    const txnStatus = await client.signAndBroadcast(
      firstAccount.address,
      [unsigned_txn],
      config.fee
    )
    return txnStatus
  } catch (e) {
    console.log(e)
  }
}
