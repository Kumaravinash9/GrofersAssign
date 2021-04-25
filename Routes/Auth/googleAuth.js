const express = require('express');
const route = express.Router();
const passport = require('passport');
const User = require('../../models/user');

route.get('/register', function (req, res) {
    res.render('register');
});

route.post('/register', function (req, res) {
    User.register(
        new User({ username: req.body.username }),
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                return res.render('register');
            }
            passport.authenticate('local')(req, res, function () {
                res.redirect('/getallluckydraw');
            });
        }
    );
});

/****************************LogIn Route*************************/

route.get('/', function (req, res) {
    res.render('login');
});

route.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/',
        successRedirect: '/getallluckydraw',
    }),
    function (req, res) {}
);

route.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/getallluckydraw');
});

module.exports = route;
