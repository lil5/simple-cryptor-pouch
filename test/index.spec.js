const test = require('ava')
const plugins = require('../src/index')
const PouchWebSql = require('pouchdb-adapter-node-websql')
const PouchDB = require('pouchdb')
const path = require('path')
const fs = require('fs-extra')
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

test.before(t => {
  const dirpath = dbPath
  try {
    fs.emptydirSync(dirpath)
  } catch (err) {
    if (err) throw err
  }
})

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

test('change password', t => {
  // create two databases
  const originalDB = pouchStart(t, 'pass-original')
  const changedDB = pouchStart(t, 'pass-changed')

  // add simplecryptor
  originalDB.simplecryptor('old')
  changedDB.simplecryptor('n3wbe//erpassword')

  const exampleDoc = {
    _id: 'firstput',
    name: 'fee',
  }

  // put exampleDoc in db original
  return originalDB.put(exampleDoc)
    .then(response => {
      checkResponse(t, exampleDoc._id, response)

      // get exampleDoc from db original
      return originalDB.get(exampleDoc._id)
        .then(doc => {
          t.deepEqual({
            _id: doc._id,
            name: doc.name,
          }, exampleDoc)

          // copy original to changed
          return new Promise((resolve, reject) => {
            PouchDB
              .replicate(originalDB, changedDB,
                {live: false, retry: false})
              .on('complete', info => resolve({output: info, message: 'complete'}))
              .on('error', err => reject(Error({output: err, message: 'error'})))
              .on('denied', err => reject(Error({output: err, message: 'denied'})))
          })
            .then(response => {
              t.log(JSON.stringify(response.output))
              t.is(response.message, 'complete')
              t.true(response.output.ok)

              // get exampleDoc from changed
              return changedDB.get(exampleDoc._id)
                .then(doc => {
                  t.deepEqual({
                    _id: doc._id,
                    name: doc.name,
                  }, exampleDoc)
                })
                .catch(err => t.fail(err))
            })
            .catch(err => t.fail(err))
        })
    })
    .catch(err => t.fail(err))
})
