module.exports = {
  secret: 'norwsecure',
  dev: {
    http: 'http://localhost:3000'
  },
  prod: {
    http: 'https://simplchat.herokuapp.com'
  },
  db: {
		uri: process.env.MONGODB_URI || 'mongodb://localhost/mern-norv',
  },
  env: process.env.NODE_ENV || 'development',
};