import config from '../../config';
import { SigningStargateClient, MsgTransferEncodeObject } from '@cosmjs/stargate';
import { StdFee, coin } from '@cosmjs/launchpad';
import { setupWallet, ethWallet, fee, broadcastUrl } from '../../wallet';
import { NativeDexClient } from '../client';
import { Registry } from '@cosmjs/proto-signing';
import Long from 'long'
import { OfflineSigner, OfflineDirectSigner } from "@cosmjs/proto-signing";
import * as IbcTransferV1Tx from "@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx";

const timeoutInMinutes = 45;
const timeoutTimestampInSeconds = Math.floor(
  new Date().getTime() / 1000 + 60 * timeoutInMinutes,
);
const timeoutTimestampNanoseconds = Long
    .fromNumber(timeoutTimestampInSeconds)
    .multiply(1_000_000_000);

const enum Network {
    SIFCHAIN = "sifchain",
    ETHEREUM = "ethereum",
    // The rest... sort by name
    AKASH = "akash",
    COSMOSHUB = "cosmoshub",
    CRYPTO_ORG = "crypto-org",
    IRIS = "iris",
    OSMOSIS = "osmosis",
    PERSISTENCE = "persistence",
    REGEN = "regen",
    SENTINEL = "sentinel",
}

const sourceNetwork = Network.SIFCHAIN;
const destinationNetwork = Network.COSMOSHUB;

// Testnet
// rpc-testnet.sifchain.finance testnet

// ------
// Denom:  uphoton
const symbol = 'uphoton'
// Is_Whitelisted:  True
// ChannelID:  channel-11
const channelId = 'channel-11'
// CounterParty ChannelID:  channel-27
// CounterParty ChainID:  cosmoshub-testnet
// Display Name:  

// ------
// Denom:  uakt
// Is_Whitelisted:  True
// ChannelID:  channel-12
// CounterParty ChannelID:  channel-66
// CounterParty ChainID:  akash-testnet-6
// Display Name:  UAKT

// ------
// Denom:  udvpn
// Is_Whitelisted:  True
// ChannelID:  channel-13
// CounterParty ChannelID:  channel-39
// CounterParty ChainID:  sentinelhub-2
// Display Name:  uDVPN

// ------
// Denom:  unyan
// Is_Whitelisted:  True
// ChannelID:  channel-14
// CounterParty ChannelID:  channel-25
// CounterParty ChainID:  nyancat-8
// Display Name:  uNYAN

// ------
// Denom:  uxprt
// Is_Whitelisted:  True
// ChannelID:  channel-15
// CounterParty ChannelID:  channel-24
// CounterParty ChainID:  test-core-1
// Display Name:  uXPRT


// export const exportToken = async (symbol: string, amount: string) => {
export const exportTokenIBC = async () => {
    const amount = '101'
    
    const wallet = await setupWallet();
    const [firstAccount] = await wallet.getAccounts();
    
    const sender = firstAccount.address;
    const receiver = "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5"
    
    const unsignedTransferMsg: MsgTransferEncodeObject = {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
        value: IbcTransferV1Tx.MsgTransfer.fromPartial({
          sourcePort: "transfer",
          sourceChannel: channelId,
          sender,
          receiver,
          token: {
            // denom: transferDenom,
            denom: 'ibc/4BFA1CE7B80A9A830F8E164495276CCD9E9B5424951749ED92F80B394E8C91C8',
            amount,
          },
          timeoutHeight: {
            // revisionHeight: timeoutHeight,
            // revisionHeight: timeoutHeight,
          },
          timeoutTimestamp: timeoutTimestampNanoseconds,
        }),
    };
    const client = await SigningStargateClient.connectWithSigner(
        broadcastUrl,
        wallet
        // ,
        // {
        //     registry: new Registry([...NativeDexClient.getGeneratedTypes()])
        // }
    );
    const fee: StdFee = {
        amount: [
            {
                denom: 'rowan',
                amount: '150000',
            },
        ],
        gas: '300000',
    };
    const txnStatus = await client.signAndBroadcast(
        firstAccount.address,
        [unsignedTransferMsg],
        fee
    );
    return txnStatus;
};
