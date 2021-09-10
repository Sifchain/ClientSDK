import { StdFee, coin } from '@cosmjs/launchpad';
import { SigningStargateClient } from '@cosmjs/stargate';
import { setupWallet, fee, broadcastUrl } from '../../wallet';
import { MsgRemoveLiquidity, MsgRemoveLiquidityResponse } from '../generated/proto/sifnode/clp/v1/tx';
import { NativeDexClient } from '../client';
import { Registry } from '@cosmjs/proto-signing';

type MsgRemoveLiquidityEncodeObject = {
	typeUrl: string,
	value: MsgRemoveLiquidity
}

type Asset = {
	symbol: string,
}

export const removeLiquidity = async (
	externalAsset: string,
	wBasisPoints: string,
	asymmetry: string
) => {
	try {
		const wallet = await setupWallet();
		const [firstAccount] = await wallet.getAccounts();
		const signer = firstAccount.address;

		const unsigned_txn: MsgRemoveLiquidityEncodeObject = {
			typeUrl: '/sifnode.clp.v1.MsgRemoveLiquidity',
			value: {
				signer,
				externalAsset: { symbol: externalAsset },
				wBasisPoints,
				asymmetry,
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
	} catch (error) {
		console.log(error);
	}
};
