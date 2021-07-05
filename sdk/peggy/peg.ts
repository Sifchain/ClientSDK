import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import Web3 from 'web3'
import config from '../../config'
import { getToken, approveSpend } from '../../lib/helper'
import { bridgeBank } from '../../lib/contracts'

const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

// import
export const peg = async (symbol: string, amount: string) => {

  const ethBalance = await web3.eth.getBalance(ethWallet.address)
  console.log({ ethBalance })

  const sifWallet = await setupWallet()
  const [sifAccount] = await sifWallet.getAccounts()
  const sifAddress = Web3.utils.utf8ToHex(sifAccount.address)

  const gas = (await web3.eth.getBlock("latest")).gasLimit

  ////////////////////////
  // ETH -> cETH
  ////////////////////////
  if (symbol.toLocaleLowerCase() === 'eth') {

    const tx = {
      // nonce: await web3.eth.getTransactionCount(ethWallet.address),
      to: config.bridgeBankAddress,
      // from: ethWallet.address,
      value: amount,
      // gas: 150000, //example
      gas,
      data: bridgeBank().methods.lock(sifAddress, config.ethContractAddress, amount).encodeABI(),
    }

    const signed = await web3.eth.accounts.signTransaction(tx, ethWallet.privateKey);
    return await web3.eth.sendSignedTransaction(signed.rawTransaction)
  }

  ////////////////////////
  // eRowan -> Rowan
  ////////////////////////
  if (symbol.toLocaleLowerCase() === 'erowan') {
    // approve and burn

    const tx0 = {
      from: ethWallet.address,
      value: 0, // don't know why this is zero for burn to sifchain
      gas,
    }

    await approveSpend(ethWallet.address, amount, gas)

    const tx = {
      // nonce: await web3.eth.getTransactionCount(ethWallet.address),
      to: config.bridgeBankAddress,
      value: 0,
      gas,
      data: bridgeBank().methods.burn(sifAddress, config.bridgeTokenAddress, amount).encodeABI(),
    }

    const signed = await web3.eth.accounts.signTransaction(tx, ethWallet.privateKey);
    return await web3.eth.sendSignedTransaction(signed.rawTransaction)
  }

  ////////////////////////
  // ERC20 -> cToken
  ////////////////////////
  // const token = getToken(symbol)
  // if (token) {
  //   // approve and lock

  //   await approveSpend(ethWallet.address, amount, gas)

  //   const tx = {
  //     from: ethWallet.address,
  //     value: 0, // don't know why this is zero for burn to sifchain
  //     gas: 150000,
  //   }

  //   const lockPromise = bridgeBank().methods
  //     .lock(sifAddress, token.contract_address, amount)
  //     .call()
  // }

  // //else
  // return `${symbol} token not in white list.`
}