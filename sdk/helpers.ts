import config from '../config'
import { NativeDexClient } from './client'

const ethTokens = require('assets.sifchain.mainnet.json')

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethnode))

export const getWeb3 = function () {
  return web3
}

export const getERC20Token = function (symbol: string) {
  return ethTokens.find(
    (token) =>
      token.symbol.toLowerCase() === symbol.toLowerCase() &&
      token.address.startsWith('0x')
  )
}

export const getDexEntryFromSymbol = async function (
  symbol: string,
  isExportToCosmos: boolean = false
) {
  const lowerCaseSymbol = symbol.toLowerCase()
  // cache dex entries lookup
  let entries
  if (!entries) {
    const dex = await NativeDexClient.connect(config.sifRpc)
    entries = (await dex.query.tokenregistry.Entries({})).registry.entries
  } else {
    console.log('Using cached Dex entries.')
  }

  if (isExportToCosmos) {
    return entries.find((entry) => entry.baseDenom === `x${lowerCaseSymbol}`)
  }

  if (lowerCaseSymbol === 'rowan') {
    return entries.find((entry) => entry.baseDenom === 'rowan')
  }

  if (lowerCaseSymbol === 'basecro') {
    return entries.find((entry) => entry.baseDenom === 'basecro')
  }

  return entries.find(
    (entry) =>
      entry.baseDenom === `c${lowerCaseSymbol}` ||
      entry.baseDenom === `u${lowerCaseSymbol}`
  )
}

export const getDexSymbols = async function () {
  const dex = await NativeDexClient.connect(config.sifRpc)
  const { entries } = (await dex.query.tokenregistry.Entries({})).registry
  return entries.map((e) => {
    if (e.baseDenom === 'rowan') return e.baseDenom
    if (e.baseDenom === 'basecro') return e.baseDenom
    return e.baseDenom.substring(1)
  })
}
