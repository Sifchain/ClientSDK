import { StdFee, coin } from '@cosmjs/launchpad';
import { SigningStargateClient } from '@cosmjs/stargate';
import { setupWallet, fee, broadcastUrl } from '../../wallet';
import { MsgAddLiquidity, MsgAddLiquidityResponse } from '../generated/proto/sifnode/clp/v1/tx';
import { NativeDexClient } from '../client';
import { Registry } from '@cosmjs/proto-signing';

type MsgAddLiquidityEncodeObject = {
	typeUrl: string,
	value: MsgAddLiquidity
}

type Asset = {
	symbol: string,
}

export const addLiquidity = async (
	externalAsset: string,
	externalAssetAmount: number,
	nativeAssetAmount: number
) => {
	try {
		const wallet = await setupWallet();
		const [firstAccount] = await wallet.getAccounts();
		const signer = firstAccount.address;

		const unsigned_txn: MsgAddLiquidityEncodeObject = {
			typeUrl: '/sifnode.clp.v1.MsgAddLiquidity',
			value: {
				signer,
				externalAsset: { symbol: externalAsset },
				nativeAssetAmount: `${nativeAssetAmount}`,
				externalAssetAmount: `${externalAssetAmount}`,
			},
		};
		const client = await SigningStargateClient.connectWithSigner(
			broadcastUrl,
			wallet,
			{
				registry: new Registry([...NativeDexClient.getGeneratedTypes()])
			}
		);
		const fee: StdFee = {
			amount: [
				{
					denom: 'rowan',
					amount: '150000',
				},
			],
			gas: '300000',
		};
		const txnStatus = await client.signAndBroadcast(
			firstAccount.address,
			[unsigned_txn],
			fee
		);
		return txnStatus;
	} catch (e) {
		console.log(e);
	}
};