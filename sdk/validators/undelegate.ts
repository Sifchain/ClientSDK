import { setupWallet } from '../wallet'
import {
  assertIsBroadcastTxSuccess,
  MsgUndelegateEncodeObject,
  SigningStargateClient,
} from '@cosmjs/stargate'
import config from '../../config'

// A message type auto-generated from .proto files using ts-proto. @cosmjs/stargate ships some
// common types but don't rely on those being available. You need to set up your own code generator
// for the types you care about. How this is done should be documented, but is not yet:
// https://github.com/cosmos/cosmjs/issues/640
import { MsgUndelegate } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx'

export const undelegate = async (amount: string, validatorAddress: string) => {
  const wallet = await setupWallet('sif')
  const [firstAccount] = await wallet.getAccounts()

  const sender = firstAccount.address

  const client = await SigningStargateClient.connectWithSigner(
    config.sifRpc,
    wallet
  )

  const msg: MsgUndelegate = {
    delegatorAddress: sender,
    validatorAddress,
    amount: {
      denom: 'rowan',
      amount,
    },
  }
  const msgUnDelegate: MsgUndelegateEncodeObject = {
    typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: msg,
  }

  const result = await client.signAndBroadcast(
    firstAccount.address,
    [msgUnDelegate],
    config.fee
  )
  await assertIsBroadcastTxSuccess(result)
  return result
}
