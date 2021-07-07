import { peg } from '../sdk/peggy/peg'
import { unPeg } from '../sdk/peggy/unPeg'
import config from '../config'
import {
  Secp256k1HdWallet,
  SigningCosmosClient,
  coins,
  LcdClient,
} from "@cosmjs/launchpad";
import { setupWallet, ethWallet } from '../wallet'
import { advanceBlock, sleep } from '../lib/helper'
import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

describe('test peg feature', () => {

  it("should peg eth => cEth", async () => {
    try {
      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)

      // check balance before peg
      const accountBefore = await client.getAccount(address)
      const cEthBalanceBefore = accountBefore.balance.find(b => b.denom === 'ceth').amount
      
      const pegAmount = '3000000000000000001'
      const pegRes = await peg('eth', pegAmount)
      console.log({ pegRes })

      await advanceBlock(1001)

      // check balance after peg
      const accountAfter = await client.getAccount(address)
      const cEthBalanceAfter = accountAfter.balance.find(b => b.denom === 'ceth').amount

      console.log({ cEthBalanceBefore, cEthBalanceAfter });

      expect(BigInt(cEthBalanceBefore) + BigInt(pegAmount)).toEqual(BigInt(cEthBalanceAfter))

    } catch (error) {
      console.log(error)

    }
  }, 999999)

  it('should peg eRowan => Rowan.', async () => {

    const sifWallet = await setupWallet()
    const [{ address }] = await sifWallet.getAccounts()
    const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)
    // check balance before peg
    const accountBefore = await client.getAccount(address)
    console.log({ accounts: accountBefore.balance });
    
    const rowanBalanceBefore = accountBefore.balance
      .find(b => b.denom === 'rowan').amount

    const pegAmount = '10000000000000000001'
    const pegRes = await peg('erowan', pegAmount)
    console.log({ pegRes })

    await advanceBlock(2011)

    // check balance after peg
    const accountAfter = await client.getAccount(address)
    const rowanBalanceAfter = accountAfter.balance
      .find(b => b.denom === 'rowan').amount

    console.log({ rowanBalanceBefore, rowanBalanceAfter });

    expect(BigInt(rowanBalanceBefore) + BigInt(pegAmount)).toEqual(BigInt(rowanBalanceAfter))

  })
})

describe('test unPeg feature', () => {
  
  it.only("should peg cEth => eth", async () => {
    try {

      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)
          //  check balance before peg
      const accountBefore = await client.getAccount(address)
      console.log({ accounts: accountBefore.balance })
      const ethBalance = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance })
      await unPeg('ceth', '2000000000000000000')
      
      await advanceBlock(2011)

      const ethBalanceAfter = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance, ethBalanceAfter })

    } catch (error) {
      console.log(error)

    }
  })

  it("should peg rowan => eRowan", async () => {
    try {

      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)
          //  check balance before peg
      const accountBefore = await client.getAccount(address)
      console.log({ accounts: accountBefore.balance })
      const ethBalance = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance })
      await unPeg('rowan', '2000000000000000000')
      await advanceBlock(52)

      await sleep(2000)

      const ethBalanceAfter = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance, ethBalanceAfter })

    } catch (error) {
      console.log(error)

    }
  })
})