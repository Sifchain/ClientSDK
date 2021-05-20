import { SigningCosmosClient, coin } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl } from '../../wallet'
//import config from '../../config'
//import { ValidatorsApi } from 'sifchain'

export const delegate = async (amount: number, toValidator: string) => {
  try {
    const wallet = await setupWallet()
    const [firstAccount] = await wallet.getAccounts()

    const sender = firstAccount.address

    // Get Balance
    //const balances = await client.getAccount()
    //console.log(balances)

    // call the validatorAPI
    //    const sifApi = new ValidatorsApi(config.apiConfig)

    // const retObj = await sifApi.addDelegation(toValidator, amount.toString(), sender)

    const unsigned_txn = {
      type: 'cosmos-sdk/MsgDelegate',
      value: {
        delegator_address: sender,
        validator_address: toValidator,
        amount: coin(amount, 'rowan'),
      },
    }

    // Construct the required parameters

    // const unsigned_txn = retObj.data['unsigned_txn']
    // const fee = retObj.data['fee']
    // const lpcUrl = retObj.data['sifnodeAddr']

    const client = new SigningCosmosClient(broadcastUrl, sender, wallet)
    // const txn_amount = Number(unsigned_txn.value.amount)

    // unsigned_txn.value.amount = coin(txn_amount, 'rowan')

    //let fee = retObj.data['fee']
    // const fee_amount = Number(fee.amount)

    // fee.amount = coins(fee_amount, 'rowan')
    //const signed_txn = await client.sign([unsigned_txn], fee)

    //console.log('Signed Transaction:  ', signed_txn)

    const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)

    return txnStatus
  } catch (e) {
    console.log(e)
  }
}
