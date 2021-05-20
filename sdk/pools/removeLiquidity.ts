import { SigningCosmosClient, coin, coins } from '@cosmjs/launchpad'
import { setupWallet } from '../../wallet'

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
            asymmetry
        },
      }
    const fee = {
        amount: coins(150000, 'rowan'),
        gas: '300000',
    }
      
    const broadcastUrl = 'https://api-testnet.sifchain.finance'
    const client = new SigningCosmosClient(broadcastUrl, sender, wallet)
    const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)
    return txnStatus
  } catch (e) {
    console.log(e)
  }
}
