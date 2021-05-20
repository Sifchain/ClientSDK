import { SigningCosmosClient } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl } from '../../wallet'

//@TODO - Figure out if this needs to go through infura or some other provider.
export const burnOrLock = async (
  ethChainId: string,
  tokenContract: string,
  cosmosSender: string,
  ethReceiver: string,
  amount: number,
  symbol: string,
  cEthAmount: string
) => {
  try {
    const wallet = await setupWallet()
    const [firstAccount] = await wallet.getAccounts()

    const sender = firstAccount.address

    const unsigned_txn = {
      type: 'clp/RemoveLiquidity',
      value: {
        ethereum_chain_id: ethChainId,
        token_contract_address: tokenContract,
        cosmos_sender: cosmosSender,
        ethereum_receiver: ethReceiver,
        amount,
        symbol,
        ceth_amount: cEthAmount,
      },
    }
    const client = new SigningCosmosClient(broadcastUrl, sender, wallet)
    const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)
    return txnStatus
  } catch (e) {
    console.log(e)
  }
}
