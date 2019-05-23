var mongoose = require('./index')

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: 'String', required: true },
  value: { type: 'String', required: true },
});
var Config = mongoose.model('Config', itemSchema);
module.exports = Config