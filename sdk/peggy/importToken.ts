import { setupWallet, ethWallet } from '../../wallet'
import Web3 from 'web3'
import config from '../../config'
import { getToken, approveSpend, getWeb3 } from '../../lib/helper'
import { bridgeBank } from '../../lib/contracts'

const web3 = getWeb3()

// import
export const importToken = async (symbol: string, amount: string) => {

  const ethBalance = await web3.eth.getBalance(ethWallet.address)
  console.log({ ethBalance })

  const sifWallet = await setupWallet()
  const [sifAccount] = await sifWallet.getAccounts()
  const sifAddress = Web3.utils.utf8ToHex(sifAccount.address)

  const gas = (await web3.eth.getBlock("latest")).gasLimit // 150000

  ////////////////////////
  // ETH -> cETH
  ////////////////////////
  if (symbol.toLowerCase() === 'eth') {
    // lock
    const tx = {
      // nonce: await web3.eth.getTransactionCount(ethWallet.address),
      to: config.bridgeBankAddress,
      // from: ethWallet.address,
      value: amount,
      gas,
      data: bridgeBank().methods.lock(sifAddress, config.ethContractAddress, amount).encodeABI(),
    }

    const signed = await web3.eth.accounts.signTransaction(tx, ethWallet.privateKey);
    return await web3.eth.sendSignedTransaction(signed.rawTransaction)
  }

  ////////////////////////
  // eRowan -> Rowan
  ////////////////////////
  if (symbol.toLowerCase() === 'erowan') {
    // approve and burn

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
  const token = getToken(`c${symbol}`)
  if (token) {
    // approve and lock

    // amount of eth?
    await approveSpend(ethWallet.address, amount, gas)

    const tx = {
      // nonce: await web3.eth.getTransactionCount(ethWallet.address),
      to: config.bridgeBankAddress,
      // from: ethWallet.address,
      value: amount,
      // gas: 150000, //example
      gas,
      data: bridgeBank().methods.lock(sifAddress, token.address, amount).encodeABI(),
    }

    const signed = await web3.eth.accounts.signTransaction(tx, ethWallet.privateKey);
    return await web3.eth.sendSignedTransaction(signed.rawTransaction)

  }

  //else
  return `${symbol} token not in white list.`
}