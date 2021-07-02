import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import Web3 from 'web3'
import config from '../../config'
import { getToken, approveSpend } from '../../lib/helper'
import { bridgeBank, bridgeToken } from '../../lib/contracts'
// var Tx = require('ethereumjs-tx').Transaction;

const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

// import
export const peg = async (symbol: string, amount: string) => {

  const ethBalance = await web3.eth.getBalance(ethWallet.address)
  console.log({ ethBalance })

  const sifWallet = await setupWallet()
  const [sifAccount] = await sifWallet.getAccounts()

  const sifAddress = Web3.utils.utf8ToHex(sifAccount.address)

  
  ////////////////////////
  // ETH -> cETH
  ////////////////////////
  if (symbol.toLocaleLowerCase() === 'eth') {

    const tx = {
      nonce: await web3.eth.getTransactionCount(ethWallet.address),
      to: config.bridgeBankAddress,
      // from: ethWallet.address, // don't think you "from" when signing
      // value: web3.utils.toHex(amount), // when sending contract executino send data instead of value
      // gas: web3.utils.toHex(150000),
      gas: (await web3.eth.getBlock("latest")).gasLimit,
      data: bridgeBank().methods.lock(sifAddress, config.ethContractAddress, amount).encodeABI(),
    }

    const signed = await web3.eth.accounts.signTransaction(tx, ethWallet.privateKey);
    // const signed = await ethWallet.signTransaction(tx)    

    return await web3.eth.sendSignedTransaction(signed.rawTransaction)


    // Sign the transaction
    // const tx = new Tx(txObject, { chain: 'ropsten' })
    // const privateKeyBuffer = Buffer.from(ethWallet.privateKey.slice(2), 'hex')
    // tx.sign(privateKeyBuffer)
    // const serializedTx = tx.serialize()
    // const raw = '0x' + serializedTx.toString('hex')
    // return await web3.eth.sendSignedTransaction(raw)


    // const tx = {
    //   from: ethWallet.address,
    //   value: amount,
    //   gas: 150000,
    // }
    // // Solidity: function lock(bytes _recipient, address _token, uint256 _amount)
    // return await bridgeBank().methods
    //   .lock(sifAddress, config.ethContractAddress, amount)
    //   .send(tx)
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
