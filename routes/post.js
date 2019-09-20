const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Comment = require('../models/Comment.js');
const fs = require('fs-extra')

const PostCTRL = require('../controllers/post');


const passport = require('passport');
require('../config/passport')(passport);
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
	filename: function (req, file, cb) {
		var filetype = '';
		if(file.mimetype === 'image/gif') {
			filetype = 'gif';
		}
		if(file.mimetype === 'image/png') {
			filetype = 'png';
		}
		if(file.mimetype === 'image/jpeg') {
			filetype = 'jpg';
		}
		cb(null, 'image-' + Date.now() + '.' + filetype);
	}
})
 
const upload = multer({ storage: storage })

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
router.post('/uploadphoto', upload.single('picture'), PostCTRL.uploadOneAvatar);
router.get('/', passport.authenticate('jwt', { session: false}),PostCTRL.get);
router.get('/:id', passport.authenticate('jwt', { session: false}),PostCTRL.getId);
router.post('/', passport.authenticate('jwt', { session: false}),PostCTRL.post);
router.put('/:id', passport.authenticate('jwt', { session: false}),PostCTRL.put);
router.delete('/:id', passport.authenticate('jwt', { session: false}),PostCTRL.delete);
router.get('/comment/:id', passport.authenticate('jwt', { session: false}), PostCTRL.getComment)
router.post('/comment/:id', passport.authenticate('jwt', { session: false}), PostCTRL.addComment)

router.post('/user', passport.authenticate('jwt', { session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    User.findOne({ username: req.body.email })
		.then(function(coment) {
      res.json(coment);
		})
		.catch(function(err) {
			return next(err);
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
})

router.put('/user/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
      if (err) {
        console.log('err update user',err)
        return next(err);
      }
      res.json(user);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.delete('/comment/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    console.log('deleted id=>>',req.params.id)
    Comment.deleteMany({'post_id': req.params.id })
		.then(function(coment) {
      res.json(coment);
		})
		.catch(function(err) {
			return next(err);
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
})

module.exports = router;