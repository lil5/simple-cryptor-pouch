const path = require('path')
const PouchDB = require('pouchdb')
const PouchWebSql = require('pouchdb-adapter-node-websql')
const SimpleCryptor = require('../src/index') // aka 'simple-cryptor-pouch'

// use sqlite for simplicity
const dbPath = path.join(__dirname, '/.pouchdb')
PouchDB.plugin(PouchWebSql)
PouchDB.plugin(SimpleCryptor)

const oldDBpath = dbPath + '/password-old.db'
const newDBpath = dbPath + '/password-new.db'

const oldDB = PouchDB(oldDBpath, {adapter: 'websql'})
const newDB = PouchDB(newDBpath, {adapter: 'websql'})

oldDB.simplecryptor('oldPassword')
newDB.simplecryptor('newBe//erPassw0rd')

PouchDB.replicate(oldDB, newDB, {live: true, retry: true})
  .on('complete', info => console.log({output: info, message: 'complete'}))
  .on('error', err => console.error(Error({output: err, message: 'error'})))
  .on('denied', err => console.error(Error({output: err, message: 'denied'})))
