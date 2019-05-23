var mongoose = require('./index')

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: 'String', required: true },
  email: { type: 'String', required: true },
  phone: { type: 'String', required: true },
  message: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});
var Contact = mongoose.model('Contact', itemSchema);
module.exports = Contact