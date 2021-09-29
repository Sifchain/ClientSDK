import { addLiquidity } from '../../sdk/pools/addLiquidity'
import config from '../../config'
import { setupWallet } from '../../sdk/wallet'
import { PoolsApi } from 'sifchain'
const sifAPI = new PoolsApi(config.apiConfig)

describe('test addLiquidity feature', () => {
  it('should add liquidity', async function () {
    const res = await addLiquidity('eth', '50', '100')

    expect(res).toHaveProperty('rawLog')
    expect(res).toHaveProperty('gasUsed')
    expect(res).toHaveProperty('transactionHash')

    const successMsg = JSON.parse(res.rawLog)[0].events[0].type
    expect(successMsg).toBe('added_liquidity')
    const valueMsg = JSON.parse(res.rawLog)[0].events[2].attributes[2].value
    expect(valueMsg).toBe('50ceth,100rowan')
  }, 90000)
})
