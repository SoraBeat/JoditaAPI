import { Schema, model } from "mongoose";

const messageContent = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default: null,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
    require: true,
  },
  datetime: {
    type: Date,
    require: true,
  },
});

export const MessageContent = model("MessageContent", messageContent);
