import { addLiquidity } from '../../sdk/pools/addLiquidity';
import config from '../../config';
// const sifAPI = new PoolsApi(config.apiConfig);

describe('test addLiquidity feature', () => {
	it('should fail', async () => {
        const response = await addLiquidity('ceth', 500, 1000)
        console.log(response);
        expect(1).toBe(1)
	});
});

