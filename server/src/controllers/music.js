import { Music } from "../models/Music.js";

export const getAllMusica = async (req, res) => {
  try {
    const songs = await Music.find();
    const reversedSongs = songs.reverse();
    res.status(200).json({ success: true, songs: reversedSongs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch songs." });
  }
};

export const addMusic = async (req, res) => {
  try {
    const { title, url, singerName, image, duration } = req.body;
    const music = new Music({
      title,
      url,
      singerName,
      image,
      duration,
    });
    const savedMusic = await music.save();

    res.status(201).json({ success: true, music: savedMusic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add music." });
  }
};
