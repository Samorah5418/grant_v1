const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "first name cannot be empty"],
  },
  lastname: {
    type: String,
    required: [true, "last name cannot be empty"],
  },
  othername: String,
  income: {
    type: String,
    required: [true, "this field cannot be empty"],
  },
  occupation: {
    type: String,
    required: [true, "this field cannot be empty"],
  },
  amount: {
    type: String,
    enum: [
      "20000",
      "30000",
      "50000",
      "70000",
      "100000",
      "150000",
      "200000",
      "500000",
    ],
    default: ["20000"],
  },
  gender: {
    type: String,
    enum: ["female", "male"],
    required: [true, "please select a gender"],
  },
  reason: {
    type: String,
    required: [true, "please enter a reason for application"],
    minlength: [30, "reason should be more than 30 characters"],
  },
  phone: {
    type: String,
    required: [true, "please provide a phone"],
  },
  address: {
    type: String,
    required: [true, "please enter an address"],
  },
  state: {
    type: String,
    required: [true, "this field cannot be empty"],
  },
  dob: {
    type: String,
    required: [true, "age is  required"],
  },
  creditscore: {
    type: Number,
    required: [true, "this field cannot be empty"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  image: {
    type: String,
    required: [true, "user image is required"],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "{VALUE} is not a supported role",
    },
    default: "user",
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
});

// UserSchema.pre('save', async function(next) {
//    try {
//      if (!this.isModified("password")) {
//        return next();
//      }
//      this.password = await bcrypt.hash(this.password, 10);
//      next()
//    } catch (error) {
//     console.error(error);
//     next(error)
//    }
// })

// UserSchema.statics.comparePassword = async function(email, password) {
//     try {
//         const user = await this.findOne({email});
//         if(!user) {
//             throw new Error('user not found')
//         }  
//         const isMatch = await bcrypt.compare(password, user.password);
//         if(isMatch) {
//             return user;
//         } else {
//             throw new Error('Incorrect password')
//         }
//     } catch (error) {
//         console.error(error)
//         throw new Error(error.message)
//     }
// }

module.exports = mongoose.model("User", UserSchema);