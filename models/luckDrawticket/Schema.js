const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const luckyDrawSchema = new Schema({
    first_prize: {
        type: String,
        required: true,
    },
    second_prize: {
        type: String,
        required: true,
    },
    third_prize: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    event_date: {
        sec: {
            type: String,
            default: '0',
        },
        min: {
            type: String,
        },
        hour: {
            type: String,
        },
        day: {
            type: String,
        },
        month: {
            type: String,
        },
        year: {
            type: String,
        },
    },
    participated_users: [
        {
            id: {
                type: ObjectId,
                ref: 'user',
            },
            name: {
                type: String,
            },
        },
    ],
    isvalid: {
        type: Boolean,
        defalut: true,
    },
    winners: {
        first_postion: {
            id: { type: ObjectId, ref: 'user' },
            name: {
                type: String,
            },
        },
        second_position: {
            id: { type: ObjectId, ref: 'user' },
            name: {
                type: String,
            },
        },
        third_position: {
            id: { type: ObjectId, ref: 'user' },
            name: {
                type: String,
            },
        },
    },
});

/**
 * @type {Schema}
 */

module.exports = luckyDrawSchema;
