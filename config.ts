import * as dotenv from 'dotenv';
import { Configuration } from './gen/api';
import Long from 'long';
import { StdFee } from '@cosmjs/launchpad';

dotenv.config({ path: __dirname + '/.env' });

const timeoutInMinutes = 45;
const timeoutTimestampInSeconds = Math.floor(
  new Date().getTime() / 1000 + 60 * timeoutInMinutes,
);
const timeoutTimestampNanoseconds = Long
    .fromNumber(timeoutTimestampInSeconds)
    .multiply(1_000_000_000);

const fee: StdFee = {
	amount: [{ denom: 'rowan', amount: '150000' }],
	gas: '300000',
};	

export default {
	apiConfig: new Configuration({ basePath: 'https://data.sifchain.finance/beta' }),
	
	bridgeBankAddress: '0x6CfD69783E3fFb44CBaaFF7F509a4fcF0d8e2835', //testNet

	//testnet eRowan Token Address
	// const bridgeTokenAddress = await bridgeBank().methods.getBridgeToken('erowan').call()
	bridgeTokenAddress: '0xEC017aC9003D2906Fc855258040A56C671a315d6', 

	ethContractAddress: '0x0000000000000000000000000000000000000000',
	sifnodeLcdApi: 'https://api-testnet.sifchain.finance',
	sifRpc: 'https://rpc-testnet.sifchain.finance',
	ethnode: `https://:${process.env.INFURA_SECRET}@ropsten.infura.io/v3/1a28451a2df14ec1be70a7238cb131fc`,

	timeoutTimestampNanoseconds,
	fee,
};
