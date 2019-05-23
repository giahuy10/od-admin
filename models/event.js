var mongoose = require('./index')

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  _id: Schema.Types.ObjectId,
  state: { type: 'Number', required: true },
  title_vi: { type: 'String', required: true },
  title_en: { type: 'String', required: true },
  title_kr: { type: 'String' },
  desc_vi: { type: 'String', required: true },
  desc_en: { type: 'String', required: true },
  desc_kr: { type: 'String' },
  date_vi: { type: 'String', required: true },
  date_en: { type: 'String', required: true },
  date_kr: { type: 'String'},
  thumbnail: { type: 'String', required: true },
  homepage: {type: 'Number'},
  slug: { type: 'String', required: true, unique: true },
  // cuid: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
},
{
  timestamps: true
});
itemSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});

var Event = mongoose.model('Event', itemSchema);
module.exports = Event