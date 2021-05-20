import { delegate } from './sdk/validators/delegate'

const start = async () => {
  const txnStatus = await delegate(53838, 'sifvaloper1vmtp5ul2uzmtvhchpftpzm0t49nk0hhasx52z0')
  console.log(txnStatus)
}

start()
