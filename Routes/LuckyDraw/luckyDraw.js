/* eslint-disable no-var */
const express = require('express');
const route = express.Router();
const { isLoggedIn } = require('../../utils/Middleware');
const LuckyDraw = require('../../models/luckDrawticket');
const User = require('../../models/user');
const ApiError = require('../../utils/errormessage');
const ApiSuccess = require('../../utils/successmessage');
const {
    checkvalidity,
    sortluckyDraw,
    timematch,
    checkParticipation,
    firstrandomNumber,
    secondrandomNumber,
    thirdrandomNumber,
    checkalreadyhaveticket,
} = require('./luckydrawUtils');

const getoneweekcheck = function (eventDate) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const dateoneweek = new Date();
    dateoneweek.setDate(dateoneweek.getDate() - 7);
};

const getoneweek = function (luckdraw) {
    const result = [];
    luckdraw.forEach((e) => {
        if (e.isvalid) e.isvalid = checkvalidity(e['event_date']);
        const check = getoneweekcheck(e['event_date']);
        if (check) {
            if (
                e['winners']['first_position'] === undefined &&
                e['participated_users'].length
            ) {
                const firstnum = firstrandomNumber(
                    0,
                    e['participated_users'].length
                );
                e['winners']['second_position'].push(e[firstnum]);
                if (e['participated_users'].length > 1) {
                    var secondnum = secondrandomNumber(
                        0,
                        luckdraws['participated_users'].length,
                        firstnum
                    );
                    e['winners']['second_position'].push(e[secondnum]);
                }
                if (e['participated_users'].length > 2) {
                    var thirdnum = thirdrandomNumber(
                        0,
                        e['participated_users'].length,
                        firstnum,
                        secondnum
                    );
                    e['winners']['second_position'].push(e[thirdnum]);
                }
            }
        }
    });
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

// get all upcoming luckydrwas API

route.get('/getallluckydraw/api', (req, res, next) => {
    LuckyDraw.find({}, function (err, luckdraws) {
        if (err) return res.json(new ApiError());
        const result = [];
        luckdraws.forEach((e) => {
            if (e.isvalid) e.isvalid = checkvalidity(e['event_date']);
            if (e.isvalid) result.push(e);
        });
        luckdraws.save();
        result.sort(sortluckyDraw);
        res.json(new ApiSuccess(result));
    });
});

// All luckydaws where user can take a part if user have a ticket

route.get('/:id/valideparticapate/api', (req, res, next) => {
    const result = [];
    luckdraws.forEach((e) => {
        let obj = {};
        if (e.isvalid) e.isvalid = checkvalidity(e['event_date']);
        obj = e;
        obj.isParticipated = checkParticipation(e['participated_users']);
        result.push(obj);
    });
    luckdraws.save();
    result.sort(luckdraws.sort(sortluckyDraw));
    res.json(new ApiSuccess(result));
});

// provide a random ticket to the User

route.get('/:id/getrandomticket', async (req, res, next) => {
    User.findById(req.user._id, function (err, user) {
        if (err) console.log(err);
        else {
            LuckyDraw.find({}, function (err, luckydraws) {
                if (err) console.log(err);
                // eslint-disable-next-line object-shorthand
                else {
                    const result = [];
                    luckydraws.forEach((e) => {
                        if (e.isvalid)
                            e.isvalid = checkvalidity(e['event_date']);
                        if (
                            e.isvalid &&
                            !checkParticipation(e['participated_user']) &&
                            !checkalreadyhaveticket(user['tickets'], e._id)
                        )
                            result.push(e);
                    });
                    const luckynum = firstrandomNumber(0, result.length);
                    console.log(luckynum);
                    user.tickets.push(result[luckynum]);
                    user.save();
                    luckydraws.save();
                    res.render(new ApiSuccess(result[luckynum]));
                }
            });
        }
    });
});

// check user can able to take part in particular luckyenvent or not

route.get('/:id/checkuservalidity', (req, res, next) => {
    User.findById(req.user._id, function (err, user) {
        if (err) console.log(err);
        else {
            LuckyDraw.findById(req.params.id, function (err, luckydraws) {
                if (err) console.log(err);
                // eslint-disable-next-line object-shorthand
                else {
                    if (luckydraws.isvalid)
                        luckydraws.isvalid = checkvalidity(e['event_date']);
                    if (
                        luckydraws.isvalid &&
                        !checkParticipation(luckydraws['participated_user']) &&
                        checkalreadyhaveticket(user['tickets'], e._id)
                    ) {
                        luckydraws['participate_user'].push({
                            id: user._id,
                            name: user.name,
                        });
                        luckydraws.save();
                        res.render(
                            new ApiSuccess(
                                'You have successfully participated in the contest'
                            )
                        );
                    } else {
                        res.json(
                            new ApiError('you are not eglible to participate')
                        );
                    }
                }
            });
        }
    });
});

// last one week winners

route.get('/getlastweekwinner', (req, res, next) => {
    LuckyDraw.find({}, function (err, luckdraw) {
        if (err) console.log(err);
        else {
            const result = getoneweek(luckdraw);
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
            const tymmatch = timematch(luckdraw);
            luckdraws.isvalid = !tymmatch;
            if (
                luckdraws['winners']['first_position'] === undefined &&
                tymmatch &&
                luckdraws['participated_users'].length
            ) {
                const firstnum = firstrandomNumber(
                    0,
                    luckdraws['participated_users'].length
                );
                luckdraws['winners']['second_position'].push(
                    luckdraws[firstnum]
                );
                if (luckdraws['participated_users'].length > 1) {
                    var secondnum = secondrandomNumber(
                        0,
                        luckdraws['participated_users'].length,
                        firstnum
                    );
                    luckdraws['winners']['second_position'].push(
                        luckdraws[secondnum]
                    );
                }
                if (luckdraws['participated_users'].length > 2) {
                    var thirdnum = thirdrandomNumber(
                        0,
                        luckdraws['participated_users'].length,
                        firstnum,
                        secondnum
                    );
                    luckdraws['winners']['second_position'].push(
                        luckdraws[thirdnum]
                    );
                }
                luckdraws.save();
                res.json(new ApiSuccess(luckdraws['winners']));
            } else {
                res.json(new ApiSuccess(luckdraws));
            }
        });
});

module.exports = route;
