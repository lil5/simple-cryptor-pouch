import { transform } from 'transform-pouch'
import SimpleCryptoJS from 'simple-crypto-js'

import cryptor from './cryptor'

function simplecryptor (password, options = {}) {
  const db = this

  // set default ignore
  options.ignore = options.ignore
    ? ['_id', '_rev', '_deleted'].concat(options.ignore)
    : options.ignore

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
