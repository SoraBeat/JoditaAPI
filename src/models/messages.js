import { Schema, model } from "mongoose";

const messageContent = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  content: {
    type: String,
    maxlength: 250,
    minlength: 1,
    trim: true,
    require: true,
  },
  datetime: {
    type: Date,
    require: true,
  },
});

export const MessageContent = model("MessageContent", messageContent);