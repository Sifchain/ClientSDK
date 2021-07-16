import * as dotenv from 'dotenv'
import { Configuration } from 'sifchain'

dotenv.config({ path: __dirname + '/sample.env' })

export default {
  mnemonic: process.env.MNEMONIC ?? '',
  sifwallet: {
    prefix: 'sif',
  },
  apiConfig: new Configuration({ basePath: process.env.REST_API }),

  bridgeBankAddress: '0x96DC6f02C66Bbf2dfbA934b8DafE7B2c08715A73', // devNet
  bridgeTokenAddress: '0x82D50AD3C1091866E258Fd0f1a7cC9674609D254', //devnet
  ethContractAddress: '0x0000000000000000000000000000000000000000',
  sifnodeLcdApi: 'http://localhost:1317',
  ethnode: 'http://localhost:7545',
}
