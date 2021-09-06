import config from '../config';
import { setupWallet, ethWallet } from '../wallet';
import { SigningStargateClient } from '@cosmjs/stargate';
import {
  QueryClient,
  setupBankExtension,
  setupIbcExtension,
  setupAuthExtension,
} from "@cosmjs/stargate/build/queries";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode));

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

      const receivingStargateCient = await SigningStargateClient?.connectWithSigner(
        destinationChain.rpcUrl,
        recievingSigner,
        {
          gasLimits: {
            send: 80000,
            transfer: 250000,
            delegate: 250000,
            undelegate: 250000,
            redelegate: 250000,
            // The gas multiplication per rewards.
            withdrawRewards: 140000,
            govVote: 250000,
          },
        },
      );
  
      const sendingStargateClient = await SigningStargateClient?.connectWithSigner(
        sourceChain.rpcUrl,
        sendingSigner,
        {
          gasLimits: {
            send: 80000,
            transfer: 250000,
            delegate: 250000,
            undelegate: 250000,
            redelegate: 250000,
            // The gas multiplication per rewards.
            withdrawRewards: 140000,
            govVote: 250000,
          },
        },
      );

    } catch (error) {
      console.log(error)
    }
  })
})


//   const tendermintClient = await Tendermint34Client.connect(config.sifRpc);
//   const queryClient = QueryClient.withExtensions(
//     tendermintClient,
//     setupIbcExtension,
//     setupBankExtension,
//     setupAuthExtension,
//   );