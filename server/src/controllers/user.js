import { User } from "../models/User.js";
import { Videos } from "../models/Media.js";
import { sendSms, verifySms } from "../services/twilio.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(400);
  }
};

export const register = async (req, res) => {
  const { username, first, last, email, confirmPassword, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser)
      return res.status(409).json({ message: "This user already exists" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password don't match." });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      username: username,
      email: email,
      firstname: first,
      lastname: last,
      password: hashedPassword,
    });
    const accessToken = jwt.sign(
      {
        email: newUser.email,
        id: newUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    await User.findOne({ email: newUser.email });

    res.status(200).json({
      success: true,
      accessToken: accessToken,
      profile: {
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser === null) {
      res
        .status(401)
        .json({ success: false, message: "email or password is incorrect" });
    }

    if (!existingUser)
      return res.status(404).json({ message: "This User doesn't exist" });

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invaild Password" });
    }
    const accessToken = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    await User.findOne({ email: existingUser.email });
    res.status(200).json({
      message: "Login successful!",
      success: true,
      accessToken: accessToken,
      profile: {
        email: existingUser.email,
        username: existingUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      const newUser = await User.create({
        email: req.body.email,
        firstname: req.body.first,
        lastname: req.body.last,
        username: req.body.username,
      });
      await newUser.save();
    }
    res.status(200).json({
      message: "Login successful!",
      success: true,
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while logging in.",
      error: err.message,
    });
  }
};

export const getUser = async (req, res) => {
  const email = req.user.email;
  try {
    const user = await User.findOne({ email: email });
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Unable to get user, try again later" });
  }
};

export const addUserPhone = async (req, res) => {
  const { phone, email } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }
  const existingUser = await User.findOneAndUpdate(
    { email: email },
    { numberForCheck: phone }
  );
  try {
    const serviceSid = await sendSms(phone);
    res.status(200).json({ success: true, service: serviceSid });
  } catch (err) {
    res.status(500).json({ message: "Internal Error." });
  }
};

export const verifyCode = async (req, res) => {
  const { code, serviceSid, phone } = req.body;
  try {
    const existingUser = await User.findOne({ numberForCheck: phone });
    if (existingUser) {
      const isSmsCodeValid = await verifySms(phone, code, serviceSid);
      if (isSmsCodeValid === "approved") {
        const updatedUser = await User.findByIdAndUpdate(existingUser._id);
        res.status(200).json({
          success: true,
          profile: {
            email: updatedUser.email,
            username: updatedUser.username,
          },
        });
      }
    } else {
      res.status(404).json({ message: "This User doesn't exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Error." });
  }
};

// export const addMedia = async (req, res) => {
//   const { media, id } = req.body;
//   try {
//     const updatedUser = await User.findByIdAndUpdate(id, {
//       $push: { mediaUrl: media },
//     });
//     if (updatedUser) {
//       res.status(200).json({ success: true, updatedUser });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal Error." });
//   }
// };

export const addMedia = async (req, res) => {
  const { media, id } = req.body;
  try {
    if (media.posted) {
      // Save in mediaSchema
      const newVideo = await Videos.create(media);
      const updatedUser = await User.findByIdAndUpdate(id, {
        $push: { mediaUrl: newVideo },
      });
      res.status(200).json({ success: true, updatedUser });
    } else {
      // Save in userSchema only
      const updatedUser = await User.findByIdAndUpdate(id, {
        $push: { mediaUrl: media },
      });
      res.status(200).json({ success: true, updatedUser });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Error." });
  }
};

// export const addFavorite = async (req, res) => {
//   const email = req.user;
//   const { videoId } = req.params;
//   try {
//     const user = await User.findOne({ email: email });
//     const isProductFavorite = user.favorites.some(
//       (product) => product.productId.toString() === productId
//     );
//     if (!isProductFavorite) {
//       await User.findOneAndUpdate(
//         { email: req.user },
//         { $push: { favorites: { productId } } }
//       );
//     } else {
//       await User.findOneAndUpdate(
//         { email: req.user },
//         { $pull: { favorites: { productId } } }
//       );
//     }
//     const updatedUser = await User.findOne(
//       { email: email },
//       { password: false }
//     )
//       .populate({
//         path: "recentViews.productId",
//         select: "images price title rate",
//       })
//       .populate({
//         path: "shoppingCart.productId",
//         select: "images price title inStock rate brand",
//       })
//       .exec();
//     res.status(200).json({
//       success: true,
//       result: updatedUser,
//     });
//   } catch (error) {
//     logError(error);
//     res
//       .status(500)
//       .json({ success: false, msg: "Unable to update user, try again later" });
//   }
// };
