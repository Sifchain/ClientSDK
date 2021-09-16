import config from '../../config'
import { setupWallet } from '../../wallet'
import { SigningStargateClient } from '@cosmjs/stargate'
import { exportTokenIBC } from '../../sdk/ibc/exportTokenIBC'
import { importTokenIBC } from '../../sdk/ibc/importTokenIBC'

describe('test ibc feature', () => {
  it.only('should export ibc token', async () => {
    try {
      const sifWallet = await setupWallet('sif')
      const [{ address }] = await sifWallet.getAccounts()

      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      )

      const balances = await client.getAllBalances(address)
      console.log({ balances })

      // const res = await exportTokenIBC('rowan', '202000')
      const res = await exportTokenIBC('uatom', '202000')
      console.log({ res })
    } catch (error) {
      console.log(error)
    }
  }, 90000)

  it('should import ibc token', async () => {
    try {
      const sifWallet = await setupWallet('sif')
      const [{ address }] = await sifWallet.getAccounts()

      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      )

      const res = await importTokenIBC('uatom', '101')
      console.log({ res })

      const balances = await client.getAllBalances(address)
      console.log({ balances })
    } catch (error) {
      console.log(error)
    }
  }, 90000)
})
