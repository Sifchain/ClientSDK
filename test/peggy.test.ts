import { peg } from '../sdk/peggy/peg'
import { unPeg } from '../sdk/peggy/unPeg'
import config from '../config'

describe('test peg feature', () => {
  it("should peg", async () => {
    try {
      await peg(10000, 'ceth')
    } catch (error) {
      console.log(error)

    }
  })
})

describe('test unPeg feature', () => {
  it("should unPeg", async () => {
    try {
      await unPeg(10000, 'ceth')
    } catch (error) {
      console.log(error)

    }
  })
})