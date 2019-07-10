const express = require('express');
const passport = require('passport');
const router = express.Router();
const resController = require('../controllers/restaurantController');

// Do work here

router.post('/getRestaurentlist', resController.list); 
router.post('/addRestaurent', resController.add); 



module.exports = router;