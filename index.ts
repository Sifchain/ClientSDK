import { delegate } from './sdk/validators/delegate'
import { undelegate } from './sdk/validators/undelegate'
import { swap } from './sdk/pools/swap'
import { importToken } from './sdk/ethbridge/importToken'

const start = async () => {
  console.log('Sifchain ClientSDK. Add application logic here.')
  //
  // *** Your logic here ***
  //
  //   const importTokenRes = await importToken('eth', '1000000000001')
  //   console.log({ importTokenRes })
  //
  //   const delegateRes = await delegate(
  //     '53837',
  //     'sifvaloper16svh7gvexg3p7f2a7l5f8cpj5m7rja4exdjhhq'
  //   )
  //   console.log({ delegateRes })

  //   const undelegateRes = await undelegate(
  //     '53837',
  //     'sifvaloper16svh7gvexg3p7f2a7l5f8cpj5m7rja4exdjhhq'
  //   )
  //   console.log({ undelegateRes })

  //   const swapRes = await swap('rowan', 'ceth', '1234', '1')
  //   console.log({ swapRes })
}

start()
