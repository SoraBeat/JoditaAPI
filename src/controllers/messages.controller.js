import { MessageContent } from "../models/messages.js";

export const postMessage = async (req, res) => {
  const { userId, userName, image, content } = req.body;
  const datetime = Date.now();
  try {
    //Save in database
    const message = await new MessageContent({
      userId,
      userName,
      image,
      content,
      datetime,
    });

    await message.save();

    return res
      .status(200)
      .json({ data: message, message: "The message was created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await await MessageContent.find()
      .sort({ datetime: -1 })
      .limit(20);

    return res.status(200).json({ data: messages, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
