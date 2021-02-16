const mongoose = require("mongoose");




let adminSchema = new mongoose.Schema({
  adminname:String,
  adminemail: {
    type: String,
    required: true
  },
  adminpassword: {
    type: String,
    required: true
  },
  catroom:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'catroom'

  }],
  user:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  }]
  
})



let adminModel = mongoose.model('admin', adminSchema)



module.exports = adminModel
