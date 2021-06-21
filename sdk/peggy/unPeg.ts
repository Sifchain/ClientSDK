import { SigningCosmosClient, coin } from '@cosmjs/launchpad'
import { setupWallet, fee, broadcastUrl, ethWallet } from '../../wallet'
import { BridgeBankABI } from '../../BridgeBank'
import Web3 from 'web3'

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
const bridgeBankAddress = 'sif1l3dftf499u4gvdeuuzdl2pgv4f0xdtnuuwlzp8'
const bridgeBankContractAddress = '0x80E6A5D9a855D855AD6Fc9912d685b8dFdE24104'
const bridgeBankContracts = new web3.eth.Contract(JSON.parse(BridgeBankABI), bridgeBankContractAddress)


export const unPeg = async () => {

    const recipient = 'sifAddress'
    const intendedRecipient = 'lol' // address of the user receiving tokens
    const symbol = 'ceth' // '// symbol of the token to be sent
    const amount = 1000

    // These two functions deal with giving users tokens on ethereum in exchange for their sifchain assets or pegged assets.
    const unlockPromise = bridgeBankContracts.methods.unlock(recipient, symbol, amount).call()
    const mintPromise = bridgeBankContracts.methods.mint(intendedRecipient, amount).call()

    const [ unlockRes, mintRes ] = await Promise.all([unlockPromise, mintPromise])
}
