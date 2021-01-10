const httpStatus = require('http-status');
const { User, Bookmark } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserByName } = require('./user.service');

const addBookmark = async (data) => {
  const user = await getUserByName(data.owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const bookmark = await Bookmark.create(data);
  const bookmarkID = bookmark._id;
  user.last_bookmark_modified = Date.now();
  await User.addBookmark(user._id, bookmarkID);
  await user.save();
  return bookmark;
};

const updateBookmark = async (id, data) => {
  const bookmarkToUpdate = await Bookmark.findById(id);
  Object.assign(bookmarkToUpdate, data);
  const user = await getUserByName(data.owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.last_bookmark_modified = Date.now();
  await user.save();
  const res = await bookmarkToUpdate.save();
  return res;
};

const getBookmarks = async (name) => {
  const bookmarks = await Bookmark.getBookmarksByName(name);
  if (!bookmarks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bookmarks not found');
  }
  return bookmarks;
};

module.exports = {
  addBookmark,
  getBookmarks,
  updateBookmark,
};
