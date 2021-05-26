import { addLiquidity } from '../sdk/pools/addLiquidity'
import { removeLiquidity } from '../sdk/pools/removeLiquidity'
import { swap } from '../sdk/pools/swap'
import { PoolsApi } from 'sifchain'
import config from '../config'
const sifAPI = new PoolsApi(config.apiConfig)

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

describe('test swap feature', () => {
  it('should fail', async () => {
    const sentAsset = 'sentAsset'
    const receivedAsset = 'receivedAsset'
    const sentAmount = 1234
    const minReceivingAmount = 1234
    const signer = 'signer'
    const data = await swap(sentAsset, receivedAsset, sentAmount, minReceivingAmount, signer)
    expect(data.rawLog).toBe('invalid address: ')
  })
})

describe('test getPools feature', () => {
  it('should get pools', async () => {
    const res = await sifAPI.getPools()

    // test first pool for properties
    expect(res.data[0]).toHaveProperty('externalAsset')
    expect(res.data[0]).toHaveProperty('externalAsset')
    expect(res.data[0]).toHaveProperty('poolUnits')
  })
})

describe('test getLiquidityProvider feature', () => {
  it('should get a liquidity provider', async () => {
    // fist get all ceth liquidity provider addresses
    const symbol = 'ceth'
    const res = await sifAPI.getLiquidityProviders(symbol)
    // pick fist liquidity provider address
    const liquidityProviderAddress = res.data[0].address
    // now get that liquidity provider
    const lpRes = await sifAPI.getLiquidityProvider(symbol, liquidityProviderAddress)
    expect(lpRes.data.LiquidityProvider.address).toEqual(liquidityProviderAddress)
    expect(lpRes.data).toHaveProperty('externalAsset')
    expect(lpRes.data).toHaveProperty('nativeAsset')
    expect(lpRes.data).toHaveProperty('height')
  })

  it('should fail to get a liquidity provider with invalid address', async () => {
    const symbol = 'ceth'
    const res = await sifAPI.getLiquidityProvider(symbol, 'invalid_address')
    expect(res.data['name']).toBe('not_found')
  })
})

