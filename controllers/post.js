
var Post = require('../models/Post.js');
var Image = require('../models/Image.js');
const fs = require('fs-extra')
const User = require('../models/User.js');

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

exports.get = (req, res, next) => {
  var token = getToken(req.headers);
  console.log('get all')
  if (token) {
    Post.find(function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.getId = (req, res, next) => {
  console.log('get id')
  var token = getToken(req.headers);
  if (token) {
    Post.findById(req.params.id,function (err, post) {
      if (err) return next(err);
      res.json(post);
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.post = (req, res, next) => {
  var token = getToken(req.headers);
  console.log('post')
  if (token) {
    Post.create(req.body)
      .then((post) => {
        res.json(post);
      })
      .catch((err)=> console.log('post err', err))
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};


exports.put = (req, res, next) => {
  console.log('put')
  var token = getToken(req.headers);
  if (token) {
    Post.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.delete = (req, res, next) => {
  console.log('delete')
  var token = getToken(req.headers);
  if (token) {
    Post.findByIdAndRemove(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

// exports.getOnePhoto = (req, res, next) => {  

//   Image.find({'user_id': req.params.id })
//     .then(function(result) {
//       res.contentType('image/jpeg');
//       res.send(result.image.data)
//     })
//     .catch(function(err) {
//       return next(err);
//     })
// };

exports.uploadOneAvatar = async (req, res) => {
  
const {userid} = req.cookies
console.log('userid',userid)
		User.findByIdAndUpdate(userid, { $set: { avatar: req.file.path } }, { new: true })
			.then((result)=>{
				res.redirect('/');
			})
			.catch(err => console.log('err',err));
};

exports.getComment = function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    Comment.find({'post_id': req.params.id })
		.then(function(coment) {
			res.json(coment);
		})
		.catch(function(err) {
			return next(err);
		})	
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

exports.addComment = function(req, res) {
  let token = getToken(req.headers);
  if (token) {
	Comment.create(req.body)
		.then(function(coment) {
			Post.findByIdAndUpdate(req.params.id, { $push: { comment: coment._id }}, {new: true})
        .then(function(post) {
          res.json(post);
        })
        .catch(function(err) {
          return next(err);
        })
		})
    .catch(function(err) {
      return next(err);
    })						
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
// exports.uploadPhoto = (req, res) => {
//   // var token = getToken(req.headers);
//   // if (token) {
//     try {
//       console.log('req',req)
//       var img = fs.readFileSync(req.file.path);
//       var encode_image = img.toString('base64');
//       const image = {
//           contentType: req.file.mimetype,
//           data: Buffer.from(encode_image, 'base64')
//       };
  
//       User.findOne({ username: email })
//       .then(function(user) {
//         res.json(user);
//       })
//       .catch(function(err) {
//         return next(err);
//       })
  
//       const body = {
//         image,
//          user_id: user._id
//       }
//       console.log('===body',body)
//       Image.create(body, (err, result) => {
//         if (err) return console.log(err)
//         console.log('saved to database',result)
//         res.redirect('/')  
//       })
//     } catch (error) {
//       console.log('err',error)
//     }
//   // } else {
//   //   return res.status(403).send({success: false, msg: 'Unauthorized.'});
//   // }
// }

