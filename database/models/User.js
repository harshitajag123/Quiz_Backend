const mongoose = require("mongoose");

const emailValidator = (email) => {
	const emailRegex = /^\S+@\S+\.\S+$/;
	return emailRegex.test(email);
};

const userSchema = new mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: [3, "Name must be at least 3 characters long"],
		maxLength: [50, "Name must be less than 50 characters long"],
	},
	email: {
    type:String,
    required:true,
    trim:true,
    unique:[true,"Email already exists"],
    validate:[emailValidator," Please enter a valid email"],
  },

  password:{
    type:String,
    required:true,
    trim:true,
    minLength:[6,"Password must be at least 6 characters long"],
  }
});

const User = mongoose.model('user',userSchema);
module.exports = User;
