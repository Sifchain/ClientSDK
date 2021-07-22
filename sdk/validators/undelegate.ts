import { SigningCosmosClient, coin } from '@cosmjs/launchpad';
import {
	MsgUndelegateEncodeObject,
	SigningStargateClient,
} from '@cosmjs/stargate';
import { setupWallet, fee, broadcastUrl } from '../../wallet';

export const undelegate = async (amount: number, toValidator: string) => {
	const wallet = await setupWallet();
	const [firstAccount] = await wallet.getAccounts();

	const sender = firstAccount.address;

	const unsigned_txn: MsgUndelegateEncodeObject = {
		typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
		value: {
			delegatorAddress: sender,
			validatorAddress: toValidator,
			amount: coin(amount, 'rowan'),
		},
	};
	const client = await SigningStargateClient.connectWithSigner(
		broadcastUrl,
		wallet
	);
	// const
	const txnStatus = await client.signAndBroadcast(
		wallet.getAccounts()[0].address,
		[unsigned_txn],
		fee
	);

	return txnStatus;
};
