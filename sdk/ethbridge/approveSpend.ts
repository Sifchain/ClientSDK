import { bridgeToken } from './smartContracts/contracts'
import config from '../../config'
import { ethWallet } from '../../wallet'
import { getWeb3 } from '../helpers'
const web3 = getWeb3()

export const approveSpend = async function (
  ethAddress: string,
  amount: string,
  gas: number
) {
  const allowance = await bridgeToken()
    .methods.allowance(ethAddress, config.bridgeBankAddress)
    .call()

    //   console.log({ allowance })

  if (BigInt(amount) <= BigInt(allowance)) {
    // argv.bridgebank_address, sifchainUtilities.SOLIDITY_MAX_INT, requestParameters
    return {
      message: 'spend already approved',
      allowance,
    }
  }

  const tx = {
    nonce: (await web3.eth.getTransactionCount(ethWallet.address)) + 1,
    to: config.bridgeTokenAddress,
    // from: ethWallet.address,
    value: 0,
    gas,
    data: bridgeToken()
      .methods.approve(config.bridgeBankAddress, amount)
      .encodeABI(),
  }

  const signed = await web3.eth.accounts.signTransaction(
    tx,
    ethWallet.privateKey
  )
  const approveRes = await web3.eth.sendSignedTransaction(signed.rawTransaction)

  return approveRes
}
