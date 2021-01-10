const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const bookmarkSchema = mongoose.Schema(
  {
    owner: {
      type: String,
      require: true,
    },
    origin: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    lastVisited: {
      type: Date,
      default: Date.now,
    },
    language: {
      type: String,
    },
    tags: {
      type: [String],
    },
    title: {
      type: String,
    },
  },
  { timestamps: true }
);

bookmarkSchema.plugin(toJSON);

bookmarkSchema.statics.getBookmarksByName = async function (name) {
  const ret = await this.find({ owner: name }).exec();
  return ret;
};

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
