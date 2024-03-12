const express = require('express')
const fs = require('fs')
const router = express.Router();

router.get('/users', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading users data');
      return;
    }
    res.json(JSON.parse(data));
  });
});

module.exports = router;
