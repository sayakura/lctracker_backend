const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const boomarkController = require('../../controllers/bookmark.controller');
const bookmarkValidation = require('../../validations/bookmark.validation');

router
  .post('/addBookmark', validate(bookmarkValidation.addBookmark), boomarkController.addBookmark)
  .get('/', async (req, res) => {
    res.send('test');
  })
  .get('/getBookmarks/:owner', validate(bookmarkValidation.getBookmarks), boomarkController.getBookmarks)
  .post('/updateBookmark', validate(bookmarkValidation.updateBookmark), boomarkController.updateBookmark);
module.exports = router;
