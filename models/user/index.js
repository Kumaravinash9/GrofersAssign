const mongoose = require('mongoose');
const userSchema = require('./scheme');

/**
 * @type {Model}
 */

module.exports = mongoose.model('User', userSchema);
