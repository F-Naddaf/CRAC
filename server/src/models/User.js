import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  numberForCheck: Number,
});

export const OTP = mongoose.model('OTP', userSchema);
