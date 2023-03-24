import { OTP } from '../models/User.js';
import { sendSms, verifySms } from '../services/twilio.js';
import bcryptjs from 'bcryptjs';
import { generateToken } from '../util/generateToken.js';

export const register = async (req, res) => {
  const { username, first, last, email, confirmPassword, password } = req.body;
  try {
    const existingUser = await OTP.findOne({ email: email });
    if (existingUser)
      return res.status(409).json({ message: 'This user already exists' });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password don't match." });
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await OTP.create({
      username,
      email,
      firstname: first,
      lastname: last,
      password: hashedPassword,
      isActivate: false,
    });
    const token = generateToken(newUser.email, newUser._id);
    await OTP.findByIdAndUpdate(newUser._id, { token });

    res.status(200).json({
      success: true,
      profile: {
        email: newUser.email,
        username: newUser.username,
        isActivate: newUser.isActivate,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Error.' });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await OTP.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "This User doesn't exist" });

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invaild Password' });
    const token = generateToken(email, existingUser._id);
    await OTP.findByIdAndUpdate(existingUser._id, {
      token,
    });
    res.status(200).json({
      success: true,
      profile: {
        email: existingUser.email,
        username: existingUser.username,
        isActivate: existingUser.isActivate,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Error' });
  }
};
export const addUserPhone = async (req, res) => {
  const { phone, email } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  const existingUser = await OTP.findOneAndUpdate(
    { email: email },
    { numberForCheck: phone },
  );
  try {
    const serviceSid = await sendSms(phone);
    res.status(200).json({ success: true, service: serviceSid });
  } catch (err) {
    res.status(500).json({ message: 'Internal Error.' });
  }
};

export const verifyCode = async (req, res) => {
  const { code, serviceSid, phone } = req.body;
  try {
    const existingUser = await OTP.findOne({ numberForCheck: phone });

    if (existingUser) {
      const isSmsCodeValid = await verifySms(phone, code, serviceSid);

      if (isSmsCodeValid === 'approved') {
        const updatedUser = await OTP.findByIdAndUpdate(existingUser._id, {
          isActivate: true,
        });
        res.status(200).json({
          success: true,
          profile: {
            email: updatedUser.email,
            username: updatedUser.username,
            isActivate: updatedUser.isActivate,
            token: updatedUser.token,
          },
        });
      }
    } else {
      res.status(404).json({ message: "This User doesn't exist" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Error.' });
  }
};
