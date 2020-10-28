/*!
 * oauth2-token-manager-for-nodeJS v1.0.0
 * Copyright 2020 Orange
 * Licensed under MIT (https://github.com/orange-opensource/oauth2-token-manager-for-nodeJS/blob/master/LICENSE)
 */
const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sample code to manage Oauth2 token' })
})

module.exports = router
