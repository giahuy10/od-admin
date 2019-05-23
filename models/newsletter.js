var mongoose = require('./index')

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: 'String' },
  email: { type: 'String', required: true, unique: true  },
  phone: { type: 'String'},
  dateAdded: { type: 'Date', default: Date.now, required: true },
});
var Newsletter = mongoose.model('Newsletter', itemSchema);
module.exports = Newsletter