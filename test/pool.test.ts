import { addLiquidity } from '../sdk/pools/addLiquidity'
import { removeLiquidity } from '../sdk/pools/removeLiquidity'

describe('test add liquidity feature', () => {
  it("should report invalid address for wrong signer addLiquidity('ceth', 1000, 10, 'signer')", async () => {
    const data = await addLiquidity('ceth', 1000, 10, 'signer')
    expect(data.rawLog).toBe('invalid address: ')
  })

  it("should return zero height for wrong value of addLiquidity('ceth, 1000, 10, signer2')", async () => {
    const data = await addLiquidity('ceth', 1000, 10, 'signer')
    expect(data['height']).toBe(0)
  })
})

describe('test remove liquidity feature', () => {
  it("should report invalid address for wrong removeLiquidity('signer', 'ceth', 500, 1000)", async () => {
    const data = await removeLiquidity('signer', 'ceth', 500, 1000)
    expect(data.rawLog).toBe('invalid address: ')
  })
})
