import { SigningStargateClient } from '@cosmjs/stargate';
import { setupWallet } from '../../wallet';
import { MsgAddLiquidity, MsgAddLiquidityResponse } from '../generated/proto/sifnode/clp/v1/tx';
import { NativeDexClient } from '../client';
import { Registry } from '@cosmjs/proto-signing';
import config from '../../config';

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
		const wallet = await setupWallet('sif');
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
			config.sifRpc,
			wallet,
			{
				registry: new Registry([...NativeDexClient.getGeneratedTypes()])
			}
		);
		const txnStatus = await client.signAndBroadcast(
			firstAccount.address,
			[unsigned_txn],
			config.fee
		);
		return txnStatus;
	} catch (error) {
		console.log(error);
	}
};