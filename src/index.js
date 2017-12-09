const SimpleCryptoJS = require('simple-crypto-js').default
const transform = require('transform-pouch').transform

const cryptor = require('./cryptor')

/**
 * pouch function to encrypt and decrypt
 * @param  {string} password
 * @param  {Object} [options={}]
 * @return {Object | Promise}
 */
function simplecryptor (password, options = {}) {
  const db = this

  // set default ignore
  options.ignore = ['_id', '_rev', '_deleted'].concat(options.ignore)

  const simpleCryptoJS = new SimpleCryptoJS(password)

  // https://github.com/pouchdb-community/transform-pouch#example-encryption
  db.transform({
    incoming: function (doc) {
      return cryptor(simpleCryptoJS, doc, options.ignore, true)
    },
    outgoing: function (doc) {
      return cryptor(simpleCryptoJS, doc, options.ignore, false)
    },
  })
}

module.exports = {
  transform,
  simplecryptor,
}
