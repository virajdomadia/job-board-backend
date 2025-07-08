import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import auth from "./route/authRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// app.get("/", (req, res) => {
//   res.send("Job Board API is running");
// });

app.use("/api/auth", auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
