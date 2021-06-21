import { SigningCosmosClient, coin } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import Web3 from 'web3'
import axios from 'axios'
import config from '../../config'

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
// const contractAddress = '0x07bac35846e5ed502aa91adf6a9e7aa210f2dcbe'
// const { abi } = require('../../BridgeToken.json')
// const smartContract = new web3.eth.Contract(abi, contractAddress)

const bridgeBankAddress = 'sif1l3dftf499u4gvdeuuzdl2pgv4f0xdtnuuwlzp8'
import { BridgeBankABI } from '../../BridgeBank'
const bridgeBankContractAddress = '0x80E6A5D9a855D855AD6Fc9912d685b8dFdE24104'
const bridgeBankContracts = new web3.eth.Contract(JSON.parse(BridgeBankABI), bridgeBankContractAddress)


export const peg = async (amount: number, symbol: string) => {

    const ethBalance = await web3.eth.getBalance(ethWallet.address)
    const gasPrice = await web3.eth.getGasPrice()
    console.log({ ethBalance, gasPrice })

    // const txObject = {
    //     from: ethWallet.address,
    //     to: '0x3535353535353535353535353535353535353535',
    //     value: "1000000000000000000",
    //     gas: "21000", //optional
    //     gasPrice: "20000000000", 1114252095'
    //     data: ""
    // }
    
    // const signedTransaction = await web3.eth.signTransaction(txObject, ethWallet.privateKey)
    // const receipt = await web3.eth.sendSignedTransaction(signedTransaction.raw)

    const tx = {
        from: ethWallet.address,
        value: amount,
    }

    // const recipient = bridgeBankAddress

    // Solidity: function lock(bytes _recipient, address _token, uint256 _amount)
    const recipient = 'sifAddress'
    const token = 'ceth' // tokenAddress, 0x if ethereum
    // const amount = 1000 // 
    const wallet = await setupWallet()
    const [sifAccount] = await wallet.getAccounts()


    // processes the lockup of cosmos coins from the given sender
    // These two functions handle moving assets from sifchain to ethereum.

    // the lock function is called for ethereum native assets
    const lockPromise = bridgeBankContracts.methods.lock(ethWallet.address, token, amount).call()
    // The burn function is called for cosmos native assets
    const burnPromise = bridgeBankContracts.methods.burn(ethWallet.address, token, amount).call()

    const [ lockRes, burnRes ] = await Promise.all([lockPromise, burnPromise])






    return {lockRes, burnRes}

    // const unsigned_txn = {
    //     type: 'cosmos-sdk/MsgUndelegate',
    //     value: {
    //         delegator_address: sender,
    //         validator_address: toValidator,
    //         amount: coin(amount, 'rowan'),
    //     },
    // }

    // const client = new SigningCosmosClient(broadcastUrl, sender, wallet)
    // const txnStatus = await client.signAndBroadcast([unsigned_txn], fee)
}
