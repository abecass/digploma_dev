var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//set schema

var userSchema = mongoose.Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	username: {
		type: String,
		index: true
	},
	gender: {
		type: String
	},
	birthdate: {
		type: Date
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
};

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	// Load hash from your password DB. 
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
	   // if (err) throw err;
	    callback(null, isMatch);
	});
};