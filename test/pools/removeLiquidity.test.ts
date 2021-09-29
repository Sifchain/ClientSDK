import { removeLiquidity } from '../../sdk/pools/removeLiquidity'

describe('test removeLiquidity feature', () => {
  it('should remove liquidity', async function () {
    const res = await removeLiquidity('eth', '50', '100')

    expect(res).toHaveProperty('rawLog')
    expect(res).toHaveProperty('gasUsed')
    expect(res).toHaveProperty('transactionHash')

    const successMsg = JSON.parse(res.rawLog)[0].events[0].type
    expect(successMsg).toBe('removed_liquidity')
    const valueMsg = JSON.parse(res.rawLog)[0].events[2].attributes[2].value
    expect(valueMsg).toBe('50ceth,100rowan')
  }, 90000)

  it('should fail to remove liquidity for non existant pool', async function () {
    const res = await removeLiquidity('lolCoin', '50', '100')

    expect(res).toHaveProperty('rawLog')
    expect(res).toHaveProperty('gasUsed')
    expect(res).toHaveProperty('transactionHash')
    expect(res.rawLog).toBe(
      'failed to execute message; message index: 0: pool does not exist'
    )
  }, 90000)
})
