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

// if object hack not working see https://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
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
