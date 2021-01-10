const httpStatus = require('http-status');
// const _ = require('lodash');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { getDifferenceInHours, unionArray } = require('../utils/helper');
// const { update } = require('../models/user.model');
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const user = await User.create(userBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by name
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserByName = async (name) => {
  return User.findOne({ name });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, ub) => {
  const updateBody = ub;
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.recent_submission && updateBody.recent_submission.length > 0) {
    updateBody.recent_submission = unionArray(user.recent_submission, updateBody.recent_submission);
    updateBody.last_submission = Date.now();
    const lastChainDate = user.chain_date;
    const now = Date.now();
    const hoursPassed = getDifferenceInHours(lastChainDate, now);
    if (hoursPassed >= 24 && hoursPassed <= 48) {
      updateBody.chain = user.chain + 1;
      updateBody.chain_date = now;
    } else if (hoursPassed > 48) {
      updateBody.chain = 1;
      updateBody.chain_date = now;
    }
    if (updateBody.recent_submission.length > user.recent_submission) {
      updateBody.problems_completed = unionArray(updateBody.problems_completed, updateBody.recent_submission);
      updateBody.problems_completed_count = updateBody.problems_completed.length;
    }
  }
  if (updateBody.saved_problem && updateBody.saved_problem > 0)
    updateBody.saved_problem = unionArray(user.saved_problem, updateBody.saved_problem);
  if (updateBody.posts && updateBody.posts > 0) updateBody.posts = unionArray(user.posts, updateBody.posts);
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 */
const registerUser = async ({ name, avator }) => {
  const now = Date.now();
  const user = await User.create({
    name,
    avator,
    chain_date: now,
    last_submission: now,
    register_date: now,
  });
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  registerUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByName,
  updateUserById,
  deleteUserById,
};
