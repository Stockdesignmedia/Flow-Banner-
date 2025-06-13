import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bannerRoutes from "./routes/bannerRoutes.js";
import bulkRoutes from "./routes/bulkRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/banner", bannerRoutes);
app.use("/api/bulk", bulkRoutes);

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => console.log("API running on port", PORT));
  })
  .catch((err) => console.error(err));