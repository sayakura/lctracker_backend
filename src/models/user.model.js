const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    avator: {
      type: String,
      trim: true,
      default: '',
    },
    chain: {
      type: Number,
      default: 0,
    },
    chain_date: {
      type: Date,
    },
    total_ac: {
      type: Number,
      default: 0,
    },
    is_plugin_user: {
      type: Boolean,
      default: false,
    },
    recent_submission: {
      type: [String],
      default: [],
    },
    last_submission: {
      type: Date,
    },
    register_date: {
      type: Date,
    },
    problems_completed_count: {
      type: Number,
      default: 0,
    },
    problems_completed: {
      type: [Number],
      default: [],
    },
    saved_problem: {
      type: [Number],
      default: [],
    },
    posts: {
      type: [String],
      default: [],
    },
    bookmarks: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    last_bookmark_modified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.statics.addBookmark = function (userID, bookmarkID) {
  return this.findByIdAndUpdate(userID, { $addToSet: { bookmarks: bookmarkID }, last_bookmark_modified: Date.now() }).exec();
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
