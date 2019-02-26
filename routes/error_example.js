const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  throw new Error('If you can see me in stdout, the error handling middleware is working as it should');
});

module.exports = router;
