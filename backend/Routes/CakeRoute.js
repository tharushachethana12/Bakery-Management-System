const express = require('express');
const router = express.Router();
const CakeController = require('../Controllers/CakeController');

router.get('/', CakeController.getAllCakes);