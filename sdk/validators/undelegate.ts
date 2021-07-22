import { SigningCosmosClient, coin } from '@cosmjs/launchpad';
import { SigningStargateClient } from '@cosmjs/stargate';
import { setupWallet, fee, broadcastUrl } from '../../wallet';

export const undelegate = async (amount: number, toValidator: string) => {
	const wallet = await setupWallet();
	const [firstAccount] = await wallet.getAccounts();

	const sender = firstAccount.address;

	const unsigned_txn = {
		typeUrl: 'cosmos-sdk/MsgUndelegate',
		value: {
			delegator_address: sender,
			validator_address: toValidator,
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
