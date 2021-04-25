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
const cors = require('cors');
const passportLocal = require('passport-local');

dotenv.config({
    path: 'config.env',
});
app.use(cors());

// local mongos database
mongoose.connect(
    'mongodb+srv://avinash:9905645732@cluster1.pkvrv.mongodb.net/grofers?retryWrites=true&w=majority',
    { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true }
);
mongoose.connection.on('connected', () => {
    console.log('it is Connected Now');
});

mongoose.connection.on('error', () => {
    console.log('anything is garbar ');
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
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new passportLocal(User.authenticate()));

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(cat());
});
