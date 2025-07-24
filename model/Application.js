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
    notes: {
      type: String,
      default: "",
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Indexes for performance
applicationSchema.index({ jobId: 1 });
applicationSchema.index({ seekerId: 1 });
applicationSchema.index({ status: 1 });

export default mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
