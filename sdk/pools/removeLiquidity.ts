import { SigningStargateClient } from '@cosmjs/stargate'
import { setupWallet } from '../wallet'
import {
  MsgRemoveLiquidity,
  MsgRemoveLiquidityResponse,
} from '../generated/proto/sifnode/clp/v1/tx'
import { NativeDexClient } from '../client'
import { Registry } from '@cosmjs/proto-signing'
import config from '../../config'
import { getDexEntryFromSymbol } from '../helpers'

type MsgRemoveLiquidityEncodeObject = {
  typeUrl: string
  value: MsgRemoveLiquidity
}

type Asset = {
  symbol: string
}

export const removeLiquidity = async (
  externalAssetSymbol: string,
  wBasisPoints: string,
  asymmetry: string
) => {
  try {
    const { denom } = await getDexEntryFromSymbol(externalAssetSymbol)

    const wallet = await setupWallet('sif')
    const [firstAccount] = await wallet.getAccounts()
    const signer = firstAccount.address

    const unsigned_txn: MsgRemoveLiquidityEncodeObject = {
      typeUrl: '/sifnode.clp.v1.MsgRemoveLiquidity',
      value: {
        signer,
        externalAsset: { symbol: denom },
        wBasisPoints,
        asymmetry,
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
  } catch (error) {
    console.log(error)
  }
}
