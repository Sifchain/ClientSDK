import { PeggyApi } from 'sifchain'
import config from '../config'

describe('test getPeggedAssets', () => {
  it('should fail to get pegged assets using an incorrect "key"', async () => {
    const sifAPI = new PeggyApi(config.apiConfig)
    const key = 'wrongKey'
    try {
      await sifAPI.getPeggedAssets(key)
    } catch (e) {
      expect(e).toMatch(/server_error/)
    }
    // returns non descriptive error and is leaking stack trace info
    // res.data =>
    //    {
    //     errorType: 'server_error',
    //     trace: [
    //       'server_error',
    //       '    at Object.exports.getTokenValue (/var/task/service/AssetsService.js:61:11)',
    //       '    at processTicksAndRejections (internal/process/task_queues.js:97:5)'
    //     ]
    //   }
  })
})

