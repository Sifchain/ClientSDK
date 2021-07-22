import { SigningCosmosClient, coin, coins } from '@cosmjs/launchpad';
import { SigningStargateClient } from '@cosmjs/stargate';
import { setupWallet, fee, broadcastUrl } from '../../wallet';

export const addLiquidity = async (
	externalAsset: string,
	externalAssetAmount: number,
	nativeAssetAmount: number,
	signer: string
) => {
	try {
		const wallet = await setupWallet();
		const [firstAccount] = await wallet.getAccounts();

		const unsigned_txn = {
			typeUrl: 'clp/AddLiquidity',
			value: {
				external_asset: externalAsset,
				external_asset_amount: coin(externalAssetAmount, 'rowan'),
				native_asset_amount: coin(nativeAssetAmount, 'rowan'),
				signer,
			},
		};
		const client = await SigningStargateClient.connectWithSigner(
			broadcastUrl,
			wallet
		);
		// const client = new SigningCosmosClient(broadcastUrl, sender, wallet)
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
