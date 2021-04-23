const express = require('express');
const cat = require('cat-me');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./models/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const luckyDrawRoutes = require('./Routes/luckyDraw');
const app = express();

dotenv.config({
    path: 'config.env',
});

mongoose
    .connect('mongodb://localhost:27017/grofers', {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('Connected to Database');
    })
    .catch((err) => {
        console.log('Not Connected to Database ERROR! ', err);
    });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
    session({
        secret: 'foo',
        resave: true,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) console.log(err);
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/googleAuth',
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({ email: profile.email }, function (err, user) {
                if (err) console.log(err);
                else {
                    if (user) {
                        done(null, user);
                    } else {
                        User.create(
                            {
                                username: profile.displayName,
                                googleId: profile.id,
                            },
                            function (err, user) {
                                user.save();
                                done(null, user);
                                console.log(user);
                            }
                        );
                    }
                }
            });
        }
    )
);
app.use(luckyDrawRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(cat());
});
