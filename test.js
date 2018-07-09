const express = require('express');
const bodyParser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('express-jwt');
require('dotenv').config();

const app = express();

const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
});

const usr = (req, res, next) => {
  req.usr = { name: 'Ventzi' };
  next();
};

app.use(bodyParser.json(), usr, auth);
// why isn't auth adding user to req?
// when does it do that?

app.get('/login', (req, res) => {
  res.writeHead(200);
  res.end(
    jsonwebtoken.sign({ id: 1, email: 'a' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })
  );
});

app.get('*', (req, res) => {
  res.writeHead(200);
  res.end('hello world');
});

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000`);
});
