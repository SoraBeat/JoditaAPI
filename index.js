import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import userRouter from "./src/routes/user.route.js";
import premiumRouter from "./src/routes/premium.route.js";
import reportRouter from "./src/routes/reports.route.js";
import eventRouter from "./src/routes/events.route.js";
import bellRouter from "./src/routes/bell.route.js";

import authRouterPublic from "./src/routes/auth.route.js";
import userRouterPublic from "./src/routes/user.public.route.js";
import followRouterPublic from "./src/routes/follow.public.route.js";
import reportRouterPublic from "./src/routes/reports.public.route.js";
import eventRouterPublic from "./src/routes/events.public.route.js";
import messageRouterPublic from "./src/routes/messages.public.route.js";
import bellRouterPublic from "./src/routes/bell.public.route.js";

import "./src/database/connectMongo.js";
import path from "path";

const __dirname = path.resolve();

//Initial config
const app = express();
const port = process.env.PORT || 3001;
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 Minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

//Middlewares
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/private", userRouter);
app.use("/api/private", premiumRouter);
app.use("/api/private", reportRouter);
app.use("/api/private", eventRouter);
app.use("/api/private", bellRouter);

app.use("/api/public", authRouterPublic);
app.use("/api/public", userRouterPublic);
app.use("/api/public", followRouterPublic);
app.use("/api/public", reportRouterPublic);
app.use("/api/public", eventRouterPublic);
app.use("/api/public", messageRouterPublic);
app.use("/api/public", bellRouterPublic);

//MongoDB Conecction
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./index.html")));

app.listen(port, () => console.log("Server listening on port " + port));
