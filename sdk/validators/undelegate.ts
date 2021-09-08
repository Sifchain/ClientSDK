import { setupWallet, fee, broadcastUrl } from '../../wallet';
import { DirectSecp256k1HdWallet, Registry } from '@cosmjs/proto-signing';
import {
	assertIsBroadcastTxSuccess,
	MsgUndelegateEncodeObject,
	SigningStargateClient,
} from '@cosmjs/stargate';

// A message type auto-generated from .proto files using ts-proto. @cosmjs/stargate ships some
// common types but don't rely on those being available. You need to set up your own code generator
// for the types you care about. How this is done should be documented, but is not yet:
// https://github.com/cosmos/cosmjs/issues/640
import { MsgUndelegate } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx';
import { StdFee } from '@cosmjs/launchpad';

export const undelegate = async (amount: string, toValidator: string) => {
	const wallet = await setupWallet();
	const [firstAccount] = await wallet.getAccounts();

	const sender = firstAccount.address;

	const client = await SigningStargateClient.connectWithSigner(
		broadcastUrl,
		wallet
	);

	const msg: MsgUndelegate = {
		delegatorAddress: sender,
		validatorAddress: toValidator,
		amount: {
			denom: 'rowan',
			amount,
		},
	};
	const msgUnDelegate: MsgUndelegateEncodeObject = {
		typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
		value: msg,
	};
	const fee: StdFee = {
		amount: [
			{
				denom: 'rowan',
				amount: '150000',
			},
		],
		gas: '300000',
	};

	const result = await client.signAndBroadcast(
		firstAccount.address,
		[msgUnDelegate],
		fee
	);
	await assertIsBroadcastTxSuccess(result);
	return result;
};
