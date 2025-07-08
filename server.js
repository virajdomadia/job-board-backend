import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import auth from "./route/authRoute.js";
import job from "./route/jobRoute.js";
import application from "./route/applicationRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// app.get("/", (req, res) => {
//   res.send("Job Board API is running");
// });

app.use("/api/auth", auth);
app.use("/api/jobs", job);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
