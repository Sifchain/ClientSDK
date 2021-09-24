import config from '../../config'
import { setupWallet } from '../../sdk/wallet'
import { SigningStargateClient } from '@cosmjs/stargate'
import { exportTokenIBC } from '../../sdk/ibc/exportTokenIBC'

describe('test ibc export feature', () => {
  it('should export ibc test token uphoton', async () => {
    try {
      const sifWallet = await setupWallet('sif')
      const [{ address }] = await sifWallet.getAccounts()

      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      )

      const amount = '202'
      const ibcDenom =
        'ibc/4BFA1CE7B80A9A830F8E164495276CCD9E9B5424951749ED92F80B394E8C91C8' //uphoton

      const balancesBefore = (await client.getBalance(address, ibcDenom)).amount

      const res = await exportTokenIBC('uphoton', amount)
      console.log({ res })

      expect(res).toHaveProperty('rawLog')
      expect(res).toHaveProperty('gasUsed')
      expect(res).toHaveProperty('transactionHash')

      const balanceAfter = (await client.getBalance(address, ibcDenom)).amount

      expect(Number(balanceAfter)).toBe(Number(balancesBefore) - Number(amount))
    } catch (error) {
      console.log(error)
    }
  }, 90000)

  it('should fail to export ibc fake token lolCoin', async () => {
    try {
      await exportTokenIBC('lolCoin', '202')
    } catch (error) {
      expect(error.message).toBe('Token "lolCoin" not found on dex.')
    }
  }, 90000)
})
