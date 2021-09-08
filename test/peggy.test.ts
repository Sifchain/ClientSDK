import { importToken } from '../sdk/peggy/importToken'
import { exportToken } from '../sdk/peggy/exportToken'
import config from '../config'
import { setupWallet, ethWallet } from '../wallet'
import { advanceBlock, sleep } from '../lib/helper'
import { SigningStargateClient } from '@cosmjs/stargate';

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

describe.only('test peg feature', () => {

  it.only("should importToken eth => cEth", async () => {
    try {
      
      const ethBalance = await web3.eth.getBalance(ethWallet.address);
	    console.log({ ethBalance });

      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      );

      const balancesBefore = await client.getAllBalances(address)

      console.log({ balancesBefore });
      
      // check balance before importToken
      // const accountBefore = await client.getAccount(address)
      const cEthBalanceBefore = balancesBefore.find(b => b.denom === 'ceth').amount
      
      const importTokenAmount = '1000000001'
      const importTokenRes = await importToken('eth', importTokenAmount)
      console.log({ importTokenRes })

      // await advanceBlock(1001)
      await sleep(20000)

      // check balance after importToken
      const balancesAfter = await client.getAllBalances(address)
      const cEthBalanceAfter = balancesAfter.find(b => b.denom === 'ceth').amount

      console.log({ cEthBalanceBefore, cEthBalanceAfter });

      expect(BigInt(cEthBalanceBefore) + BigInt(importTokenAmount)).toEqual(BigInt(cEthBalanceAfter))

    } catch (error) {
      console.log(error)

    }
  }, 999999)

  it('should importToken eRowan => Rowan.', async () => {

    const sifWallet = await setupWallet()
    const [{ address }] = await sifWallet.getAccounts()
    const client = await SigningStargateClient.connectWithSigner(
      config.sifRpc,
      sifWallet
    )
    // check balance before importToken
    const balancesBefore = await client.getAllBalances(address)
    const rowanBalanceBefore = balancesBefore
      .find(b => b.denom === 'rowan').amount

    const importTokenAmount = '10000000000000000001'
    const importTokenRes = await importToken('erowan', importTokenAmount)
    console.log({ importTokenRes })

    // await advanceBlock(2011)
    await sleep(2000)

    // check balance after importToken
    const balanceAfter = await client.getAllBalances(address)
    const rowanBalanceAfter = balanceAfter.find(b => b.denom === 'rowan').amount

    console.log({ rowanBalanceBefore, rowanBalanceAfter });

    expect(BigInt(rowanBalanceBefore) + BigInt(importTokenAmount)).toEqual(BigInt(rowanBalanceAfter))

  })

  it("should importToken test => ctest", async () => {
    try {
      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      )
      const balancesBefore = await client.getAllBalances(address)
      const cTestBalanceBefore = balancesBefore.find(b => b.denom === 'ctest').amount
      
      const importTokenAmount = '1000000000000000001'
      const importTokenRes = await importToken('test', importTokenAmount)
      console.log({ importTokenRes })

      // await advanceBlock(1001)
      await sleep(2000)

      // check balance after importToken
      const balanceAfter = await client.getAllBalances(address)
      const cTestBalanceAfter = balanceAfter.find(b => b.denom === 'ctest').amount

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
      const ethBalanceBefore = await web3.eth.getBalance(ethWallet.address)
      const exportTokenAmount = '50000000000000000'
      await exportToken('ceth', exportTokenAmount)

      // await advanceBlock(1000)
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
      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      )
      const balancesBefore = await client.getAllBalances(address)
      console.log({ balancesBefore })
      
      const ethBalance = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance })
      await exportToken('rowan', '200000000000000001')
      // await advanceBlock(101)

      await sleep(3000)

      const ethBalanceAfter = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance, ethBalanceAfter })

      const balancesAfter = await client.getAllBalances(address)
      console.log({ balancesBefore, balancesAfter })

    } catch (error) {
      console.log(error)

    }
  })

  it("should exportToken ctest => test", async () => {
    try {

      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      )
      const balancesBefore = await client.getAllBalances(address)
      console.log({ balancesBefore })
      const ethBalance = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance })
      await exportToken('ctest', '1000000000000000000')
      // await advanceBlock(101)

      await sleep(3000)

      const ethBalanceAfter = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance, ethBalanceAfter })

    } catch (error) {
      console.log(error)

    }
  }, 999999)


})