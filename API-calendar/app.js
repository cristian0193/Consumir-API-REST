var express = require("express");
var passport = require("passport");
var cookieSession = require("cookie-session");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var Event = require('./calendar-client');

var app = express();

app.use(cookieSession({
  keys: ['adasdd76d8as7', 'dasd8d978a9sd']
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: "312437108600-prbgqf11590u7d9iep4mlilb8j982og8.apps.googleusercontent.com",
  clientSecret: "_OOyDFaNF6jLEUzuQZM0LQoQ",
  callbackURL: "http://localhost:8080/auth/google/callback",
}, function(accessToken, refreshToken, profile, cb) {
  var user = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    profile: profile
  };

  return cb(null, user);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.set('view engine', 'pug')

app.get("/", function(req, res) {

  if (isLoggedIn(req)) {
    //res.render("home");
    //solicitar todos los eventos del calendario principal

    var event = new Event(req.session.passport.user.accessToken);

    event.all(function(data) {
      res.send(data);
    });

  } else {
    res.render("index");
  }

});

app.get("/auth/google/callback", passport.authenticate('google', {
    failureRedirect: '/'
  }),
  function(req, res) {
    res.redirect('/');
  });

app.post("/login", passport.authenticate('google', {
  scope: ['profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.email']
}));

app.post("/logout", function(req, res) {

  if (isLoggedIn(req)) {
    req.session.passport.user = null;
  }
  res.redirect("/");
});

function isLoggedIn(req) {
  return typeof req.session.passport !== "undefined" && req.session.passport.user;
}

app.listen(8080);