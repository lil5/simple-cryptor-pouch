# simple-cryptor-pouch

pouchdb AES encryption using [danang-id/simple-crypto-js] which uses [brix/crypto-js]

```js
var db = new PouchDB('my_db');

db.simplecryptor(password);
// all done, docs should be transparently encrypted/decrypted
```

## Details

If you replicate to another database, it will decrypt before sending it to the external one. So make sure that one also has a password set as well if you want it encrypted too.

If you need to decrypt manually see [danang-id/simple-crypto-js]

This only encrypts the contents of documents, **not the `_id`, `_rev` or `_deleted`**.
I decided to make this plugin because [calvinmetcalf/crypto-pouch] does not work on react native.
This project should work on the following:
* web (with a Babel.js bundler)
* electron
* nodejs
* react native (with [stockulus/pouchdb-react-native])

> [Save attachments](https://pouchdb.com/api.html#save_attachment) are not ignored by default (`_attachments`), I would first need to make some test to really see if this is sane. At the moment I do not use attachments myself. [More details.](https://github.com/calvinmetcalf/crypto-pouch/pull/18#issuecomment-186402231)

## Install

This plugin ~~is~~ _will be_ hosted on npm. To install in Node.js:

```bash
npm i -s simple-cryptor-pouch
```

## API


### db.simplecryptor(password [, options])

Set up encryption on the database.

- `options.ignore`  
  String or Array of Strings of properties that will not be encrypted.

## Examples

### Change password

```js
const PouchDB = require('pouchdb')
const SimpleCryptor = require('simple-cryptor-pouch')
PouchDB.plugin(SimpleCryptor)

const oldDBpath = './password-old.db'
const newDBpath = './password-new.db'

const oldDB = PouchDB(oldDBpath)
const newDB = PouchDB(newDBpath)

oldDB.simplecryptor('oldPassword')
newDB.simplecryptor('newBe//erPassw0rd')

PouchDB.replicate(oldDB, newDB, {live: true, retry: true})
  .on('complete', info => console.log({output: info, message: 'complete'}))
  .on('error', err => console.error(Error({output: err, message: 'error'})))
  .on('denied', err => console.error(Error({output: err, message: 'denied'})))

```

file: [examples/change-password.js](https://github.com/lil5/simple-cryptor-pouch/blob/master/examples/change-password.js)

### Sync encrypted remote

```js
const PouchDB = require('pouchdb')
const SimpleCryptor = require('simple-cryptor-pouch')
PouchDB.plugin(SimpleCryptor)

const localPath = './sync-remote.db'
const remoteURL = 'http://127.0.0.1:5984'

const local = PouchDB(localPath)
const remote = PouchDB(remoteURL)

remote.simplecryptor('password')

// comment out to encrypt only the remote
// local.simplecryptor('password')

PouchDB.sync(local, remote, {live: true, retry: true})
  .on('complete', info => console.log({output: info, message: 'complete'}))
  .on('error', err => console.error(Error({output: err, message: 'error'})))
  .on('denied', err => console.error(Error({output: err, message: 'denied'})))

```
file: [examples/sync-encrypted-remote.js](https://github.com/lil5/simple-cryptor-pouch/blob/master/examples/sync-encrypted-remote.js)

[stockulus/pouchdb-react-native]: https://github.com/stockulus/pouchdb-react-native
[danang-id/simple-crypto-js]: https://github.com/danang-id/simple-crypto-js
[calvinmetcalf/crypto-pouch]: https://github.com/calvinmetcalf/crypto-pouch
[brix/crypto-js]: https://github.com/brix/crypto-js
