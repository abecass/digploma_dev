var express = require('express');
var router = express.Router();

//get homepage
router.get('/', ensureAuthenticated, function(req, res) {
	res.render('index');
});

//get messages
router.get('/messages', ensureAuthenticated, function(req, res) {
	res.render('messages');
});

//get profile
router.get('/profile', ensureAuthenticated, function(req, res) {
	res.render('profile');
});

//restrict page views based on login status
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg', 'You are not logged in.');
		res.redirect('/users/login');
	}
}

module.exports = router;