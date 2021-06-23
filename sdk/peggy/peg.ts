import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import Web3 from 'web3'
import config from '../../config'
import { isERC20 } from '../../lib/helper'
import { bridgeBank, bridgeToken } from '../../lib/contracts'

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))

// import
export const peg = async (amount: number, symbol: string) => {

  const ethBalance = await web3.eth.getBalance(ethWallet.address)
  const gasPrice = await web3.eth.getGasPrice()
  console.log({ ethBalance, gasPrice })

  const sifWallet = await setupWallet()
  const [sifAccount] = await sifWallet.getAccounts()
  const sifAddress = Web3.utils.utf8ToHex(sifAccount.address)

  const tx = {
    from: ethWallet.address,
    value: amount,
    // to: '0x3535353535353535353535353535353535353535',
    // gas: "21000", //optional
    // gasPrice: "20000000000",
    // data: "",
  }

  if (symbol.toLocaleLowerCase() === 'eth') {
    // lock
    // the lock function is called for ethereum native assets

    const token = '0x03f7cef050aac29954a97334c00920aa8919dc37' // tokenAddress, 0x if ethereum
    // Solidity: function lock(bytes _recipient, address _token, uint256 _amount)
    const res = await bridgeBank().methods.lock(sifAddress, token, amount).call()
    return res
  }

  if (symbol.toLocaleLowerCase() === 'rowan') {
    // approve and burn
    const token = '0x' // tokenAddress, 0x if ethereum

    // params: argv.ethereum_address, argv.bridgebank_address, requestParameters
    const allowance = await bridgeToken().methods.allowance(ethWallet.address).call()
    if (BigInt(allowance) > BigInt(amount)) {
      // argv.bridgebank_address, sifchainUtilities.SOLIDITY_MAX_INT, requestParameters
      const approveResponse = await bridgeToken().methods.approve().call()
    }

    // The burn function is called for cosmos native assets
    const res = bridgeBank().methods.burn(sifAddress, token, amount).call()
  }

  if (isERC20(symbol)) {
    // approve and lock
    // the lock function is called for ethereum native assets
    const token = '0x0' // tokenAddress, 0x if ethereum

    // params: argv.ethereum_address, argv.bridgebank_address, requestParameters
    const allowance = await bridgeToken().methods.allowance(ethWallet.address).call()
    if (BigInt(allowance) > BigInt(amount)) {
      // argv.bridgebank_address, sifchainUtilities.SOLIDITY_MAX_INT, requestParameters
      const approveResponse = await bridgeToken().methods.approve().call()
    }

    // Solidity: function lock(bytes _recipient, address _token, uint256 _amount)
    const lockPromise = bridgeBank().methods.lock(sifAddress, token, amount).call()
  }
}
