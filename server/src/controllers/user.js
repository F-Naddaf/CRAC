import { sendSms, verifySms } from '../services/twilio.js';

export const addUserPhone = async (req, res) => {
  const phone = req.body.phone;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  const serviceSid = await sendSms(phone);
  res.status(200).json({ success: true, service: serviceSid });
};

export const verifyCode = async (req, res) => {
  const { code, serviceSid, phone } = req.body;
  try {
    const isSmsCodeValid = await verifySms(phone, code, serviceSid);
    if (isSmsCodeValid === 'approved') {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
