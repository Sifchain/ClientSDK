import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import Web3 from 'web3'
import config from '../../config'
import { getToken, approveSpend } from '../../lib/helper'
import { bridgeBank, bridgeToken } from '../../lib/contracts'

const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

// import
export const peg = async (symbol: string, amount: string) => {

  const ethBalance = await web3.eth.getBalance(ethWallet.address)
  const gasPrice = await web3.eth.getGasPrice()
  console.log({ ethBalance, gasPrice })

  const sifWallet = await setupWallet()
  const [sifAccount] = await sifWallet.getAccounts()

  const sifAddress = Web3.utils.utf8ToHex(sifAccount.address)

  
  ////////////////////////
  // ETH -> cETH
  ////////////////////////
  if (symbol.toLocaleLowerCase() === 'eth') {
    
    const tx = {
      from: ethWallet.address,
      value: amount,
      gas: 150000,
    }
    // Solidity: function lock(bytes _recipient, address _token, uint256 _amount)
    // return await new Promise((resolve, reject) => {
      return await bridgeBank().methods
        .lock(sifAddress, config.ethContractAddress, amount)
        .send(tx)
        // .on("transactionHash", (hash: string) => {
        //   resolve("lockToSifchain: bridgeBankContract.lock TX" + hash)
        // })
        // .on("error", (err: any) => {
        //   reject("lockToSifchain: bridgeBankContract.lock ERROR" + err)
        // })
    // })
  }

  ////////////////////////
  // eRowan -> Rowan
  ////////////////////////
  if (symbol.toLocaleLowerCase() === 'erowan') {
    // approve and burn

    const tx = {
      from: ethWallet.address,
      value: 0, // don't know why this is zero for burn to sifchain
      gas: 150000,
    }

    await approveSpend(ethWallet.address, amount)

    // Burn eRowan to Rowan
    return await bridgeBank().methods
      .burn(sifAddress, config.bridgeTokenAddress, amount)
      .send(tx)

    // return res
  }

  ////////////////////////
  // ERC20 -> cToken
  ////////////////////////
  const token = getToken(symbol)
  if (token) {
    // approve and lock

    await approveSpend(ethWallet.address, amount)

    const tx = {
      from: ethWallet.address,
      value: 0, // don't know why this is zero for burn to sifchain
      gas: 150000,
    }

    const lockPromise = bridgeBank().methods
      .lock(sifAddress, token.contract_address, amount)
      .call()
  }

  //else
  return `${symbol} token not in white list.`
}
