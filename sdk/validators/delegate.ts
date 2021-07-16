// import { SigningCosmosClient, coin } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl } from '../../wallet'
import { DirectSecp256k1HdWallet, Registry } from '@cosmjs/proto-signing';
import {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
  StargateClient,
} from '@cosmjs/stargate';
//import config from '../../config'
//import { ValidatorsApi } from 'sifchain'

// A message type auto-generated from .proto files using ts-proto. @cosmjs/stargate ships some
// common types but don't rely on those being available. You need to set up your own code generator
// for the types you care about. How this is done should be documented, but is not yet:
// https://github.com/cosmos/cosmjs/issues/640
import { MsgDelegate } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx'

export const delegate = async (amount: string, toValidator: string) => {
  const wallet = await setupWallet()
  const [firstAccount] = await wallet.getAccounts()

  const sender = firstAccount.address

  // Get Balance
  //const balances = await client.getAccount()
  //console.log(balances)
  
  const client = await SigningStargateClient.connectWithSigner(
    broadcastUrl,
    wallet,
    // { registry: registry } // what's this?
    );

  const msg = MsgDelegate.encode({
    delegatorAddress: sender,
    validatorAddress: toValidator,
    amount: {
      denom: 'rowan',
      amount,
    },
  })
  const msgAny = {
    typeUrl: msgDelegateTypeUrl,
    value: msg,
  }
  const fee = {
    amount: [
      {
        denom: 'rowan',
        amount: '150000',
      },
    ],
    gas: '300000',
  }    

  const result = await client.signAndBroadcast(
    firstAccount.address,
    [msgAny],
    fee,
    // memo
  );
  assertIsBroadcastTxSuccess(result);
}
