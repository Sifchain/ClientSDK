import { PoolsApi } from 'sifchain';
import config from '../../config';
const sifAPI = new PoolsApi(config.apiConfig);

describe('test getPools feature', () => {
	it('should get pools', async () => {
		const res = await sifAPI.getPools();

		// test first pool for properties
		expect(res.data[0]).toHaveProperty('externalAsset');
		expect(res.data[0]).toHaveProperty('externalAsset');
		expect(res.data[0]).toHaveProperty('poolUnits');
	});
});

describe('test getLiquidityProvider feature', () => {
	it('should get a liquidity provider', async () => {
		// fist get all ceth liquidity provider addresses
		const symbol = 'ceth';
		const res = await sifAPI.getLiquidityProviders(symbol);
		// pick fist liquidity provider address
		const liquidityProviderAddress = res.data[0].address;
		// now get that liquidity provider
		const lpRes = await sifAPI.getLiquidityProvider(
			symbol,
			liquidityProviderAddress
		);
		expect(lpRes.data.LiquidityProvider.address).toEqual(
			liquidityProviderAddress
		);
		expect(lpRes.data).toHaveProperty('externalAsset');
		expect(lpRes.data).toHaveProperty('nativeAsset');
		expect(lpRes.data).toHaveProperty('height');
	});

	it('should fail to get a liquidity provider with invalid address', async () => {
		const symbol = 'ceth';
		const res = await sifAPI.getLiquidityProvider(symbol, 'invalid_address');
		expect(res.data['name']).toBe('not_found');
	});
});
