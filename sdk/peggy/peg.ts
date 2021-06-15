import { SigningCosmosClient, coin } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl } from '../../wallet'

export const peg = async (amount: number, toValidator: string) => {
    const wallet = await setupWallet()
    const [firstAccount] = await wallet.getAccounts()

    const sender = firstAccount.address

    // const unsigned_txn = {
    //     type: 'cosmos-sdk/MsgUndelegate',
    //     value: {
    //         delegator_address: sender,
    //         validator_address: toValidator,
    //         amount: coin(amount, 'rowan'),
    //     },
    // }

    const client = new SigningCosmosClient(broadcastUrl, sender, wallet)
    const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)

    return txnStatus
}
