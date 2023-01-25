import { Schema, model } from "mongoose";

const bellContent = new Schema({
  title: {
    type: String,
    require: true,
    maxlength: 20,
    minlength: 3,
  },
  message: {
    type: String,
    require: true,
    maxlength: 150,
    minlength: 5,
  },
  datetime: {
    type: Date,
    require: true,
  },
});

export const BellContent = model("BellContent", bellContent);
