import { SigningCosmosClient,
  coins,
  BroadcastMode,
  LcdClient,
  setupAuthExtension, } from '@cosmjs/launchpad'
import { setupEthbridgeExtension } from '../../lib/ethBridgeExtension'
import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import Web3 from 'web3'
import { bridgeBank, bridgeToken } from '../../lib/contracts'
import config from '../../config'

const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

// export
export const unPeg = async (symbol: string, amount: string) => {
  const wallet = await setupWallet()
  const [sifAccount] = await wallet.getAccounts()
  const sifAddress = Web3.utils.utf8ToHex(sifAccount.address)
  const ethereumChainId = await web3.eth.net.getId()

  const ethBalance = await web3.eth.getBalance(ethWallet.address)
  console.log({ ethBalance })

  const client = new SigningCosmosClient(
    broadcastUrl,
    sifAccount.address,
    wallet
  )

  const fee = {
    // Keplr overwrites this in app but for unit/integration tests where we
    // dont connect to keplr we need to specify an amount of rowan to pay for the fee.
    amount: coins(250000, "rowan"),
    gas: "500000", // TODO - see if "auto" setting
  }

  ////////////////////////
  // cETH -> ETH
  ////////////////////////
  if (symbol.toLowerCase() === 'ceth') {

  //  const sifUnsignedClient = LcdClient.withExtensions(
  //     // { apiUrl: apiUrl, broadcastMode: broadcastMode },
  //     { apiUrl: config.sifnodeLcdApi, broadcastMode: undefined},
  //     // setupAuthExtension,
  //     // setupClpExtension,
  //     setupEthbridgeExtension,
  //     // setupDispensationExtension,
  //   )

  //   const lol = await sifUnsignedClient.ethbridge.burn({
  //     ethereum_receiver: ethWallet.address,
  //     base_req: {
  //       chain_id: "sifchain",
  //       from: sifAccount.address,
  //     },
  //     amount,
  //     symbol: 'ceth',
  //     cosmos_sender: sifAccount.address,
  //     ethereum_chain_id: `${ethereumChainId}`,
  //     token_contract_address: "0x0000000000000000000000000000000000000000", //?
  //     ceth_amount: '70000000000000000', // fee,
  //   })

  //   console.log({lol: JSON.stringify(lol)});
    
    const unsigned_txn = {
      type: 'ethbridge/MsgBurn',
      value: {
        amount, // amount to send
        ceth_amount: '70000000000000000', // fee
        cosmos_sender: sifAccount.address,
        symbol: 'ceth',
        ethereum_chain_id: ethereumChainId,
        ethereum_receiver: ethWallet.address,
      },
    }

    return await client.signAndBroadcast([unsigned_txn], fee)
  }

  ////////////////////////
  // Rowan -> eRowan
  ////////////////////////

  if (symbol.toLowerCase() === 'rowan') {

    const unsigned_txn = {
      type: 'ethbridge/MsgLock',
      value: {
        amount,
        ceth_amount: '70000000000000000',
        cosmos_sender: sifAccount.address,
        symbol: 'rowan',
        ethereum_chain_id: ethereumChainId,
        ethereum_receiver: ethWallet.address,
      },
    }

    return await client.signAndBroadcast([unsigned_txn], fee)
  }
}
