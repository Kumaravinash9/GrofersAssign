const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    prof_pic: {
        type: String,
    },
    tickets: [{ type: ObjectId, ref: 'luckyDraw' }],
});

/**
 * @type {Schema}
 */

module.exports = UserSchema;
