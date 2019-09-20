const passport = require('passport');
const settings = require('../config/settings');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
var currentUser = null;
const config = require('../config/settings');

router.post('/register', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      address: req.body.address,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      passwordReset: '',
      avatar:''
    });
    newUser.save(function(err) {
      if (err) {
        return res.json({success: true});
      } else {
        const token = jwt.sign(user.toJSON(), settings.secret, { expiresIn: '7d' });
        const jwtToken = 'JWT ' + token;
        // res.cookie('token', jwtToken, { httpOnly: false });
        res.cookie('userid', user.id, { httpOnly: false });
        res.json({
          success: true, 
          token: 'JWT ' + token,
          user: user
        });
      }
    });
  }
});

router.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          const token = jwt.sign(user.toJSON(), settings.secret, { expiresIn: '7d' });
          const jwtToken = 'JWT ' + token;
          res.cookie('token', jwtToken, { httpOnly: false });
          res.cookie('userid', user.id, { httpOnly: false });
          res.json({
            success: true, 
            user: user,
            msg: 'Authentication was succesful',
            token: 'JWT ' + token
          });
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.post('/saveresethash', async (req, res, next) => {
  console.log('req',req.body.email)
  
  let result;
  let host;
  try {
    const foundUser = await User.findOne({ username: req.body.email }).exec();
    const timeInMs = Date.now();
    const hashString = `${req.body.email}${timeInMs}`;
    const secret = 'alongrandomstringshouldgohere';
    const hash = crypto.createHmac('sha256', secret)
                       .update(hashString)
                       .digest('hex');
    foundUser.passwordReset = hash;
    currentUser = foundUser;
    foundUser.save((err) => {
      if (err) { result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' })); }
      result = res.send(JSON.stringify({ success: true }));
        if (process.env.NODE_ENV === 'production') {
          host = config.prod.http
        } else {
          host = config.dev.http
        }
        
        const url = `${host}/api/auth/confirm/${hash}`
        const options = {
          auth: {
          api_user: 'Mikele111',//SENDGRID_USERNAME
          api_key: 'face112358'//SENDGRID_PASSWORD
          }
        }
        const client = nodemailer.createTransport(sgTransport(options));

        const email = {
          from: 'mikeleilyash@gmail.com',
          to: req.body.email,
          subject: `New password`,
          text: `
              Yours new password => 1234 from site
              Please click this email to confirm your email : <a href="${url}">${url}</a>`,
          html: `
              Yours new password => 1234 from site
              Please click this email to confirm your email : <a href="${url}">${url}</a>`
        };
  
        client.sendMail(email, function(err, info){
          if (err ){
            throw new Error('Proglem with sending email')
          }
          else {
            console.log('Message sent: ' + info);
          }
        });
    });
  } catch (err) {
    if (err) throw new Error('Proglem with sending email')
    result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' }));
  }
  return result;
});

router.get('/confirm/:token', async (req, res, next) => {
  try {
    if (currentUser.passwordReset == req.params.token){
      currentUser.password = '1234'
      currentUser.save(async(err,user) => {
        if (err) {
          console.log('thisUse err',err)
          return res.json({success: false, msg: err});
        } else {
          console.log('userconfirm',user)
          const find = await User.findOne({ username: 'mz1080@meta.ua' });
          console.log('userconfirm2',find)
          res.redirect('/');
        }
      })
    }  
  } catch (e) {
    console.log('catch err confirm token',e)
    res.send('error');
  }
});

router.post('/account/reset-password-render', function(req, res) {
  currentUser.password = req.body.password;
  currentUser.save(function(err,user) {
    if (err) {
      console.log('thisUse err',err)
      return res.json({success: false, msg: err});
    } else {
      console.log('user',user)
      res.redirect('/');
    }
  })
})

module.exports = router;