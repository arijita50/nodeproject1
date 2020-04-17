var express = require("express");
var router = express.Router();
var Product = require('../models/product');
var User = require('../models/user');
var Category = require('../models/category');
const fs = require('fs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
 
var unique_time = Date.now();

//Product Listing Page
router.get('/store', (req, res) => {
    console.log('a'); 
});

module.exports = router;