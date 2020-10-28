/*!
 * oauth2-token-manager-for-nodeJS v1.0.0
 * Copyright 2020 Orange
 * Licensed under MIT (https://github.com/orange-opensource/oauth2-token-manager-for-nodeJS/blob/master/LICENSE)
 */
const express = require('express')
const router = express.Router()
const got = require('got')
const token = require('../common/token.js')
const retry = require('../common/retry.js')

/* POST sms to a given phone number. */
router.get('/', async function (req, res, next) {
  // need to pass 2 parameters, phone_number and message
  // phone number format without the 0 at the begening
  // e.g : 612345678 and not 0612345678 or +33612345678
  try {
    let phone_number = req.query.phone_number
    let message = req.query.message
    const body = JSON.stringify({ "outboundSMSMessageRequest": { "address": "tel:+33" + phone_number, "senderAddress": "tel:+33" + phone_number, "outboundSMSTextMessage": { "message": message }, "senderName": "Orange" } })
    const response = await retry.retryOnce(() => {
      return token.getAccessToken()
        .then(accessToken => {
          // Use the return accessToken in the request Header
          const options = {
            hostname: process.env.API_HOSTNAME,
            path: '/smsmessaging/dev/outbound/tel%3A%2B33' + phone_number + '/requests',
            protocol: 'https:',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(body),
              'Authorization': 'Bearer ' + accessToken
            },
            method: 'post',
            body: body
          }
          return sendRequest(options)
        })
        .catch(error => {
          return Promise.reject(error)
        })
    }, refreshTokenOnUnauthorizedError)

    // If no error is thrown, send back the response body
    res.render('sms', {title: 'SMS sent with success', message:response.body})

  } catch (error) {
    next(error)
  }
})

function refreshTokenOnUnauthorizedError(error) {
  if (error.response && error.response.statusCode === 401) {
    // remove existing token
    token.cleanAccessToken()
    // retrieve a new token
    return token.getAccessToken()
  } else {
    // Not a token error
    return Promise.reject(error)
  }
}

function sendRequest(options) {
  return got(options).then(response => {
    return Promise.resolve(response)
  }, error => {
    return Promise.reject(error)
  })
}

module.exports = router
