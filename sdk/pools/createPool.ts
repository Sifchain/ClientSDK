import { SigningCosmosClient, coin } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl } from '../../wallet'

export const createPool = async (
  externalAsset: string,
  externalAssetAmount: number,
  nativeAssetAmount: number,
  signer: string
) => {
  try {
    const wallet = await setupWallet()
    const [firstAccount] = await wallet.getAccounts()

    const sender = firstAccount.address

    const unsigned_txn = {
      type: 'clp/CreatePool',
      value: {
        external_asset: externalAsset,
        external_asset_amount: coin(externalAssetAmount, 'rowan'),
        native_asset_amount: coin(nativeAssetAmount, 'rowan'),
        signer,
      },
    }
    const client = new SigningCosmosClient(broadcastUrl, sender, wallet)
    const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)
    return txnStatus
  } catch (e) {
    console.log(e)
  }
}
