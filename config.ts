import * as dotenv from 'dotenv'
import { Configuration } from 'sifchain'

dotenv.config({ path: __dirname + '/sample.env' })

export default {
  mnemonic: process.env.MNEMONIC ?? '',
  sifwallet: {
    prefix: 'sif',
  },
  apiConfig: new Configuration({ basePath: process.env.REST_API }),
  // bridgeBankAddress: '0x80E6A5D9a855D855AD6Fc9912d685b8dFdE24104', //testNet
  // bridgeBankAddress: '0x6CfD69783E3fFb44CBaaFF7F509a4fcF0d8e2835', //testNet
  // bridgeBankAddress: '0x96DC6f02C66Bbf2dfbA934b8DafE7B2c08715A73', // devNet
  bridgeBankAddress: '0x30753E4A8aad7F8597332E813735Def5dD395028', // localnet
  bridgeTokenAddress: '0x82D50AD3C1091866E258Fd0f1a7cC9674609D254', //devnet
  // bridgeTokenAddress: '0xEC017aC9003D2906Fc855258040A56C671a315d6', //eRowan Token Address
  // bridgeTokenAddress: '0x07baC35846e5eD502aA91AdF6A9e7aA210F2DcbE', //eRowan Token Address mainnet
  ethContractAddress: '0x0000000000000000000000000000000000000000',
  sifnodeLcdApi: 'http://localhost:1317',
  ethnode: 'http://localhost:7545',
}
