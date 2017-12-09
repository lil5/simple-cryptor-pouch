/**
 * check if sting is under ignore Array
 * @param  {array}  ignore  strings to be ignored
 * @param  {string}  str    string to check
 * @return {Boolean}        is str in ignore array
 */
function isIgnore (ignore, str) {
  let result = false
  let i = 0
  while (!result && i < ignore.length) {
    if (ignore[i] === str) {
      result = true
    }

    i++
  }
  return result
}

/**
 * Does the encryption and decryption
 * @param  {SimpleCryptoJS}  simpleCryptoJS  object of simple-crypto-js
 * @param  {Object<any>}  doc                Object from transform-pouch
 * @param  {Array}  ignore                   doc property name not to be changed
 * @param  {Boolean} isIncoming              is to be encrypted or decrypted
 * @return {Object<any>}                     same as doc with unencrypted values
 */
function cryptor (simpleCryptoJS, doc, ignore, isIncoming) {
  const resultDoc = {}

  Object.keys(doc).map(function (objectKey, index) {
    if (isIgnore(ignore, objectKey)) {
      resultDoc[objectKey] = doc[objectKey]
    } else {
      const preKeyText = 'encrypted_'

      switch (isIncoming) {
        case true:
          resultDoc[`${preKeyText}${objectKey}`] =
            simpleCryptoJS.encrypt(
              JSON.stringify(doc[objectKey])
            )
          break
        case false:
          resultDoc[`${objectKey.replace(preKeyText, '')}`] =
            JSON.parse(
              simpleCryptoJS.decrypt(
                doc[objectKey]
              )
            )
          break
      }
    }
  })
  return resultDoc
}

module.exports = cryptor
module.exports.isIgnore = isIgnore
