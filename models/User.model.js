const mongoose = require("mongoose");




let UserSchema = new mongoose.Schema({
  fname: {type:String,
  required: true
  }, 
  sname: {type:String,
    required: true
    }, 
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})



let UserModel = mongoose.model('user', UserSchema)



module.exports = UserModel
