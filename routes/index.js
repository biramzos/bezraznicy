const express = require('express');
const Person = require("../dtos/person.dto");
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const pool = require('../configs/db');
const UserService = require('../services/user.service');

let users = {};


// Main endpoint
router.get('/', function(req, res, next) {
  res.render('index');
});


// Login view show endpoint
router.get('/login', function(req, res, next) {
  res.render('login');
});

// Register post endpoint
router.post('/login', async function(req, res, next) {
  let {username, password} = req.body;
  if (!username || !password) {
    return res.redirect('/login');
  }
  let person = await UserService.login(username, password);
  if (person != null) {
    const token = uuidv4();
    users[token] = person;
    res.cookie('token', token, {httpOnly: true, secure: true});
    res.redirect('/main');
  } else {
    res.redirect('/register');
  }
});


// Register view show endpoint
router.get('/register', function(req, res, next) {
  res.render('register');
});

// Register post endpoint
router.post('/register', async function (req, res, next) {
  let {username, password} = req.body;
  if (!username || !password) {
    return res.redirect('/register');
  }
  let person = await UserService.register(username, password);
  if (person != null) {
    const token = uuidv4();
    users[token] = person;
    res.cookie('token', token, {httpOnly: true, secure: true});
    res.redirect('/main');
  } else {
    res.redirect('/register');
  }
});


// Main page view show endpoint
router.get('/main', function(req, res, next) {
  const token = req.cookies.token;
  if (token && users[token]) {
    res.render('main', { person: users[token] });
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', function(req, res, next) {
  const token = req.cookies.token;
  if (token && users[token]) {
    res.cookie('token', null, {httpOnly: true, secure: true});
    users[token] = null;
  }
  res.redirect('/login');
});



module.exports = router;
