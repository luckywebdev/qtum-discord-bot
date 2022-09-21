const { BigNumber, ethers } = require('ethers')
const qtum = require('qtumjs-lib')
const { isHexString } = require('ethereumjs-util')

const getBalanceNumber = (amount, decimal = 18, displayDecimals = 2) => {
  const formattedString = ethers.utils.formatUnits(amount, decimal)
  return (+formattedString).toFixed(displayDecimals)
}

const getNumberFromBigNumber = (amount, decimal = 18) => {
  return Number(ethers.utils.formatUnits(amount, decimal))
}

const getBigNumberFromString = (amount, decimal = 18) => {
  return ethers.utils.parseUnits(amount, decimal)
}

const isAddress = (value) => {
  try {
    return ethers.utils.getAddress(value)
  } catch {
    return false
  }
}

const shortenAddress = (address, chars = 4) => {
  const parsed = isAddress(address)
  if (!parsed) {
    // throw Error(`Invalid 'address' parameter '${address}'.`)
    return ''
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

const getHexAddressFromQtum = (_address) => {
  const hexAddress = qtum.address.fromBase58Check(_address).hash.toString('hex')
  return `0x${hexAddress}`
}

const isBase58 = (value) => /^[A-HJ-NP-Za-km-z1-9]*$/.test(value);


const isQtumAddress = (_address) => {
  return isBase58(_address) || !isHexString(_address)
} 

module.exports = {
    getBalanceNumber,
    getNumberFromBigNumber,
    getBigNumberFromString,
    isAddress,
    shortenAddress,
    getHexAddressFromQtum,
    isQtumAddress
};