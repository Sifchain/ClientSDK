import { SigningCosmosClient } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl } from '../../wallet'

export const removeLiquidity = async (
  signer: string,
  externalAsset: string,
  wBasisPoints: number,
  asymmetry: number
) => {
  try {
    const wallet = await setupWallet()
    const [firstAccount] = await wallet.getAccounts()

    const sender = firstAccount.address

    const unsigned_txn = {
      type: 'clp/RemoveLiquidity',
      value: {
        signer,
        external_asset: externalAsset,
        w_basis_points: wBasisPoints,
        asymmetry,
      },
    }
    const client = new SigningCosmosClient(broadcastUrl, sender, wallet)
    const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)
    return txnStatus
  } catch (e) {
    console.log(e)
  }
}
