import { Registry } from '@cosmjs/proto-signing'
import { SigningStargateClient } from '@cosmjs/stargate'
import { NativeDexClient } from '../client'
import { setupWallet } from '../wallet'
import { MsgSwap } from '../generated/proto/sifnode/clp/v1/tx'
import config from '../../config'

type MsgSwapEncodeObject = {
  typeUrl: string
  value: MsgSwap
}

type Asset = {
  symbol: string
}

export const swap = async (
  sentAsset: string,
  receivedAsset: string,
  sentAmount: string,
  minReceivingAmount: string
) => {
  try {
    const wallet = await setupWallet('sif')
    const [firstAccount] = await wallet.getAccounts()

    const signer = firstAccount.address

    const unsigned_txn: MsgSwapEncodeObject = {
      typeUrl: '/sifnode.clp.v1.MsgSwap',
      value: {
        sentAsset: {
          symbol: sentAsset,
        },
        receivedAsset: {
          symbol: receivedAsset,
        },
        sentAmount: `${sentAmount}`,
        minReceivingAmount: `${minReceivingAmount}`,
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
