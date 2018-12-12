const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  followers:[{
      type:ObjectId,
      ref:'User'
  }]
});

const TweetSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required:true

  },
  text: String,
  likes:{
      type:Number,
      default:0
  },
  time: { type: Date, default: Date.now },
  responses:[{
      type:ObjectId,
      ref:'Tweet'
  }]
});

const User = mongoose.model("User", UserSchema);
const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = {
  User: User,
  Tweet: Tweet
};
