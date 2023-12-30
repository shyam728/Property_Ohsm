const mongoose = require('mongoose');

const SignUpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  
 
});

// Create SignUp Model
const SignUp = mongoose.model('SignUp', SignUpSchema);

module.exports = SignUp;
