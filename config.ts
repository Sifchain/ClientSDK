import * as dotenv from 'dotenv'
import { Configuration } from 'sifchain'

dotenv.config({ path: __dirname + '/sample.env' })

export default {
  mnemonic: process.env.MNEMONIC ?? '',
  sifwallet: {
    prefix: 'sif',
  },
  apiConfig: new Configuration({ basePath: process.env.REST_API }),
  bridgeBankAddress: '0x80E6A5D9a855D855AD6Fc9912d685b8dFdE24104',
  bridgeTokenAddress: '0x07bac35846e5ed502aa91adf6a9e7aa210f2dcbe',
  ethContractAddress: '0x0000000000000000000000000000000000000000',
}
