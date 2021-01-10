const Joi = require('joi');

const addBookmark = {
  body: Joi.object().keys({
    owner: Joi.string().required(),
    origin: Joi.string().required(),
    content: Joi.string().required(),
    date: Joi.date().required(),
    lastVisited: Joi.date(),
    language: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    title: Joi.string(),
  }),
};

const updateBookmark = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    owner: Joi.string().required(),
    origin: Joi.string(),
    content: Joi.string(),
    date: Joi.date(),
    language: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    lastVisited: Joi.date(),
    title: Joi.string(),
  }),
};

const getBookmarks = {
  params: Joi.object({
    owner: Joi.string().required(),
  }),
};

module.exports = {
  addBookmark,
  getBookmarks,
  updateBookmark,
};
