exports.isEthAddress = async function (ethAddress) {
    const regex = new RegExp('/^0x[a-fA-F0-9]{40}$/')
    return regex.test(ethAddress)
}

exports.isSifAddress = async function (ethAddress) {
    const regex = new RegExp('/^sif[a-zA-Z0-9]{39}$/')
    return regex.test(ethAddress)
}