const test = require('ava')
const plugins = require('../src/index')
const PouchWebSql = require('pouchdb-adapter-node-websql')
const PouchDB = require('pouchdb')
const path = require('path')
const fs = require('fs')
const dbPath = path.join(__dirname, '/.pouchdb')

function pouchStart (t, name) {
  PouchDB.plugin(plugins)
  PouchDB.plugin(PouchWebSql)
  t.log(`Database path: ${dbPath}/${name}.db`)
  const db = new PouchDB(`${dbPath}/${name}.db`, { adapter: 'websql' })
  return db
}

function checkResponse (t, id, response) {
  t.log('check response: ' + JSON.stringify(response))
  t.true(response.ok)
  t.is(response.id, id)
}

test('plugin install', t => {
  const db = pouchStart(t, 'install')
  db.simplecryptor('password')

  return db.info((err, info) => {
    if (err) t.fail(err)

    t.log(JSON.stringify(info))
    t.true(info['db_name'] === dbPath + '/install.db')
  })
})

test('empty db put, get', t => {
  fs.unlinkSync(`${dbPath}/empty.db`)
  const db = pouchStart(t, 'empty')
  db.simplecryptor('password')

  const exampleDoc = {
    _id: 'firstput',
    name: 'foo',
  }

  return db.put(exampleDoc) // create exampleDoc in db
    .then(response => {
      checkResponse(t, exampleDoc._id, response)

      return db.get(exampleDoc._id)
        .then(doc => {
          // equal everything except _rev
          t.deepEqual({
            _id: doc._id,
            name: doc.name,
          }, exampleDoc)
        })
        .catch(err => t.fail(err))
    })
})
