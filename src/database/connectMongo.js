import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config("../../.env");
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Coneccion establecida con MongoDB");
  })
  .catch((err) => {
    console.log("Error al conectarse a MongoDB: " + err);
  });
