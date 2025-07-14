import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: "GET,POST,PUT,DELETE", // Allow necessary methods
    allowedHeaders: "Content-Type,Authorization", // Allow necessary headers
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
// app.use(cookieParser(process.env.COOKIE_SECRET));

import authRouter from "./routes/auth.route.js";
app.use("/api/auth", authRouter);

import projectRouter from "./routes/project.route.js"
app.use("/api", projectRouter);

import userRouter from "./routes/user.route.js";
app.use("/api", userRouter);

import taskRouter from "./routes/task.route.js"
app.use("/api", taskRouter)

export default app;