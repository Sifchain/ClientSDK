import { setupWallet } from '../../wallet';
import {
	assertIsBroadcastTxSuccess,
	MsgDelegateEncodeObject,
	SigningStargateClient,
} from '@cosmjs/stargate';
import config from '../../config';

// A message type auto-generated from .proto files using ts-proto. @cosmjs/stargate ships some
// common types but don't rely on those being available. You need to set up your own code generator
// for the types you care about. How this is done should be documented, but is not yet:
// https://github.com/cosmos/cosmjs/issues/640
import { MsgDelegate } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx';

export const delegate = async (amount: string, toValidator: string) => {
	const wallet = await setupWallet('sif');
	const [firstAccount] = await wallet.getAccounts();

	const sender = firstAccount.address;

	const client = await SigningStargateClient.connectWithSigner(
		config.sifRpc,
		wallet
	);

	const msg: MsgDelegate = {
		delegatorAddress: sender,
		validatorAddress: toValidator,
		amount: {
			denom: 'rowan',
			amount,
		},
	};
	const msgDelegate: MsgDelegateEncodeObject = {
		typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
		value: msg,
	};

	const result = await client.signAndBroadcast(
		firstAccount.address,
		[msgDelegate],
		config.fee
	);
	await assertIsBroadcastTxSuccess(result);
	return result;
};
