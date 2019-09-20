var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ImageSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String
  },
  user_id:[{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Image', ImageSchema);