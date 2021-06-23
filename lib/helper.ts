export const isEthAddress = async function (ethAddress) {
  const regex = new RegExp('/^0x[a-fA-F0-9]{40}$/')
  return regex.test(ethAddress)
}

export const isSifAddress = async function (sifAddress) {
  const regex = new RegExp('/^sif[a-zA-Z0-9]{39}$/')
  return regex.test(sifAddress)
}

export const isERC20 = function (symbol: string): boolean {
  //@TODO
  return true
}
