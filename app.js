const express = require('express');
const cat = require('cat-me');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./models/user');
const passport = require('passport');

const luckyDrawRoutes = require('./Routes/LuckyDraw/luckyDraw');
const Auth = require('./Routes/Auth/googleAuth');
const app = express();
const cors = require('cors');
const passportLocal = require('passport-local');

dotenv.config({
    path: 'config.env',
});
app.use(cors());

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

// Routes
app.use(luckyDrawRoutes);
app.use(Auth);

// server listen Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(cat());
});
