import config from '../../config';
import { SigningStargateClient, MsgTransferEncodeObject } from '@cosmjs/stargate';
import { StdFee } from '@cosmjs/launchpad';
import { NativeDexClient } from '../client';
import * as IbcTransferV1Tx from "@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx";
import { setupWallet } from '../../wallet';
import chains from './chains';


export const importTokenIBC = async (symbol: string, amount: string) => {
    
    // look up ibc denom and channel id from dex entries
    const dex = await NativeDexClient.connect(config.sifRpc);
    const { entries } = (await dex.query.tokenregistry.Entries({})).registry;
    const { 
        denom,
        ibcCounterpartyChannelId,
        ibcCounterpartyChainId,
    } = entries.find(entry => entry.baseDenom === symbol);

    // get sender chain info
    const senderChain = chains.find(chain => chain.chainId === ibcCounterpartyChainId)

    const sifWallet = await setupWallet('sif');
    const [firstAccount] = await sifWallet.getAccounts();
    const receiver = firstAccount.address;
    
    const senderWallet = await setupWallet(senderChain.bech32PrefixAccAddr);
    const [senderFirstAccount] = await senderWallet.getAccounts();
    const sender = senderFirstAccount.address

    const unsignedTransferMsg: MsgTransferEncodeObject = {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
        value: IbcTransferV1Tx.MsgTransfer.fromPartial({
          sourcePort: "transfer",
          sourceChannel: ibcCounterpartyChannelId,
          sender,
          receiver,
          token: { denom, amount },
          timeoutHeight: {
            // revisionHeight: timeoutHeight,
            // revisionHeight: timeoutHeight,
          },
          timeoutTimestamp: config.timeoutTimestampNanoseconds,
        }),
    };
    const client = await SigningStargateClient.connectWithSigner(
        senderChain.rpcUrl,
        senderWallet
    );
    const fee: StdFee = {
        amount: [{ 
            denom: senderChain.nativeFeeToken,
            amount: senderChain.nativeFee
        }],
        gas: '300000',
    };
    const txnStatus = await client.signAndBroadcast(
        sender,
        [unsignedTransferMsg],
        fee
    );
    return txnStatus;
};
