import config from '../config'
import { NativeDexClient } from './client'
import { promises as fs } from 'fs'
const ethTokens = require('./assets.sifchain.mainnet.json')
const dexEntriesCache = require('./dexEntriesCache.json')

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
  let entries
  // if cashe is older than one day then get new entries else use cached entries
  if (Date.now() > dexEntriesCache.timestamp + 1000 * 60 * 60 * 24) {
    const dex = await NativeDexClient.connect(config.sifRpc)
    entries = (await dex.query.tokenregistry.Entries({})).registry.entries
    const newDexEntries = {
      timestamp: Date.now(),
      entries,
    }
    console.log('Writing new Dex entries cache.')
    await fs.writeFile(
      `${__dirname}/dexEntriesCache.json`,
      JSON.stringify(newDexEntries, null, 2)
    )
  } else {
    console.log('Using cached Dex entries.')
    entries = dexEntriesCache.entries
  }

  let entry

  if (isExportToCosmos) {
    entry = entries.find((entry) => entry.baseDenom === `x${lowerCaseSymbol}`)

    if (!entry) {
      console.log('Available tokens: ', await this.getDexSymbols())
      throw new Error(`Token "${symbol}" not found on dex.`)
    }

    return entry
  }
  if (lowerCaseSymbol === 'rowan') {
    return entries.find((entry) => entry.baseDenom === 'rowan')
  }
  if (lowerCaseSymbol === 'basecro') {
    return entries.find((entry) => entry.baseDenom === 'basecro')
  }
  entry = entries.find(
    (entry) =>
      entry.baseDenom === `c${lowerCaseSymbol}` ||
      entry.baseDenom === `u${lowerCaseSymbol}`
  )

  if (!entry) {
    console.log('Available tokens: ', await this.getDexSymbols())
    throw new Error(`Token "${symbol}" not found on dex.`)
  }

  return entry
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
