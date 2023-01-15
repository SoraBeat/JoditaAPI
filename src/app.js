import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import "./database/connectMongo.js";

//Initial config
const app = express();
const port = process.env.PORT || 3001;
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 Minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

//Middlewares
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api", userRouter);

//MongoDB Conecction
app.get("/", (req, res) => res.send("Bienvenido a mi API"));
app.listen(port, () => console.log(`Api escuchando en puerto: ${port} ...`));
