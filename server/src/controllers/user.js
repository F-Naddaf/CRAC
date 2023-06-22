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

// Registering a new user
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
      userImage: "",
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

// Login with registed user
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
    existingUser.isActivate = true;
    await existingUser.save();

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

// Login with google and save the user details
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

// Get Active users
export const getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.find({ isActivate: true });
    res.status(200).json(activeUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get the user details
export const getUser = async (req, res) => {
  const email = req.user.email;
  try {
    const user = await User.findOne({ email: email });
    const videos = await Videos.find({ posted: true })
      .sort({ _id: -1 })
      .limit(1);
    const lastVideoId = videos.length > 0 ? videos[0]._id : null;
    user.videoId = lastVideoId;
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Unable to get user, try again later" });
  }
};

//Get a user details by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      const videos = await Videos.find({ userId: id, posted: true });
      res.status(200).json({
        success: true,
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
          userImage: user.userImage,
        },
        videos: videos,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Unable to get user, try again later" });
  }
};

//Update user information
export const updateUser = async (req, res) => {
  const { username, first, last, id, userImage } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.firstname = first;
    user.lastname = last;
    user.userImage = userImage;

    const updatedUser = await user.save();

    await Videos.updateMany(
      { userId: id },
      { $set: { userImage: userImage, username: username } }
    );

    res.status(200).json({
      message: "Your profile has been successfully updated",
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Error." });
  }
};

// Logout user
export const logout = async (req, res) => {
  const { id, isActivate } = req.body;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActivate = isActivate;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Your profile has been successfully updated",
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Error." });
  }
};

// Get friends detail
export const getFriendDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    const friendIds = user.friends.map((friend) => friend.userId);
    const friendDetails = await User.find(
      { _id: { $in: friendIds } },
      "username firstname lastname userImage isActivate followers"
    );
    res.json({
      success: true,
      result: friendDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get followers details
export const getFollowersDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    const friendIds = user.followers.map((friend) => friend.userId);
    const friendDetails = await User.find(
      { _id: { $in: friendIds } },
      "username firstname lastname userImage isActivate followers"
    );
    res.json({
      success: true,
      result: friendDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Adding user phone number
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

// Verify user phone by SMS
export const verifyCode = async (req, res) => {
  const { code, serviceSid, phone } = req.body;
  try {
    const existingUser = await User.findOne({ numberForCheck: phone });
    if (existingUser) {
      const isSmsCodeValid = await verifySms(phone, code, serviceSid);
      if (isSmsCodeValid === "approved") {
        const updatedUser = await User.findByIdAndUpdate(existingUser._id);
        const videos = await Videos.find({ posted: true })
          .sort({ _id: -1 })
          .limit(1);
        const lastVideoId = videos.length > 0 ? videos[0]._id : null;
        res.status(200).json({
          success: true,
          profile: {
            email: updatedUser.email,
            username: updatedUser.username,
          },
          videoId: lastVideoId,
        });
      }
    } else {
      res.status(404).json({ message: "This User doesn't exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Error." });
  }
};

// Adding friend to user list
export const addToFriends = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.friends.push({ userId: friendId });
    await user.save();

    const friendUser = await User.findById(friendId);
    if (friendUser) {
      friendUser.followers.push({ userId });
      await friendUser.save();
      user.followers.push({ userId: friendUser._id });
    }

    return res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Deleting friend from user list
export const deleteFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIndex = user.friends.findIndex(
      (friend) => friend.userId === friendId
    );

    if (friendIndex === -1) {
      return res.status(404).json({ message: "Friend not found" });
    }

    user.friends.splice(friendIndex, 1);

    const friendUser = await User.findById(friendId);
    if (friendUser) {
      const followerIndex = friendUser.followers.findIndex(
        (follower) => follower.userId === userId
      );
      if (followerIndex !== -1) {
        friendUser.followers.splice(followerIndex, 1);
      }
      await friendUser.save();
    }

    await user.save();

    res.json({
      success: true,
      message: "Friend deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add video to favorite
export const addToFavorite = async (req, res) => {
  const { videoId, userId, url, id } = req.body;
  try {
    const user = await User.findById(userId);
    const video = await Videos.findById(videoId);

    if (!user || !video || !url || !id) {
      return res.status(404).json({ message: "User or video not found" });
    }

    if (video.userId === userId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot favorite your own video" });
    }

    const favoriteIndex = user.favoriteVideos.findIndex(
      (item) => item.videoId === videoId
    );

    if (favoriteIndex > -1) {
      user.favoriteVideos.splice(favoriteIndex, 1);
      if (video.favorite && video.favorite > 0) {
        video.favorite--;
        await video.save();
      }
      res.json({
        success: true,
        result: user,
        message: "Video is removed from favorites successfully",
      });
    } else {
      user.favoriteVideos.push({ videoId, url, userId: id });
      video.favorite = (video.favorite || 0) + 1;
      await video.save();
      res.json({
        success: true,
        result: user,
        message: "Video is added to favorites successfully",
      });
    }

    await user.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Saving video to user
export const addSavedVideos = async (req, res) => {
  const { videoId, userId, url, id } = req.body;

  try {
    const user = await User.findById(userId);
    const video = await Videos.findById(videoId);

    if (!user || !video || !url || !id) {
      return res.status(404).json({ message: "User or video not found" });
    }

    if (video.userId === userId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot save your own video" });
    }

    const savedIndex = user.savedVideos.findIndex(
      (item) => item.videoId === videoId
    );

    if (savedIndex > -1) {
      user.savedVideos.splice(savedIndex, 1);
      if (video.saved && video.saved > 0) {
        video.saved--;
        await video.save();
      }
      res.json({
        success: true,
        result: user,
        message: "Video is removed from saved videos successfully",
      });
    } else {
      user.savedVideos.push({ videoId, url, userId: id });
      video.saved = (video.saved || 0) + 1;
      await video.save();
      res.json({
        success: true,
        result: user,
        message: "Video is added to saved videos successfully",
      });
    }

    await user.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
