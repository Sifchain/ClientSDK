import { NetworkApi } from 'sifchain'
import config from '../config'
const sifAPI = new NetworkApi(config.apiConfig)

describe('test getNetworkInfo', () => {
  it('should get network info', async () => {
    const res = await sifAPI.getNetworkInfo()
    expect(res.data).toHaveProperty('totalRowanStaked')
    expect(res.data).toHaveProperty('totalUSDStaked')
    expect(res.data).toHaveProperty('averageBlockTime')
  })
})

describe('test getDailyPrice', () => {
  it('should get daily price', async () => {
    const res = await sifAPI.getDailyPrice()
    // testing only first item
    expect(res.data[0]).toHaveProperty('tickerid')
    expect(res.data[0]).toHaveProperty('base_currency')
    expect(res.data[0]).toHaveProperty('target_currency')
    expect(res.data[0]).toHaveProperty('last_price')
    expect(res.data[0]).toHaveProperty('base_volume')
    expect(res.data[0]).toHaveProperty('target_volume')
    expect(res.data[0]).toHaveProperty('bid')
    expect(res.data[0]).toHaveProperty('ask')
    expect(res.data[0]).toHaveProperty('high')
    expect(res.data[0]).toHaveProperty('low')
  })
})

describe('test getHistoricalPrice', () => {
  it('should get no historical price data for "fakeCoin"', async () => {
    const symbol = 'fakeCoin'
    const res = await sifAPI.getHistoricalPrice(symbol)
    expect(res.data).toEqual([])
  })
  it('should get historical price for "ceth_rowan"', async () => {
    const symbol = 'ceth_rowan'
    const res = await sifAPI.getHistoricalPrice(symbol)
    // failing test. No historical data
    expect(res.data[0]).toBeTruthy()
  })
  it('should get historical price for "rowan_cusdt"', async () => {
    const symbol = 'rowan_cusdt'
    const res = await sifAPI.getHistoricalPrice(symbol)
    // failing test. No historical data
    expect(res.data[0]).toBeTruthy()
  })
})
