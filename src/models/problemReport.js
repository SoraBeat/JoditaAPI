import { Schema, model } from "mongoose";

const problemReport = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  datetime: {
    type: Date,
    require: true,
  },
  problemType: {
    type: String,
    require: true,
    maxlength: 15,
    minlength: 3,
  },
  description: {
    type: String,
    maxlength: 100,
  },
});

export const ProblemReport = model("ProblemReport", problemReport);
