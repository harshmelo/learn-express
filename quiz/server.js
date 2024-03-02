const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const port = 8000;

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), function(err, data) {
  console.log('reading file ... ');
  if(err) {
    console.error('Failed to read file', err);
    process.exit(1);
  }
  users = JSON.parse(data);
})

const addUserToRequest = function (req, res, next) {
  if(users) {
    req.users = users;
    next();
  }
  else {
    return res.status(404).json({
        error: {message: 'users not found', status: 404}
    });
  }
  
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({origin: 'http://localhost:3000'})
);
app.use('/read/usernames', addUserToRequest);

app.get('/read/usernames', (req, res) => {
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
  });
  res.send(usernames);
});

app.use('/write/adduser', addUserToRequest);

app.post('/write/adduser', (req, res) => {
  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) {
      console.error('Failed to write', err);
      return res.status(500).send('Failed to write user data');
    }
    console.log('User Saved');
    res.send('done');
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
