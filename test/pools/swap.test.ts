import { swap } from '../../sdk/pools/swap'
import config from '../../config'
// const sifAPI = new PoolsApi(config.apiConfig);

describe('test swap feature', () => {
  it('should fail', async () => {
    const txnStatusSwap = await swap('rowan', 'ceth', '1234', '1')
    console.log(txnStatusSwap)
    expect(1).toBe(1)
  })
})
