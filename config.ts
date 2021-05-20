import * as dotenv from 'dotenv'
import { Configuration } from 'sifchain'

dotenv.config({ path: __dirname + '/sample.env' })

export default {
  mnemonic: process.env.MNEMONIC ?? '',
  sifwallet: {
    prefix: 'sif',
  },
  apiConfig: new Configuration({ basePath: process.env.REST_API }),
}
