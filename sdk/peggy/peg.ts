import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import Web3 from 'web3'
import config from '../../config'
import { isERC20 } from '../../lib/helper'
import { bridgeBank, bridgeToken } from '../../lib/contracts'

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))

// import
export const peg = async (symbol: string, amount: number) => {

  const ethBalance = await web3.eth.getBalance(ethWallet.address)
  const gasPrice = await web3.eth.getGasPrice()
  console.log({ ethBalance, gasPrice })

  const sifWallet = await setupWallet()
  const [sifAccount] = await sifWallet.getAccounts()

  const sifAddress = Web3.utils.utf8ToHex(sifAccount.address)

  const tx = {
    from: ethWallet.address,
    value: amount,
    gas: 150000,
  }
  
  if (symbol.toLocaleLowerCase() === 'eth') {
    // ETH -> cETH
    // lock
    // the lock function is called for ethereum native assets
    
    const tokenContractAddress = '0x0000000000000000000000000000000000000000'
    // Solidity: function lock(bytes _recipient, address _token, uint256 _amount)
    await bridgeBank().methods
      .lock(sifAddress, tokenContractAddress, amount)
      .send(tx)
      .on("transactionHash", (hash: string) => {
        return "lockToSifchain: bridgeBankContract.lock TX" + hash
      })
      .on("error", (err: any) => {
        return "lockToSifchain: bridgeBankContract.lock ERROR" + err
      })

  }

  // if (symbol.toLocaleLowerCase() === 'rowan') {
  //   // approve and burn
  //   const token = '0x' // tokenAddress, 0x if ethereum

  //   // params: argv.ethereum_address, argv.bridgebank_address, requestParameters
  //   const allowance = await bridgeToken().methods.allowance(ethWallet.address).call()
  //   if (BigInt(allowance) > BigInt(amount)) {
  //     // argv.bridgebank_address, sifchainUtilities.SOLIDITY_MAX_INT, requestParameters
  //     const approveResponse = await bridgeToken().methods.approve().call()
  //   }

  //   // The burn function is called for cosmos native assets
  //   const res = bridgeBank().methods.burn(sifAddress, token, amount).call()
  // }

  // if (isERC20(symbol)) {
  //   // approve and lock
  //   // the lock function is called for ethereum native assets
  //   const token = '0x0' // tokenAddress, 0x if ethereum

  //   // params: argv.ethereum_address, argv.bridgebank_address, requestParameters
  //   const allowance = await bridgeToken().methods.allowance(ethWallet.address).call()
  //   if (BigInt(allowance) > BigInt(amount)) {
  //     // argv.bridgebank_address, sifchainUtilities.SOLIDITY_MAX_INT, requestParameters
  //     const approveResponse = await bridgeToken().methods.approve().call()
  //   }

  //   // Solidity: function lock(bytes _recipient, address _token, uint256 _amount)
  //   const lockPromise = bridgeBank().methods.lock(sifAddress, token, amount).call()
  // }
}
