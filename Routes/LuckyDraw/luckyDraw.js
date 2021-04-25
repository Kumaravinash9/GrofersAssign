/* eslint-disable object-shorthand */
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
                    result.push(e);
                }
            });
            result.sort(sortluckyDraw);
            res.json(new ApiSuccess(result));
        }
    });
});

route.get('/getallpastevent/api', (req, res) => {
    LuckyDraw.find({}, function (err, luckydraws) {
        if (err) console.log(err);
        else {
            const pastevent = [];

            luckydraws.forEach((e) => {
                if (e.isvalid) e.isvalid = checkvalidity(e.event_date);
                if (!e.isvalid) pastevent.push(e);
            });
            pastevent.sort(sortluckyDraw);
            res.json(new ApiSuccess(pastevent));
        }
    });
});

route.get('/:id/getdtails', isLoggedIn, (req, res) => {
    LuckyDraw.findById(req.params.id)
        .populate('winners')
        .populate('participated_users')
        .exec(function (err, luckdraws) {
            if (err) {
                console.log(err);
                return res.json(new ApiError());
            }
            const tymmatch = checkvalidity(luckdraws['event_date']);

            luckdraws.isvalid = tymmatch;
            if (
                luckdraws['winners']['first_postion']['name'] === undefined &&
                !tymmatch &&
                luckdraws['participated_users'].length > 0
            ) {
                var firstnum = firstrandomNumber(
                    0,
                    luckdraws['participated_users'].length
                );
                luckdraws['winners']['first_postion'] =
                    luckdraws['participated_users'][firstnum];
                if (luckdraws['participated_users'].length > 1) {
                    var secondnum = secondrandomNumber(
                        0,
                        luckdraws['participated_users'].length,
                        firstnum
                    );
                    luckdraws['winners']['second_position'] =
                        luckdraws['participated_users'][secondnum];
                }
                if (luckdraws['participated_users'].length > 2) {
                    var thirdnum = thirdrandomNumber(
                        0,
                        luckdraws['participated_users'].length,
                        firstnum,
                        secondnum
                    );
                    luckdraws['winners']['third_position'] =
                        luckdraws['participated_users'][thirdnum];
                }
                luckdraws.save(function (err, done) {
                    if (err) console.log(err);
                    else console.log(done);
                });
            }
            res.render('eventdetails', {
                luckdraws: luckdraws,
                user: req.user,
            });
        });
});

// get randoticketApi

route.get('/:id/getrandomticket/api', isLoggedIn, (req, res, next) => {
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
                            function (err, users) {
                                if (err) console.log(err);
                                else
                                    users.save(function (err, done) {
                                        if (err) console.log(err);
                                        else console.log(done);
                                    });
                            }
                        );
                    if (result.length < 0)
                        res.json(new ApiSuccess('Oops! something went wrong'));
                    res.json(new ApiSuccess(result[luckynum]));
                }
            });
        }
    });
});

// provide a random ticket to the User

route.get('/:id/getrandomticket', isLoggedIn, (req, res, next) => {
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
                            function (err, users) {
                                if (err) console.log(err);
                                else
                                    users.save(function (err, done) {
                                        if (err) console.log(err);
                                        else console.log(done);
                                    });
                            }
                        );
                    result.length
                        ? res.render('randomticket', {
                              id: result[luckynum]._id,
                          })
                        : res.render('randomticket', {
                              id: null,
                          });
                }
            });
        }
    });
});

route.get('/:id/checkuservalidity', isLoggedIn, (req, res, next) => {
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
                        checkParticipation(
                            luckydraws['participated_users'],
                            user._id
                        ) &&
                        !checkalreadyhaveticket(user['tickets'], luckydraws._id)
                    ) {
                        LuckyDraw.update(
                            { _id: req.params.id },
                            {
                                $push: {
                                    participated_users: {
                                        id: user._id,
                                        name: user.name,
                                    },
                                },
                            },
                            function (err, luckdraws) {
                                if (err) console.log(err);
                                else
                                    luckydraws.save(function (err, done) {
                                        if (err) console.log(err);
                                    });
                            }
                        );

                        res.render('participation', {
                            id: 1,
                            message:
                                'You have successfully registered for the event',
                        });
                    } else {
                        if (!luckydraws.isvalid)
                            res.render('participation', {
                                id: -1,
                                message: 'Winner has already announched',
                            });
                        else if (
                            !checkParticipation(
                                luckydraws['participated_users'],
                                req.user._id
                            )
                        )
                            res.render('participation', {
                                id: -1,
                                message: 'You have alreday registered',
                            });
                        else {
                            res.render('participation', {
                                id: -1,
                                message: 'You donot have valid ticket',
                            });
                        }
                    }
                }
            });
        }
    });
});

// check user can able to take part in particular luckyenvent or not

route.get('/:id/checkuservalidity/api', isLoggedIn, (req, res, next) => {
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
                        checkParticipation(
                            luckydraws['participated_users'],
                            user._id
                        ) &&
                        !checkalreadyhaveticket(user['tickets'], luckydraws._id)
                    ) {
                        LuckyDraw.update(
                            { _id: req.params.id },
                            {
                                $push: {
                                    participated_users: {
                                        id: user._id,
                                        name: user.name,
                                    },
                                },
                            },
                            function (err, luckdraws) {
                                if (err) console.log(err);
                                else
                                    luckydraws.save(function (err, done) {
                                        if (err) console.log(err);
                                    });
                            }
                        );

                        res.json(
                            new ApiSuccess(
                                'You have successfully participated in the contest'
                            )
                        );
                    } else {
                        if (!luckydraws.isvalid)
                            res.json(
                                new ApiError('Winner has already announched')
                            );
                        else if (
                            !checkParticipation(
                                luckydraws['participated_users'],
                                req.user._id
                            )
                        )
                            res.json(
                                new ApiError('You have alreday registered')
                            );
                        else {
                            res.json(
                                new ApiError(' You donot have valid ticket')
                            );
                        }
                    }
                }
            });
        }
    });
});

//

route.get('/getlastweekwinner', (req, res, next) => {
    LuckyDraw.find({}, function (err, luckdraw) {
        if (err) console.log(err);
        else {
            const result = getoneweek(luckdraw);
            res.render('lastweekwinner', {
                luckdraws: result,
            });
        }
    });
});

// last one week winners

route.get('/getlastweekwinner/api', (req, res, next) => {
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
            const tymmatch = checkvalidity(luckdraws['event_date']);

            luckdraws.isvalid = tymmatch;
            console.log(luckdraws['winners']['first_postion']['name']);
            if (
                luckdraws['winners']['first_postion']['name'] === undefined &&
                !tymmatch &&
                luckdraws['participated_users'].length > 0
            ) {
                var firstnum = firstrandomNumber(
                    0,
                    luckdraws['participated_users'].length
                );
                luckdraws['winners']['first_postion'] =
                    luckdraws['participated_users'][firstnum];
                if (luckdraws['participated_users'].length > 1) {
                    var secondnum = secondrandomNumber(
                        0,
                        luckdraws['participated_users'].length,
                        firstnum
                    );
                    luckdraws['winners']['second_position'] =
                        luckdraws['participated_users'][secondnum];
                }
                if (luckdraws['participated_users'].length > 2) {
                    var thirdnum = thirdrandomNumber(
                        0,
                        luckdraws['participated_users'].length,
                        firstnum,
                        secondnum
                    );
                    luckdraws['winners']['third_position'] =
                        luckdraws['participated_users'][thirdnum];
                }
                luckdraws.save(function (err, done) {
                    if (err) console.log(err);
                    else console.log(done);
                });
                res.json(new ApiSuccess(luckdraws['winners']));
            } else {
                res.json(new ApiSuccess(luckdraws));
            }
        });
});

module.exports = route;
