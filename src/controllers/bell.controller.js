import { BellContent } from "../models/bell.js";

export const postBell = async (req, res) => {
  const { title,message,datetime  } = req.body;
  try {
    //Save in database
    const bell = new BellContent({
      title,
      message,
      datetime
    });
    await bell.save();

    return res
      .status(200)
      .json({ data: bell, message: "The bell was created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};