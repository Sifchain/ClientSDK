import { exportToken } from '../../sdk/ethbridge/exportToken'
import config from '../../config'
import { setupWallet, ethWallet } from '../../wallet'
import { sleep } from '../../lib/helper'
import { SigningStargateClient } from '@cosmjs/stargate';

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

describe('test exportToken feature', () => {
  
  it.only("should exportToken cEth => eth", async () => {
    try {
      const ethBalanceBefore = await web3.eth.getBalance(ethWallet.address)
      const exportTokenAmount = '500000000000001'
      const response = await exportToken('ceth', exportTokenAmount)
      console.log({ response });
      
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
      const res = await exportToken('rowan', '20000000000001')
      console.log({ res });
      
      // await advanceBlock(101)

      await sleep(3000)

      const ethBalanceAfter = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance, ethBalanceAfter })

      const balancesAfter = await client.getAllBalances(address)
      console.log({ balancesBefore, balancesAfter })

    } catch (error) {
      console.log(error)

    }
  },  99999)

  it("should exportToken caave => aave (erc20)", async () => {
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
      const res = await exportToken('caave', '10000000000000001')
      console.log({ res });
      
      // await advanceBlock(101)

      await sleep(3000)

      const ethBalanceAfter = await web3.eth.getBalance(ethWallet.address)
      console.log({ ethBalance, ethBalanceAfter })

    } catch (error) {
      console.log(error)

    }
  }, 999999)


})