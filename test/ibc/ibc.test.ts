import config from '../../config';
import { setupWallet } from '../../wallet';
import { SigningStargateClient } from '@cosmjs/stargate';
import { exportTokenIBC } from '../../sdk/ibc/exportTokenIBC'

describe('test ibc feature', () => {

  it("should transfer ibc token", async () => {
    try {
      const sifWallet = await setupWallet()
      const [{ address }] = await sifWallet.getAccounts()
      const client = await SigningStargateClient.connectWithSigner(
        config.sifRpc,
        sifWallet
      );

      const balances = await client.getAllBalances(address);
      console.log({ balances });

      const res = await exportTokenIBC()
      console.log({ res });
        

    } catch (error) {
      console.log(error)
    }
  }, 9999999)
})
