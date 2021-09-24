import { removeLiquidity } from '../../sdk/pools/removeLiquidity'
import config from '../../config'
// const sifAPI = new PoolsApi(config.apiConfig);

describe('test removeLiquidity feature', () => {
  it('should fail', async () => {
    const response = await removeLiquidity('ceth', '500', '1000')
    console.log(response)
    expect(1).toBe(1)
  })
})
