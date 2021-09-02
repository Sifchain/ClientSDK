import { SigningCosmosClient, coin } from '@cosmjs/launchpad';
import { SigningStargateClient } from '@cosmjs/stargate';
import { setupWallet, fee, broadcastUrl } from '../../wallet';

export const swap = async (
	sentAsset: string,
	receivedAsset: string,
	sentAmount: number,
	minReceivingAmount: number,
	signer: string
) => {
	try {
		const wallet = await setupWallet();
		const [firstAccount] = await wallet.getAccounts();

		const sender = firstAccount.address;

		const unsigned_txn = {
			typeUrl: 'clp/Swap',
			value: {
				sent_asset: sentAsset,
				received_asset: receivedAsset,
				sent_amount: coin(sentAmount, 'rowan'),
				min_receiving_amount: coin(minReceivingAmount, 'rowan'),
				signer,
			},
		};
		const client = await SigningStargateClient.connectWithSigner(
			broadcastUrl,
			wallet
		);
		const txnStatus = await client.signAndBroadcast(
			wallet.getAccounts()[0].address,
			[unsigned_txn],
			fee
		);
		return txnStatus;
	} catch (e) {
		console.log(e);
	}
};
