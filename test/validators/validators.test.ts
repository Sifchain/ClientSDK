import { delegate } from '../sdk/validators/delegate'
import { undelegate } from '../sdk/validators/undelegate'
import { ValidatorsApi } from 'sifchain'
import config from '../config'

const sifAPI = new ValidatorsApi(config.apiConfig)
jest.spyOn(global.console, 'log')

describe('test delegate feature', () => {
  it("should report invalid address for wrong validator delegate(1000, 'signer')", async () => {
    try {
      await delegate(1000, 'signer')
    } catch (e) {
      expect(e.toString()).toMatch(/bech32/)
    }
  }, 20000)

  it("should return transactionHash to delegate(53838,'sifvaloper1vmtp5ul2uzmtvhchpftpzm0t49nk0hhasx52z0')", async () => {
    const txnStatus = await delegate(538, 'sifvaloper1vmtp5ul2uzmtvhchpftpzm0t49nk0hhasx52z0')
    expect(txnStatus).toHaveProperty('transactionHash')
  }, 20000)
})

describe('test getValidator feature', () => {
  it('should a validator from REST API', async () => {
    const res = await sifAPI.getValidators()
    const firstValidator = res.data[0]
    // response isn't returning correct Type so I'm cloning object here
    const { validatorAddress } = JSON.parse(JSON.stringify(firstValidator))
    const vRes = await sifAPI.getValidator(validatorAddress)

    expect(vRes.data).toHaveProperty('stakedAmount')
    expect(vRes.data.validatorAddress).toEqual(validatorAddress)
  })

  it('should fail to get a validator from REST API with wrongaddress', async () => {
    const res = await sifAPI.getValidator('wrongaddress')
    const { errorType } = JSON.parse(JSON.stringify(res.data))
    // returning stack trace again
    // res.data =>
    // {
    //   errorType: 'bad_request',
    //   errorMessage: 'decoding bech32 failed: invalid index of 1',
    //   trace: [
    //     'bad_request: decoding bech32 failed: invalid index of 1',
    //     '    at Object.exports.getValidator (/var/task/service/ValidatorsService.js:156:13)',
    //     '    at processTicksAndRejections (internal/process/task_queues.js:97:5)'
    //   ]
    // }
    expect(errorType).toEqual('bad_request')
  })
})

describe('test undelegate feature', () => {
  it("should return invalid address for wrong validator address undelegate(1000,'signer')", async () => {
    try {
      await undelegate(100, 'signer')
    } catch (e) {
      expect(e).toBeTruthy()
    }
  })
})
