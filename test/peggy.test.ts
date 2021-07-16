import { importToken } from '../sdk/peggy/importToken'
import { exportToken } from '../sdk/peggy/exportToken'
import config from '../config'
import { SigningCosmosClient } from "@cosmjs/launchpad";
import { setupWallet, ethWallet } from '../wallet'
import { advanceBlock, sleep } from '../lib/helper'
import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

describe('test peg feature', () => {

  it("should importToken eth => cEth", async () => {
    try {
      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)

      // check balance before importToken
      const accountBefore = await client.getAccount(address)
      const cEthBalanceBefore = accountBefore.balance.find(b => b.denom === 'ceth').amount
      
      const importTokenAmount = '3000000000000000001'
      const importTokenRes = await importToken('eth', importTokenAmount)
      console.log({ importTokenRes })

      await advanceBlock(1001)

      // check balance after importToken
      const accountAfter = await client.getAccount(address)
      const cEthBalanceAfter = accountAfter.balance.find(b => b.denom === 'ceth').amount

      console.log({ cEthBalanceBefore, cEthBalanceAfter });

      expect(BigInt(cEthBalanceBefore) + BigInt(importTokenAmount)).toEqual(BigInt(cEthBalanceAfter))

    } catch (error) {
      console.log(error)

    }
  }, 999999)

  it('should importToken eRowan => Rowan.', async () => {

    const sifWallet = await setupWallet()
    const [{ address }] = await sifWallet.getAccounts()
    const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)
    // check balance before importToken
    const accountBefore = await client.getAccount(address)
    console.log({ accounts: accountBefore.balance });
    
    const rowanBalanceBefore = accountBefore.balance
      .find(b => b.denom === 'rowan').amount

    const importTokenAmount = '10000000000000000001'
    const importTokenRes = await importToken('erowan', importTokenAmount)
    console.log({ importTokenRes })

    await advanceBlock(2011)

    // check balance after importToken
    const accountAfter = await client.getAccount(address)
    const rowanBalanceAfter = accountAfter.balance
      .find(b => b.denom === 'rowan').amount

    console.log({ rowanBalanceBefore, rowanBalanceAfter });

    expect(BigInt(rowanBalanceBefore) + BigInt(importTokenAmount)).toEqual(BigInt(rowanBalanceAfter))

  })

  it.only("should importToken test => ctest", async () => {
    try {
      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)

      // check balance before importToken
      const accountBefore = await client.getAccount(address)
      const cTestBalanceBefore = accountBefore.balance.find(b => b.denom === 'ctest').amount
      
      const importTokenAmount = '1000000000000000001'
      const importTokenRes = await importToken('test', importTokenAmount)
      console.log({ importTokenRes })

      await advanceBlock(1001)

      // check balance after importToken
      const accountAfter = await client.getAccount(address)
      const cTestBalanceAfter = accountAfter.balance.find(b => b.denom === 'ctest').amount

      console.log({ cTestBalanceBefore, cTestBalanceAfter });

      expect(BigInt(cTestBalanceBefore) + BigInt(importTokenAmount)).toEqual(BigInt(cTestBalanceAfter))

    } catch (error) {
      console.log(error)

    }
  }, 999999)
})

describe('test exportToken feature', () => {
  

  it("should exportToken cEth => eth", async () => {
    try {

      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)
          //  check balance before exportToken
      const accountBefore = await client.getAccount(address)
      console.log({ accounts: accountBefore.balance })
      const ethBalanceBefore = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalanceBefore })
      const exportTokenAmount = '50000000000000000'
      await exportToken('ceth', exportTokenAmount)

      await advanceBlock(1000)
      await sleep(2000)

      const ethBalanceAfter = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalanceBefore, ethBalanceAfter })

      expect(BigInt(ethBalanceBefore) + BigInt(exportTokenAmount)).toEqual(BigInt(ethBalanceAfter))

    } catch (error) {
      console.log(error)

    }
  }, 99999)

  it("should exportToken rowan => eRowan", async () => {
    try {

      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)
          //  check balance before exportToken
      const accountBefore = await client.getAccount(address)
      console.log({ accounts: accountBefore.balance })
      const ethBalance = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance })
      await exportToken('rowan', '2000000000000000000')
      await advanceBlock(101)

      await sleep(3000)

      const ethBalanceAfter = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance, ethBalanceAfter })

    } catch (error) {
      console.log(error)

    }
  })

  it("should exportToken ctest => test", async () => {
    try {

      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = new SigningCosmosClient(config.sifnodeLcdApi, address, sifWallet)
          //  check balance before exportToken
      const accountBefore = await client.getAccount(address)
      console.log({ accounts: accountBefore.balance })
      const ethBalance = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance })
      await exportToken('ctest', '1000000000000000000')
      await advanceBlock(101)

      await sleep(3000)

      const ethBalanceAfter = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance, ethBalanceAfter })

    } catch (error) {
      console.log(error)

    }
  }, 999999)


})