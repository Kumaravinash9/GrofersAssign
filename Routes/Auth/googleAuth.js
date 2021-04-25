const express = require('express');
const route = express.Router();
const passport = require('passport');

route.get('/google', passport.authenticate('google', { scope: ['profile'] }));

route.get(
    '/googleAuth',
    passport.authenticate('google', {
        failureRedirect: '/',
        successRedirect: '/getallluckydraw',
    }),
    function (req, res) {}
);

route.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/getallluckydraw');
});

route.get('/', (req, res) => {
    res.render('login');
});
module.exports = route;
