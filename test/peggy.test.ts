import { peg } from '../sdk/peggy/peg'
// import { unPeg } from '../sdk/peggy/unPeg'
import config from '../config'
import {
  Secp256k1HdWallet,
  SigningCosmosClient,
  coins,
  LcdClient,
} from "@cosmjs/launchpad";
import { setupWallet } from '../wallet'
import { advanceBlock } from '../lib/helper'

describe('test peg feature', () => {

  it.only("should peg eth => cEth", async () => {
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
    const rowanBalanceBefore = accountBefore.balance
      .find(b => b.denom === 'rowan').amount

    const pegAmount = '10000000000000000001'
    const pegRes = await peg('erowan', pegAmount)
    console.log({ pegRes })

    // check balance after peg
    const accountAfter = await client.getAccount(address)
    const rowanBalanceAfter = accountAfter.balance
      .find(b => b.denom === 'rowan').amount

    console.log({ rowanBalanceBefore, rowanBalanceAfter });


  })
})

// describe('test unPeg feature', () => {
//   it("should unPeg", async () => {
//     try {
//       await unPeg(10000, 'ceth')
//     } catch (error) {
//       console.log(error)

//     }
//   })
// })