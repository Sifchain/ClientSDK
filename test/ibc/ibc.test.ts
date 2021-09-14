import config from '../../config';
import { setupWallet } from '../../wallet';
import { SigningStargateClient } from '@cosmjs/stargate';
import { exportTokenIBC } from '../../sdk/ibc/exportTokenIBC'
import { importTokenIBC } from '../../sdk/ibc/importTokenIBC'

describe('test ibc feature', () => {

  it("should export ibc token", async () => {
    try {
      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()

      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      );

      const balances = await client.getAllBalances(address);
      console.log({ balances });

      // const res = await exportTokenIBC('rowan', '202000')
      const res = await exportTokenIBC('uphoton', '202');
      console.log({ res });
        

    } catch (error) {
      console.log(error)
    }
  }, 90000)

  it.only("should import ibc token", async () => {
    try {
      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()

      // const cosmosWallet = await setupCosmosWallet()
      // const [{ address }] = await cosmosWallet.getAccounts()


      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      );

      
      const res = await importTokenIBC('uphoton', '101')
      console.log({ res });
      
      const balances = await client.getAllBalances(address);
      console.log({ balances });

    } catch (error) {
      console.log(error)
    }
  }, 90000)
})
