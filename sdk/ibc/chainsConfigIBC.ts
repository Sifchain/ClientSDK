export default [
{
    chainId: "akashnet-2",
    rpcUrl: "https://rpc-akash.keplr.app",
    nativeDenom: "AKT",
    nativeFeeToken: "uakt",
    coinDecimals: 6,
    bech32PrefixAccAddr: "akash",
    nativeFee: "150000",
    gas: '300000',
    walletMnemonic: process.env.AKASH_MNEMONIC,
},
{
    chainId: "cosmoshub-4",
    rpcUrl: "https://rpc-cosmoshub.keplr.app",
    nativeDenom: "ATOM",
    nativeFeeToken: "uatom",
    coinDecimals: 6,
    bech32PrefixAccAddr: "cosmos",
    nativeFee: "150000",
    gas: '300000',
    walletMnemonic: process.env.COSMOS_MNEMONIC,
},
{
    chainId: "crypto-org-chain-mainnet-1",
    rpcUrl: "https://rpc-crypto-org.keplr.app",
    nativeDenom: "basecro",
    nativeFeeToken: "basecro",
    coinDecimals: 8,
    bech32PrefixAccAddr: "cro",
    nativeFee: "150000",
    gas: '300000',
    walletMnemonic: process.env.CRO_MNEMONIC,
},
{
    chainId: "irishub-1",
    rpcUrl: "https://rpc-iris.keplr.app",
    nativeDenom: "IRIS",
    nativeFeeToken: "uiris",
    coinDecimals: 6,
    bech32PrefixAccAddr: "iaa",
    nativeFee: "150000",
    gas: '300000',
    walletMnemonic: process.env.IAA_MNEMONIC,
},
{
    chainId: "osmosis-1",
    rpcUrl: "https://rpc-osmosis.keplr.app",
    nativeDenom: "OSMO",
    nativeFeeToken: "uosmo",
    coinDecimals: 6,
    bech32PrefixAccAddr: "osmo",
    nativeFee: "150000",
    gas: '300000',
    walletMnemonic: process.env.OSMO_MNEMONIC,
},
{
    chainId: "core-1",
    rpcUrl: "https://rpc-persistence.keplr.app",
    nativeDenom: "XPRT",
    nativeFeeToken: "uxprt",
    coinDecimals: 6,
    bech32PrefixAccAddr: "persistence",
    nativeFee: "150000",
    gas: '300000',
    walletMnemonic: process.env.PERSISTENCE_MNEMONIC,
},
{
    chainId: "regen-1",
    rpcUrl: "https://regen.stakesystems.io:2053",
    nativeDenom: "REGEN",
    nativeFeeToken: "uregen",
    coinDecimals: 6,
    bech32PrefixAccAddr: "regen",
    nativeFee: "150000",
    gas: '300000',
    walletMnemonic: process.env.REGEN_MNEMONIC,
},
{
    chainId: "sentinelhub-2",
    rpcUrl: "https://rpc-sentinel.keplr.app",
    nativeDenom: "udvpn",
    nativeFeeToken: "udvpn",
    coinDecimals: 6,
    bech32PrefixAccAddr: "sent",
    nativeFee: "150000",
    gas: '300000',
    walletMnemonic: process.env.SENT_MNEMONIC,
},
]