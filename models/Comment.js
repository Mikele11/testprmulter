const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = Schema({
  author: String,
	description: String,
	post_id:[{ type: Schema.Types.ObjectId, ref: 'Post' }]
});


module.exports = mongoose.model('Comment', commentSchema);