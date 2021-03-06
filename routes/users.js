var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user')

//Register
router.get('/register', function(req, res) {
	res.render('register');
});

//Login
router.get('/login', function(req, res) {
	res.render('login');
});

//Register
router.post('/register', function(req, res) {
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var username = req.body.username;
	var gender = req.body.gender;
	var birthdate = Date.parse(req.body.birthdate);
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	//Validation
	req.checkBody('first_name', 'First name is required').notEmpty();
	req.checkBody('last_name', 'Last name is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('birthdate', 'Birthdate is required').isDate();
	req.checkBody('gender', 'Gender is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			first_name: first_name,
			last_name: last_name,
			username: username,
			birthdate: birthdate,
			gender: gender,
			email: email,
			password: password
		});

		User.createUser(newUser, function(err, user) {
			if (err) throw err;
			console.log(User);
		});

		req.flash('success_msg', 'You are registered and can now log in');
		res.redirect('/users/login');

	}
});

//Passport local strategy
//check model for getUserByUsername and comparePassword
passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.getUserByUsername(username, function(err, user){
  		if (err) throw err;
  		if (!user) {
  			return done(null, false, {message: 'Unknown User'});
  		}

  		User.comparePassword(password, user.password, function(err, isMatch) {
  			if (err) throw err;
  			if (isMatch) {
  				return done(null, user);
  			} else {
  				return done(null, false, {message: 'Invalid password'});
  			}
  		});
  	});
  }));

//Serialize/deserialize
//see model for getUserById
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//Login & Passport authentication
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
  	res.redirect('/');
  });

//logout
router.get('/logout', function(req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;