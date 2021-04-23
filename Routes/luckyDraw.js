/* eslint-disable no-var */
const express = require('express');
const route = express.Router();
const { isLoggedIn } = require('../utils/Middleware');
const LuckyDraw = require('../models/luckDrawticket');
const ApiError = require('../utils/errormessage');
const ApiSuccess = require('../utils/successmessage');

const checkvalidity = function (eventDate) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    if (today.getFullYear().toString() > eventDate['year']) return false;
    if (today.getMonth().toString() > eventDate['month']) return false;
    if (today.getDay().toString() > eventDate['day']) return false;
    if (today.getHours().toString() > eventDate['hour']) return false;
    if (today.getMinutes().toString() > eventData['min']) return false;
    if (today.getSeconds().toString > eventData['sec']) return false;
    return true;
};

const sortluckyDraw = function (a, b) {
    if (a['event_date']['year'] > b['event_date']['year']) return false;
    if (a['event_date']['month'] > b['event_date']['month']) return false;
    if (a['event_date']['day'] > b['event_date']['day']) return false;
    if (a['event_date']['hour'] > b['event_date']['hour']) return false;
    if (a['event_date']['min'] > b['event_date']['min']) return false;
    if (a['event_date']['sec'] > b['event_date']['sec']) return false;
    return true;
};

// eslint-disable-next-line no-unused-vars
const timematch = function (luckydraw) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    if (today.getFullYear().toString() > luckydraw['eventDate']['year'])
        return true;
    if (today.getMonth().toString() > luckydraw['eventDate']['month'])
        return true;
    if (today.getDay().toString() > luckydraw['eventDate']['day']) return true;
    if (today.getHours().toString() > luckydraw['eventDate']['hour'])
        return true;
    if (today.getMinutes().toString() > luckydraw['eventDate']['min'])
        return true;
    if (today.getSeconds().toString > luckydraw['eventDate']['sec'])
        return true;
    return false;
};

const checkParticipation = function (users) {
    users.forEach((e) => {
        if (e.id === JSON.stringify(req.user._id)) return false;
    });
    return true;
};

const firstrandomNumber = function (min, max) {
    const random = Math.floor(Math.random() * (max - min)) + min;
    return random;
};
const secondrandomNumber = function (min, max, firstNum) {
    let random;

    do {
        random = Math.floor(Math.random() * (max - min)) + min;
    } while (random === firstNum);
    return random;
};

const thirdrandomNumber = function (min, max, firstNum, secondnum) {
    let random;
    do {
        random = Math.floor(Math.random() * (max - min)) + min;
    } while (random === firstNum || random === secondnum);
    return random;
};

route.get('/getallluckydraw', isLoggedIn, (req, res, next) => {
    LuckyDraw.find({}, function (err, luckydraws) {
        if (err) console.log(err);
        // eslint-disable-next-line object-shorthand
        else {
            luckydraws.forEach((e) => {
                if (e.isvalid) e.isvalid = checkvalidity(e['event_date']);
            });
            luckydraws.sort(sortluckyDraw);
            // eslint-disable-next-line object-shorthand
            res.render('luckdraw', { luckydraws: luckydraws });
        }
    });
});

route.get('/getallluckydraw/api', (req, res, next) => {
    LuckyDraw.find({}, function (err, luckdraws) {
        if (err) return res.json(new ApiError());

        luckdraws.forEach((e) => {
            if (e.isvalid) e.isvalid = checkvalidity(e['event_date']);
        });
        luckdraws.sort(sortluckyDraw);
        res.json(new ApiSuccess(luckdraws));
    });
});

route.get('/:id/valideparticapate/api', (req, res, next) => {
    const result = [];
    luckdraws.forEach((e) => {
        let obj = {};
        if (e.isvalid) e.isvalid = checkvalidity(e['event_date']);
        obj = e;
        obj.isParticipated = checkParticipation(participated_users['user']);
        result.push(obj);
    });
    result.sort(luckdraws.sort(sortluckyDraw));
    res.json(new ApiSuccess(result));
});

route.get('/:id/getrandomticket', (req, res, next) => {
    LuckyDraw.find({}, function (err, luckydraws) {
        if (err) console.log(err);
        // eslint-disable-next-line object-shorthand
        else {
            const result = [];
            luckydraws.forEach((e) => {
                if (e.isvalid) e.isvalid = checkvalidity(e['event_date']);
                if (
                    e.isvalid &&
                    !checkParticipation(participated_users['user'])
                )
                    result.push(e);
            });
            const luckynum = firstrandomNumber(0, result.length);
            console.log(luckynum);
            // eslint-disable-next-line object-shorthand
            res.render('luckdraw', { luckydraws: luckydraws });
        }
    });
});

// Compute the winner for the event and announce the winner.

route.get('/:id/winners', (req, res, next) => {
    LuckyDraw.findById(req.params.id)
        .populate('winners')
        .populate('participated_users')
        .exec(function (err, luckdraws) {
            if (err) return res.json(new ApiError());
            if (
                luckdraws['winners']['first_position'] === undefined &&
                timematch(luckdraws) &&
                luckdraws['participated_users'].length
            ) {
                const firstnum = firstrandomNumber(
                    0,
                    luckdraws['participated_users'].length
                );
                if (luckdraws['participated_users'].length > 1)
                    var secondnum = secondrandomNumber(
                        0,
                        luckdraws['participated_users'].length,
                        firstnum
                    );
                if (luckdraws['participated_users'].length > 2)
                    var thirdnum = thirdrandomNumber(
                        0,
                        luckdraws['participated_users'].length,
                        firstnum,
                        secondnum
                    );
                console.log(thirdnum, secondnum, firstnum);
            } else {
                res.json(new ApiSuccess(luckdraws));
            }
        });
});

module.exports = route;
