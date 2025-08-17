const express = require("express");
const { viewAllLogs } = require('../controllers/logController')

const router = express.Router();

router.get('/', viewAllLogs)

module.exports = router;
