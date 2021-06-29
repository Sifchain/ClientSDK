import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import Web3 from 'web3'
import config from '../../config'
import { getToken } from '../../lib/helper'
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
  
  ////////////////////////
  // ETH -> cETH
  ////////////////////////
  if (symbol.toLocaleLowerCase() === 'eth') {

    // lock
    // the lock function is called for ethereum native assets
    
    // Solidity: function lock(bytes _recipient, address _token, uint256 _amount)
    await bridgeBank().methods
      .lock(sifAddress, config.ethContractAddress, amount)
      .send(tx)
      .on("transactionHash", (hash: string) => {
        return "lockToSifchain: bridgeBankContract.lock TX" + hash
      })
      .on("error", (err: any) => {
        return "lockToSifchain: bridgeBankContract.lock ERROR" + err
      })

  }

  ////////////////////////
  // eRowan -> Rowan
  ////////////////////////
  if (symbol.toLocaleLowerCase() === 'erowan') {
    // approve and burn
    const tokenAddress = '0xec017ac9003d2906fc855258040a56c671a315d6' //https://ropsten.etherscan.io/token/0xec017ac9003d2906fc855258040a56c671a315d6

    // params: argv.ethereum_address, argv.bridgebank_address, requestParameters
    const allowance = await bridgeToken().methods
      .allowance(ethWallet.address, config.bridgeBankAddress)
      .call()

    if (BigInt(allowance) > BigInt(amount)) {
      // argv.bridgebank_address, sifchainUtilities.SOLIDITY_MAX_INT, requestParameters
      const approveResponse = await bridgeToken().methods.approve(config.bridgeBankAddress, amount).call()
    }
    // Burn eRowan to Rowan
    const res = bridgeBank().methods.burn(sifAddress, tokenAddress, amount).send(tx)
  }

  ////////////////////////
  // ERC20 -> cToken
  ////////////////////////
  const token = getToken(symbol)
  if (token) {
    // approve and lock

    const allowance = await bridgeToken().methods.allowance(ethWallet.address, config.bridgeBankAddress).call()
    if (BigInt(allowance) > BigInt(amount)) {
      const approveResponse = await bridgeToken().methods.approve(config.bridgeBankAddress, amount).call()
    }

    const lockPromise = bridgeBank().methods.lock(sifAddress, token.contract_address, amount).call()
  }
}
