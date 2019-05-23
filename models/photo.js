var mongoose = require('./index')

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  state: { type: 'Number', required: true },
  full: { type: 'String'},
  thumbnail: { type: 'String', required: true },
  name: { type: 'String'},
  homepage: { type: 'Number' },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});
var Photo = mongoose.model('Photo', itemSchema);
module.exports = Photo