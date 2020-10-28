/*!
 * oauth2-token-manager-for-nodeJS v1.0.0
 * Copyright 2020 Orange
 * Licensed under MIT (https://github.com/orange-opensource/oauth2-token-manager-for-nodeJS/blob/master/LICENSE)
 */
/**
 * Create a new issuer to manage access_token
 */
const { Issuer, TokenSet } = require('openid-client')
let tokenSet = null
let expiresInTime = 1000 // Set default expiration time to 1 second
let client = null
let issuer
// if discover endpoint exist, use it
if(process.env.DISCOVER_URL) {
  Issuer.discover(process.env.DISCOVER_URL) // => Promise
    .then(function (issuerDisco) {
      issuer = issuerDisco 
      clientConfig()
    },(error) => {
      // Error when retrieving token
      console.log(error)
    });
} else {
// if no discover endpoint use TOKEN_ENDPOINT value
  issuer = new Issuer({
    issuer: 'odiIssuer',
    token_endpoint: process.env.TOKEN_ENDPOINT
  })
  clientConfig()
}

/**
 * Configure the client with our client_id and client_secret
 * CLIENT_ID and CLIENT_SECRET need to be set in .env file
 */
function clientConfig() {
  client = new issuer.Client({
    client_id:process.env.CLIENT_ID,
    client_secret:process.env.CLIENT_SECRET,
    token_endpoint_auth_method:'client_secret_post'
  })
}

/**
 * get current access token if it's still valid or ask a new one if needed
 */
function getAccessToken() {
  return new Promise((resolve, reject) => {
    // check if token exist and not expired
    if(tokenSet && (tokenSet.expires_at - Date.now() / 1000 >= expiresInTime)) {
      resolve(tokenSet.access_token)
    } else {
      // No token or token expired then request a new token
      let body = {grant_type:'client_credentials'}
      if(process.env.SCOPES) {
        body = {
          grant_type:'client_credentials',
          scope:process.env.SCOPES}
      }
      client.grant(body)
      .then((token) => {
        // Save tokenSet in memory and return the access_token
        tokenSet = token
        resolve(tokenSet.access_token)
      },(error) => {
        // Error when retrieving token
        reject(error)
      })
    }
  })
}

/**
 * drop accesstoken, usefull in case of 401(invalid token)
 */
function cleanAccessToken() {
  tokenSet = null
}

module.exports = {
    getAccessToken: getAccessToken,
    cleanAccessToken: cleanAccessToken
}