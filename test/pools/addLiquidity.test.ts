import { addLiquidity } from '../../sdk/pools/addLiquidity'
import config from '../../config'
import { setupWallet } from '../../sdk/wallet'
import { PoolsApi } from 'sifchain'
const sifAPI = new PoolsApi(config.apiConfig)

describe('test addLiquidity feature', () => {
  it('should fail', async function () {
    const sifWallet = await setupWallet('sif')
    const [{ address }] = await sifWallet.getAccounts()
    // const res = await sifAPI.getLiquidityProviders('eth')
    // console.log({ address })
    // const res = await sifAPI.getLiquidityProvider('eth', address)

    const response = await addLiquidity('ceth', '500', '1000')
    console.log(response)
    // expect(1).toBe(1)
  }, 90000)
})
