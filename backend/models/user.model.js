const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.pre("save", async function (next) {
  //with the help of "this" i am able to get the user object
  //"if" logic is used here so that so that we know if the user has not changed its password then we have to call next()
  if (!this.isModified("password")) return next();
  //if user has changed/created his password then->
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//we have created a function which will check if the user entered password and the encrypted password in db is same or not
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
  console.log(process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(
    {
      _id: this._id,
      username: this.userSchema,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
const User = mongoose.model("User", userSchema);

module.exports = User;
