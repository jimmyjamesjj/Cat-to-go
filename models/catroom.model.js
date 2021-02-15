

const mongoose = require("mongoose")

let catroomSchema = new mongoose.Schema({

  catname: {type:String,
    required: true
    }, 
    number_of_cats: {type:String,
      required: true
      }, 
     
    breed:String,
    catsize:{
      type:String,
      required:true
    },
    number_of_nights:{String,
    required:true
    },
   date:{
     type:String,
     required:true
   },
   instruction:String,
    phonenumber: {
      type: String,
      owneraddress: {
        type: String,
        required: true
      },
      required: true
    }
})

let catroommodel = mongoose.model('catroom', catroomSchema)

module.exports = catroommodel 