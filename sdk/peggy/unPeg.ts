import { SigningCosmosClient, coin } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import Web3 from 'web3'
import { bridgeBank, bridgeToken } from '../../lib/contracts'
import config from '../../config'

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))

// export
export const unPeg = async (symbol: string, amount: number) => {
  const wallet = await setupWallet()
  const [firstAccount] = await wallet.getAccounts()
  const sifAddress = Web3.utils.utf8ToHex(firstAccount.address)
  const ethereumChainId = await web3.eth.net.getId()

  const tx = {
    from: ethWallet.address,
    value: amount,
    gas: 150000,
  }

  ////////////////////////
  // cETH -> ETH
  ////////////////////////
  if (symbol.toLocaleLowerCase() === 'ceth') {

    await bridgeBank()
      .methods.burn(sifAddress, config.ethContractAddress, amount)
      .send(tx)
      .on('transactionHash', (hash: string) => {
        console.log('burnToSifchain: bridgeBankContract.burn TX', hash)
      })
      .on('error', (err: any) => {
        console.log('burnToSifchain: bridgeBankContract.burn ERROR', err)
      })


    const unsigned_txn = {
      type: 'ethbridge/MsgBurn',
      value: {
        amount: '2000000000000000000',
        ceth_amount: '70000000000000000',
        cosmos_sender: firstAccount.address,
        symbol: 'ceth',
        ethereum_chain_id: `${ethereumChainId}`,
        ethereum_receiver: ethWallet.address,
      },
    }

    const client = new SigningCosmosClient(
      broadcastUrl,
      firstAccount.address,
      wallet
    )
    const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)

    return txnStatus
  }

  ////////////////////////
  // Rowan -> eRowan
  ////////////////////////

  if (symbol.toLocaleLowerCase() === 'rowan') {

    await bridgeBank().methods
    .lock(sifAddress, config.ethContractAddress, amount)
    .send(tx)
    .on("transactionHash", (hash: string) => {
      return "lockToSifchain: bridgeBankContract.lock TX" + hash
    })
    .on("error", (err: any) => {
      return "lockToSifchain: bridgeBankContract.lock ERROR" + err
    })

    const unsigned_txn = {
      type: 'ethbridge/MsgBurn',
      value: {
        amount: '2000000000000000000',
        ceth_amount: '70000000000000000',
        cosmos_sender: firstAccount.address,
        symbol: 'rowan',
        ethereum_chain_id: `${ethereumChainId}`,
        ethereum_receiver: ethWallet.address,
      },
    }

    const client = new SigningCosmosClient(
      broadcastUrl,
      firstAccount.address,
      wallet
    )
    const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)

    return txnStatus
  }
}
