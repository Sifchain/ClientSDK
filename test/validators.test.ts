import { delegate } from '../sdk/validators/delegate'
import { ValidatorsApi } from 'sifchain'
import config from '../config'

jest.spyOn(global.console, 'log')
describe('test delegate feature', () => {
  it("should report invalid address for wrong validator delegate(1000, 'signer')", async () => {
    expect(console.log).toHaveBeenCalledTimes(0)
    const data = await delegate(1000, 'signer')
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  it("should return zero height for wrong value of delegate(53838,'sifvaloper1vmtp5ul2uzmtvhchpftpzm0t49nk0hhasx52z0')", async () => {
    const txnStatus = await delegate(538, 'sifvaloper1vmtp5ul2uzmtvhchpftpzm0t49nk0hhasx52z0')
    expect(txnStatus).toHaveProperty('transactionHash')
  })

  it('should call list of validators from REST API', async () => {
    const sifAPI = new ValidatorsApi(config.apiConfig)
    const retObj = await sifAPI.getValidators()
    expect(retObj.data.length).toBeGreaterThan(10)
  })
})
