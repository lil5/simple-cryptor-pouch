const test = require('ava')
const plugins = require('../src/index')
const PouchDB = require('pouchdb')
const path = require('path')
const dbPath = path.join(__dirname, '/.pouchdb')

function pouchStart (t, name) {
  PouchDB.plugin(plugins)
  t.log(dbPath)
  const db = new PouchDB(`${dbPath}/${name}`)
  return db
}

test('plugin install', t => {
  const db = pouchStart(t, 'install')

  db.simplecryptor('password')
  return db.info(function (err, info) {
    if (err) t.fail(err)

    t.log(JSON.stringify(info))
    t.true(info['db_name'] === dbPath + '/install')
  })
})

// test('plugin encrypt', t => {
//   const db = pouchStart(t, 'encrypt')
//
// })
