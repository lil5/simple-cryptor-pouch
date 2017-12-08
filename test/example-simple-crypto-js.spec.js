const example = require('./example-simple-crypto-js')
const test = require('ava')

test('example', t => {
  const res = example('g')
  t.true(res === 'Hello World!')
})

test('example with default password', t => {
  const res = example()
  t.true(res === 'Hello World!')
})
