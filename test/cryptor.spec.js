const SimpleCryptoJS = require('simple-crypto-js').default
const test = require('ava')
const cryptor = require('../src/cryptor')
const isIgnore = cryptor.isIgnore

const ignore = ['_id', '_rev', '_deleted']

test('cryptor', t => {
  const password = 'password'
  const inCrypto = new SimpleCryptoJS(password)
  const outCrypto = new SimpleCryptoJS(password)

  let doc = {
    _id: 'thisid',
    one: [
      {text: 'hello'},
      {text: 'goodbye'},
    ],
    two: 2,
    three: 'hi',
    four: 3e4,
    five: [['one'], ['two'], ['three', 'four']],
  }

  const encrypted = cryptor(inCrypto, doc, ignore, true)
  t.log(JSON.stringify(encrypted))
  const decrypted = cryptor(outCrypto, encrypted, ignore, false)

  t.deepEqual(doc, decrypted, 'if cryptor works for Array<object>')
})

test('isIgnore', t => {
  t.true(ignore[0] === '_id')
  t.true(
    isIgnore(ignore, '_id'),
    '"_id" true'
  )
})
