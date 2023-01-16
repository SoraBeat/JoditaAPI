import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/user.route.js";
import premiumRouter from "./routes/premium.route.js";
import authRouterPublic from "./routes/auth.route.js";
import userRouterPublic from "./routes/user.public.route.js";
import followRouterPublic from "./routes/follow.public.route.js";
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
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use("/api/private", userRouter);
app.use("/api/private", premiumRouter);
app.use("/api/public", authRouterPublic);
app.use("/api/public", userRouterPublic);
app.use("/api/public", followRouterPublic);

//MongoDB Conecction
app.get("/", (req, res) => res.send("Bienvenido a mi API"));
app.listen(port, () => console.log(`Api escuchando en puerto: ${port} ...`));
