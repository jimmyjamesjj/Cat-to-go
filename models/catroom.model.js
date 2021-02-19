

const mongoose = require("mongoose")

let catroomSchema = new mongoose.Schema({

      room_type:String,
    number_of_cats: {type:String,
      required: true,
      catname: {type:String,
        required: true
        }
      }, 
     
    breed:String,
    catsize:{
      type:String
    },
    number_of_nights:{
      type:String,
      required:true
    },
   date:{
     type:String,
     required:true,
     start_date:String,
     end_date:String
   },
   instruction:String,
    phonenumber: {
      type: String,
      required: true
    },
    owneraddress: {
      type: String,
      required: true
    },
    status:{
      type:String,
      enum:['confirmed','pending','cancelled']
    },
    roomType: String,
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
    }
})

let catroommodel = mongoose.model('catroom', catroomSchema)

module.exports = catroommodel 