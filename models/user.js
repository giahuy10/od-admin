var mongoose = require('./index')

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  username: { type: 'String', required: true},
  password: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});
var User = mongoose.model('User', itemSchema);
module.exports = User