import { SigningCosmosClient, coin } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl } from '../../wallet'

export const swap = async (
  sentAsset: string,
  receivedAsset: string,
  sentAmount: number,
  minReceivingAmount: number,
  signer: string
) => {
  try {
    const wallet = await setupWallet()
    const [firstAccount] = await wallet.getAccounts()

    const sender = firstAccount.address

    const unsigned_txn = {
      type: 'clp/Swap',
      value: {
        sent_asset: sentAsset,
        received_asset: receivedAsset,
        sent_amount: coin(sentAmount, 'rowan'),
        min_receiving_amount: coin(minReceivingAmount, 'rowan'),
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
