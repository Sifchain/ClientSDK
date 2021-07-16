import { SigningCosmosClient, coins } from '@cosmjs/launchpad'
import { setupWallet, ethWallet } from '../../wallet'
import config from '../../config'
import { getWeb3 } from '../../lib/helper'

const web3 = getWeb3()

// export
export const exportToken = async (symbol: string, amount: string) => {

  const sifWallet = await setupWallet()
  const [sifAccount] = await sifWallet.getAccounts()
  const ethereumChainId = await web3.eth.net.getId()
  const client = new SigningCosmosClient(config.sifnodeLcdApi, sifAccount.address, sifWallet)
  const fee = { amount: coins(250000, "rowan"), gas: "500000" }
  const cEthFee = '70000000000000000' //threshold
  // const type = (symbol.toLowerCase() === 'rowan') ? 'MsgLock' : 'MsgBurn'
  const type = (symbol.toLowerCase() === 'ceth') ? 'MsgBurn' : 'MsgLock'
  // const type = 'MsgLock'

  // // cETH -> ETH
  // if (symbol.toLowerCase() === 'ceth') {
  //   type = 'ethbridge/MsgBurn'
  // }

  // // Rowan -> eRowan // cERC20 also seem to need lock
  // if (symbol.toLowerCase() === 'rowan') {
  //   type = 'ethbridge/MsgLock'
  // }

  const unsignedTxn = {
    type: `ethbridge/${type}`,
    value: {
      amount, // amount to send
      ceth_amount: cEthFee,
      cosmos_sender: sifAccount.address,
      symbol, // sif token e.g: ceth, rowan
      ethereum_chain_id: ethereumChainId.toString(),
      ethereum_receiver: ethWallet.address,
    },
  }

  return await client.signAndBroadcast([unsignedTxn], fee)
}
