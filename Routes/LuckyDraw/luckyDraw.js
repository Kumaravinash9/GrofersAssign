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
    getoneweek,
} = require('./luckydrawUtils');

route.get('/getallluckydraw', isLoggedIn, (req, res, next) => {
    LuckyDraw.find({}, function (err, luckydraws) {
        if (err) console.log(err);
        // eslint-disable-next-line object-shorthand
        else {
            const upcomingevent = [];
            const pastevent = [];
            const participateevent = [];

            luckydraws.forEach((e) => {
                if (e.isvalid) e.isvalid = checkvalidity(e.event_date);
                if (e.isvalid) upcomingevent.push(e);
                else pastevent.push(e);
                if (checkParticipation(e['participated_users'], req.user._id))
                    participateevent.push(e);
            });
            luckydraws.sort(sortluckyDraw);
            // eslint-disable-next-line object-shorthand
            res.render('luckdraw.ejs', {
                upcomingevent: upcomingevent,
                participateevent: participateevent,
                pastevent: pastevent,
                user: req.user,
            });
        }
    });
});

// get all upcoming luckydrwas API

route.get('/getallluckydraw/api', (req, res, next) => {
    LuckyDraw.find({}, function (err, luckdraws) {
        if (err) res.json(new ApiError());
        else {
            const result = [];
            luckdraws.forEach((e) => {
                if (e.isvalid) e.isvalid = checkvalidity(e['event_date']);
                if (e.isvalid) {
                    console.log(e);
                    result.push(e);
                }
            });
            result.sort(sortluckyDraw);
            res.json(new ApiSuccess(result));
        }
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
    result.sort(luckdraws.sort(sortluckyDraw));
    res.json(new ApiSuccess(result));
});

// provide a random ticket to the User

route.get('/:id/getrandomticket', (req, res, next) => {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
        } else {
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
                            checkParticipation(
                                e['participated_users'],
                                user._id
                            ) &&
                            checkalreadyhaveticket(user['tickets'], e._id)
                        ) {
                            result.push(e);
                        }
                    });
                    console.log(result.length);
                    const luckynum = firstrandomNumber(0, result.length);
                    if (result.length)
                        User.update(
                            { _id: req.params.id },
                            { $push: { tickets: result[luckynum] } },
                            function (err, user) {
                                console.log(user);
                            }
                        );
                    res.json(new ApiSuccess(user));
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
                        luckydraws.isvalid = checkvalidity(
                            luckydraws['event_date']
                        );
                    if (
                        luckydraws.isvalid &&
                        !checkParticipation(
                            luckydraws['participated_users'],
                            req.user._id
                        ) &&
                        checkalreadyhaveticket(user['tickets'], luckydraws._id)
                    ) {
                        luckydraws['participate_users'].push({
                            id: user._id,
                            name: user.name,
                        });

                        res.json(
                            new ApiSuccess(
                                'You have successfully participated in the contest'
                            )
                        );
                    } else {
                        res.json(
                            new ApiError(
                                'Hey there! you are not eglible to participate'
                            )
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
            res.json(new ApiSuccess(result));
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
            const tymmatch = timematch(luckdraws);
            luckdraws.isvalid = tymmatch;
            console.log(luckdraws['participated_users'].length);
            if (
                luckdraws['winners']['first_position'] === undefined &&
                !tymmatch &&
                luckdraws['participated_users'].length > 0
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
                // luckdraws.save();
                res.json(new ApiSuccess(luckdraws['winners']));
            } else {
                res.json(new ApiSuccess(luckdraws));
            }
        });
});

module.exports = route;

/* const obj = {
                first_prize: 'Iphone 12',
                second_prize: 'Samsung Nexa 8',
                third_prize: '$500',
                event_date: {
                    sec: 0,
                    min: 30,
                    hour: 8,
                    day: 8,
                    month: 10,
                    year: 2020,
                },
            };
            LuckyDraw.create(
                {
                    first_prize: 'Iphone 12',
                    second_prize: 'Samsung Nexa 8',
                    third_prize: '$500',
                    event_date: {
                        sec: 20,
                        min: 20,
                        hour: 6,
                        day: 30,
                        month: 8,
                        year: 2020,
                    },
                },
                function (err, luckdraw) {
                    if (err) console.log(err);
                    else res.json(new ApiSuccess(luckdraws));
                }
            );
        }
        */
