import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    resume: {
      local: { type: String }, // Local file path
      cloud: { type: String }, // Cloudinary URL
    },
  },
  { timestamps: true }
);

export default mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
