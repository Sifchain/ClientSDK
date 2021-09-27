import { swap } from '../../sdk/pools/swap'
import config from '../../config'
// const sifAPI = new PoolsApi(config.apiConfig);
export const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms))

describe('test swap feature', () => {
  it('should swap', async () => {
    const res = await swap('ceth', 'rowan', '120', '1')

    expect(res).toHaveProperty('rawLog')
    expect(res).toHaveProperty('gasUsed')
    expect(res).toHaveProperty('transactionHash')

    const successMsg = JSON.parse(res.rawLog)[0].events[1].type

    expect(successMsg).toBe('swap_successful')
  }, 90000)
})
