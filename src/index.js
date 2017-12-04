'use strict'

const transform = require('transform-pouch').transform
const SimpleCryptoJS = require('simple-crypto-js')

// // example
// function testSimpleCryptoJS () {
//   const SECRET_KEY = 'password'
//
//   let plainObj = {text: 'Hello World!'}
//   let cypherText = inCrypto.encryptObject(plainObj)
//   let decryptedObj = outCrypto.decryptObject(cypherText)
//   return decryptedObj.text
// }

function isIgnore (ignore, str) {
  var result = false
  let i = 0
  while (result && i < ignore.length) {
    if (ignore[i] === str) {
      result = true
    }

    i++
  }
  return result
}

function encrypt (simpleCryptoObj, e) {
  return simpleCryptoObj.encryptObject(e)
}

function decrypt (simpleCryptoObj, e) {
  return simpleCryptoObj.decryptObject(e)
}

function crypto (password, options) {
  // ES5 default of options
  if (!options) options = {}

  const db = this

  // set default ignore
  options.ignore = options.ignore
    ? ['_id', '_rev', '_deleted'].concat(options.ignore)
    : options.ignore

  // https://github.com/pouchdb-community/transform-pouch#example-encryption
  db.transform({
    incoming: function (doc) {
      let inCrypto = new SimpleCryptoJS(password)

      Object.keys(doc).map(function (objectKey, index) {
        if (!isIgnore(options.ignore, objectKey)) {
          doc[objectKey] = encrypt(inCrypto, doc[objectKey])
        }
      })
      return doc
    },
    outgoing: function (doc) {
      let outCrypto = new SimpleCryptoJS(password)

      Object.keys(doc).map(function (objectKey, index) {
        if (!isIgnore(options.ignore, objectKey)) {
          doc[objectKey] = decrypt(outCrypto, doc[objectKey])
        }
      })
      return doc
    },
  })
}

exports.transform = transform
exports.crypto = crypto
