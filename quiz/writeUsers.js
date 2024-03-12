const express = require('express')
const fs = require('fs');
const path = require('path');
const router = express.Router()

router.post('/users', (req, res) => {
  const newUser = req.body;
  fs.readFile('users.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading users data');
      return;
    }
    const users = JSON.parse(data);
    users.push(newUser);
    fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing users data');
        return;
      }
      res.status(201).send('User added');
    });
  });
});

module.exports = router;
