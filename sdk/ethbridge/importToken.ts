import { setupWallet, ethWallet } from '../wallet'
import Web3 from 'web3'
import config from '../../config'
import { getERC20Token, getWeb3 } from './ethbridgeHelpers'
import { approveSpend } from './approveSpend'
import { bridgeBank } from './smartContracts/contracts'

const web3 = getWeb3()

export const importToken = async (symbol: string, amount: string) => {
  const sifWallet = await setupWallet('sif')
  const [sifAccount] = await sifWallet.getAccounts()
  const sifAddress = Web3.utils.utf8ToHex(sifAccount.address)

  const gas = (await web3.eth.getBlock('latest')).gasLimit // 150000
  const nonce = (await web3.eth.getTransactionCount(ethWallet.address)) + 1
  let tx

  // ETH -> cETH
  if (symbol.toLowerCase() === 'eth') {
    // lock
    tx = {
      nonce,
      to: config.bridgeBankAddress,
      value: amount,
      gas,
      data: bridgeBank()
        .methods.lock(sifAddress, config.ethContractAddress, amount)
        .encodeABI(),
    }
  }

  // eRowan -> Rowan
  if (symbol.toLowerCase() === 'erowan') {
    // approve and burn
    await approveSpend(ethWallet.address, amount, gas)

    tx = {
      nonce,
      to: config.bridgeBankAddress,
      value: 0,
      gas,
      data: bridgeBank()
        .methods.burn(sifAddress, config.bridgeTokenAddress, amount)
        .encodeABI(),
    }
  }

  // ERC20 -> cToken
  const erc20Token = getERC20Token(symbol)
  if (erc20Token && symbol !== 'eth') {
    // approve and lock
    await approveSpend(ethWallet.address, amount, gas)

    tx = {
      nonce,
      to: config.bridgeBankAddress,
      value: amount,
      gas,
      data: bridgeBank()
        .methods.lock(sifAddress, erc20Token.address, amount)
        .encodeABI(),
    }
  }

  const signed = await web3.eth.accounts.signTransaction(
    tx,
    ethWallet.privateKey
  )
  return await web3.eth.sendSignedTransaction(signed.rawTransaction)
}
