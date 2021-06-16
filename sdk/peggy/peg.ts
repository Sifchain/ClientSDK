import { SigningCosmosClient, coin } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'

export const peg = async (amount: number, symbol: string) => {

    const wallet = await setupWallet()
    const [firstAccount] = await wallet.getAccounts()
    const ethAddress = ethWallet.address

    const sifAddress = firstAccount.address

    // const unsigned_txn = {
    //     type: 'cosmos-sdk/MsgUndelegate',
    //     value: {
    //         delegator_address: sender,
    //         validator_address: toValidator,
    //         amount: coin(amount, 'rowan'),
    //     },
    // }

    // const client = new SigningCosmosClient(broadcastUrl, sender, wallet)
    // const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)

    return {
        ethAddress,
        sifAddress,
    }
}
