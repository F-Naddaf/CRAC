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

// export const createNewVideo = async (req, res) => {
//   const { media, mediaId, userId, userImage } = req.body;
//   console.log("req", req.body);
//   try {
//     if (mediaId) {
//       // Update existing video
//       // const video = await User.findOne( $in:{mediaUrl:{_id: mediaId}});
//       if (video) {
//         if (media.posted) {
//           video.title = media.title;
//           video.posted = media.posted;
//           video.userId = userId;
//           video.userImage = userImage;
//           const updatedMedia = await video.save();

//           res.status(200).json({ success: true, updatedMedia });
//         } else {
//           res.status(400).json({
//             success: false,
//             message: "Invalid request. 'posted' is required.",
//           });
//         }
//       } else {
//         await User.findByIdAndUpdate(userId, {
//           $push: {
//             mediaUrl: {
//               title: video.title,
//               url: video.url,
//               posted: video.posted,
//             },
//           },
//         });
//         // res.status(404).json({ success: false, message: "Video not found." });
//       }
//     } else {
//       // Create new video

//       // const newVideo = await User.create({ ...media, userId, userImage });
//       res.status(200).json({ success: true, newVideo });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal Error." });
//   }
// };

export const postVideo = async (req, res) => {
  const { media, firstRecord, userId, userImage } = req.body;
  try {
    if (firstRecord) {
      if (media.posted) {
        const newVideo = await Videos.create({
          title: media.title,
          url: media.url,
          posted: media.posted,
          userId: userId,
          userImage: userImage,
        });
        await User.findByIdAndUpdate(userId, {
          $push: {
            mediaUrl: {
              title: media.title,
              url: media.url,
              posted: media.posted,
            },
          },
        });
        const updatedUser = User.findById(userId);
        res.status(200).json({ success: true, newVideo, updatedUser });
      } else {
        await User.findByIdAndUpdate(userId, {
          $push: {
            mediaUrl: {
              title: media.title,
              url: media.url,
              posted: media.posted,
            },
          },
        });
        const updatedUser = User.findById(userId);
        res.status(200).json({ success: true, updatedUser });
      }
    } else {
      const newVideo = await Videos.create({
        title: media.title,
        url: media.url,
        posted: media.posted,
        userId: userId,
        userImage: userImage,
      });
      await User.findOneAndUpdate(
        { _id: userId, "mediaUrl.url": media.url },
        {
          $set: {
            "mediaUrl.$.posted": media.posted,
            "mediaUrl.$.title": media.title,
          },
        }
      );
      const updatedUser = User.findById(userId);
      res.status(200).json({ success: true, newVideo, updatedUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error." });
  }
};

export const addToFavorite = async (req, res) => {
  const { videoId, userId } = req.body;
  try {
    const user = await User.findById(userId);
    const video = await Videos.findById(videoId);

    if (!user || !video) {
      return res.status(404).json({ message: "User or video not found" });
    }

    const favoriteIndex = user.favoriteVideos.findIndex(
      (item) => item.videoId === videoId
    );

    if (favoriteIndex > -1) {
      user.favoriteVideos.splice(favoriteIndex, 1);
      if (video.amountOfLike && video.amountOfLike > 0) {
        video.amountOfLike--;
        res.json({
          success: true,
          result: user,
          message: "Video is removed from favorites successfully",
        });
      }
    } else {
      user.favoriteVideos.push({ videoId });
      video.amountOfLike = (video.amountOfLike || 0) + 1;
      res.json({
        success: true,
        result: user,
        message: "Video is added to favorites successfully",
      });
    }

    await user.save();
    await video.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
