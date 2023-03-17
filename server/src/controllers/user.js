import { OTP } from '../models/User.js';
// import twilio from 'twilio';
// import { accountSid, authToken } from "../config.js"

// const client = twilio(accountSid, authToken);

export const addUserPhone = async (req, res) => {
  const phone = req.body.phone;
  let randomNum = Math.floor(Math.random() * 90000) + 10000;

  client.messages
    .create({ body: randomNum, from: '+15017122661', to: phone })
    .then(saveUser());

  function saveUser() {
    const newUser = new OTP({
      numberForCheck: randomNum,
    });
    newUser.save(function (err) {
      if (err) {
        console.log('error generating number');
      } else {
        res.render('verify');
      }
    });
  }
};

export const verifyCode = async (req, res) => {
  const code = req.body.code;
  OTP.findOne({ numberForCheck: code }, function (err, found) {
    if (err) {
      res.render('error');
    } else if (found) {
      res.render('success');
      OTP.findOneAndDelete(code, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('deleted');
        }
      });
    } else {
      res.render('error');
    }
  });
};
