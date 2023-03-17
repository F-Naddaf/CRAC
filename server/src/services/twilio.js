// import { logInfo } from '../../util/logging.js';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
let service;
export const sendSms = async (phoneNumber) => {
  try {
    service = await client.verify.v2.services.create({
      friendlyName: 'CutCast SMS verification',
      codeLength: 5,
    });
    await client.verify.v2
      .services(service.sid)
      .verifications.create({ to: `${phoneNumber}`, channel: 'sms' });
    return service.sid;
  } catch (error) {
    logInfo(error);
  }
};
export const verifySms = async (phoneNumber, smsCode, serviceSid) => {
  try {
    const verification_check = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `${phoneNumber}`, code: `${smsCode}` });
    return verification_check.status;
  } catch (error) {
    logInfo(error);
  }
};
