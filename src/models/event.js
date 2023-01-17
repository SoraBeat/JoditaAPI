import { Schema, model } from "mongoose";

const event = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
    trim: true,
  },
  title: {
    type: String,
    require: true,
    trim: true,
  },
  description: {
    type: String,
    require: true,
    trim: true,
  },
  place: {
    type: String,
    require: true,
  },
  eventType: {
    type: "String",
    require: true,
    trim: true,
  },
  capacity: {
    type: Number,
    require: true,
    trim: true,
  },
  tags: {
    type: [String],
    trim: true,
  },
  datetime: {
    type: Date,
    require: true,
  },
  price: {
    type: Number,
    require: true,
    trim: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
});

export const Event = model("Event", event);
