const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMong = require('passport-local-mongoose');
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
    },
    prof_pic: {
        type: String,
    },
    tickets: [{ type: ObjectId, ref: 'luckyDraw' }],
});

UserSchema.plugin(passportLocalMong);

/**
 * @type {Schema}
 */

module.exports = UserSchema;
