const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const catroomSchema = new Schema({
  catroomtype: {
    type: String,
    unique: true,
    require:true
  },
  days: Number,
  TV:Boolean,
  insurance:Boolean
});

const catroom = model("catroom", catroomSchema);

module.exports = catroom;