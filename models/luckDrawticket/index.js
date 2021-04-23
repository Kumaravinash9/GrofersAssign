const mongoose = require('mongoose');
const luckyDrawSchema = require('./Schema');

/**
 * @type {Model}
 */

module.exports = mongoose.model('luckyDraw', luckyDrawSchema);
