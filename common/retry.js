/*!
 * oauth2-token-manager-for-nodeJS v1.0.0
 * Copyright 2020 Orange
 * Licensed under MIT (https://github.com/orange-opensource/oauth2-token-manager-for-nodeJS/blob/master/LICENSE)
 */
function retryOnce(func, recoverFunc) {
  return func()
    .catch(err => {
      console.info(`Calling function failed with error: ${JSON.stringify(err)}, retrying once after recovery`)
      return recoverFunc(err).then(() => func())
    })
}

module.exports = {
  retryOnce: retryOnce
}