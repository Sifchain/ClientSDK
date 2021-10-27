import { importToken } from '../../sdk/ethbridge/importToken'
import config from '../../config'
import { setupWallet, ethWallet } from '../../wallet'
import { SigningStargateClient } from '@cosmjs/stargate'

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms))

describe.only('test peg feature', () => {
  it.only('should importToken eth => cEth', async () => {
    try {
      const ethBalance = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance })

      const sifWallet = await setupWallet('sif')
      const [{ address }] = await sifWallet.getAccounts()
      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      )

      const balancesBefore = await client.getAllBalances(address)

      console.log({ balancesBefore })

      // check balance before importToken
      // const accountBefore = await client.getAccount(address)
      const cEthBalanceBefore = balancesBefore.find(
        (b) => b.denom === 'ceth'
      ).amount

      const importTokenAmount = '1000000001'
      const importTokenRes = await importToken('eth', importTokenAmount)
      console.log({ importTokenRes })

      // await advanceBlock(1001)
      await sleep(20000)

      // check balance after importToken
      const balancesAfter = await client.getAllBalances(address)
      const cEthBalanceAfter = balancesAfter.find(
        (b) => b.denom === 'ceth'
      ).amount

      console.log({ cEthBalanceBefore, cEthBalanceAfter })

      expect(BigInt(cEthBalanceBefore) + BigInt(importTokenAmount)).toEqual(
        BigInt(cEthBalanceAfter)
      )
    } catch (error) {
      console.log(error)
    }
  }, 999999)

  it('should importToken eRowan => Rowan.', async () => {
    const sifWallet = await setupWallet('sif')
    const [{ address }] = await sifWallet.getAccounts()
    const client = await SigningStargateClient.connectWithSigner(
      config.sifRpc,
      sifWallet
    )
    // check balance before importToken
    const balancesBefore = await client.getAllBalances(address)
    const rowanBalanceBefore = balancesBefore.find(
      (b) => b.denom === 'rowan'
    ).amount

    const importTokenAmount = '10000000000000000001'
    const importTokenRes = await importToken('erowan', importTokenAmount)
    console.log({ importTokenRes })

    // await advanceBlock(2011)
    await sleep(2000)

    // check balance after importToken
    const balanceAfter = await client.getAllBalances(address)
    const rowanBalanceAfter = balanceAfter.find(
      (b) => b.denom === 'rowan'
    ).amount

    console.log({ rowanBalanceBefore, rowanBalanceAfter })

    expect(BigInt(rowanBalanceBefore) + BigInt(importTokenAmount)).toEqual(
      BigInt(rowanBalanceAfter)
    )
  })

  it('should importToken test => ctest', async () => {
    try {
      const sifWallet = await setupWallet('sif')
      const [{ address }] = await sifWallet.getAccounts()
      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      )
      const balancesBefore = await client.getAllBalances(address)
      const cTestBalanceBefore = balancesBefore.find(
        (b) => b.denom === 'ctest'
      ).amount

      const importTokenAmount = '1000000000000000001'
      const importTokenRes = await importToken('test', importTokenAmount)
      console.log({ importTokenRes })

      // await advanceBlock(1001)
      await sleep(2000)

      // check balance after importToken
      const balanceAfter = await client.getAllBalances(address)
      const cTestBalanceAfter = balanceAfter.find(
        (b) => b.denom === 'ctest'
      ).amount

      console.log({ cTestBalanceBefore, cTestBalanceAfter })

      expect(BigInt(cTestBalanceBefore) + BigInt(importTokenAmount)).toEqual(
        BigInt(cTestBalanceAfter)
      )
    } catch (error) {
      console.log(error)
    }
  }, 999999)
})
