import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  users: Number  
})

export const OTP = mongoose.model("OTP", userSchema)
