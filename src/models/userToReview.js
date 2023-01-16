import { Schema, model } from "mongoose";

const userToReview = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  datetime: {
    type: Date,
    require: true,
  },
});

export const UserToReview = model("UserToReview", userToReview);
