function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash('error', 'oops! you have to loggin first.');
    res.redirect('/login');
}

module.exports = {
    isLoggedIn,
};
