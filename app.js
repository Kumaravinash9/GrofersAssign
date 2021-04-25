const express = require('express');
const cat = require('cat-me');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./models/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const luckyDrawRoutes = require('./Routes/LuckyDraw/luckyDraw');
const Auth = require('./Routes/Auth/googleAuth');
const app = express();

dotenv.config({
    path: 'config.env',
});

// local mongos database

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

// Auth session && Googlepassport Auth setup
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
            clientID:
                '179375713146-4465b5ku1uum5t9o1vgi7u8uaq8jps0a.apps.googleusercontent.com',
            clientSecret: 'cFmmwyFcssa4Qp2Vzp_yKS5F',
            callbackURL: '/googleAuth',
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({ googleId: profile.id }, function (err, user) {
                if (err) console.log(err);
                else {
                    if (user) {
                        done(null, user);
                    } else {
                        console.log(profile);
                        User.create(
                            {
                                name: profile.displayName,
                                prof_pic: profile.photos[0].value,
                                googleId: profile.id,
                            },
                            function (err, user) {
                                if (err) console.log(err);
                                else done(null, user);
                                console.log(user);
                            }
                        );
                    }
                }
            });
        }
    )
);

// Routes
app.use(luckyDrawRoutes);
app.use(Auth);

// server listen Port
// const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(cat());
});
