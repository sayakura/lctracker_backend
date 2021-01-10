const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { bookmarkService } = require('../services');
// const ApiError = require('../utils/ApiError');
// const pick = require('../utils/pick');
// const pick = require('../utils/pick');

const addBookmark = catchAsync(async (req, res) => {
  const data = req.body;
  await bookmarkService.addBookmark(data);
  res.status(httpStatus.CREATED).send(data);
});

const getBookmarks = catchAsync(async (req, res) => {
  const { owner } = req.params;
  const bookmark = await bookmarkService.getBookmarks(owner);
  res.send(bookmark);
});

const updateBookmark = catchAsync(async (req, res) => {
  const { body } = req;
  const { id } = body;
  delete body.id;
  const ret = await bookmarkService.updateBookmark(id, body);
  return res.send(ret);
});

// const deleteBookmark = catchAsync(async (req, res) => {
//   //   const { id } = body;
//   //   const userId = body.owner;
//   //  // not done
//   //   return res.send(ret);
// });

module.exports = {
  addBookmark,
  getBookmarks,
  updateBookmark,
  // deleteBookmark,
};
