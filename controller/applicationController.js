import Application from "../models/application.js";
import Job from "../models/job.js";
import cloudinary from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import fs from "fs";

const applyToJob = async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const resume = req.file ? req.file.path : null;
  let cloudUrl = null;

  try {
    const job = await Job.findById(jobId).populate("postedBy");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const alreadyApplied = await Application.findOne({
      jobId,
      seekerId: req.user._id,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    // Upload to Cloudinary
    if (resume) {
      const result = await cloudinary.uploader.upload(resume, {
        folder: "jobboard/resumes",
        resource_type: "auto",
      });
      cloudUrl = result.secure_url;
      fs.unlinkSync(resume); // Remove local file
    }

    const application = await Application.create({
      jobId,
      seekerId: req.user._id,
      coverLetter,
      resume: {
        local: resume,
        cloud: cloudUrl,
      },
      status: "pending",
    });

    // Get seeker and employer info
    const seeker = req.user;
    const employer = job.postedBy;

    // ✅ Email to Employer
    if (employer?.email) {
      await sendEmail({
        to: employer.email,
        subject: `New Application for "${job.title}"`,
        text: `Hi ${employer.name},\n\n${seeker.name} has applied for your job: "${job.title}".\n\nLogin to view the resume.\n`,
      });
    }

    // ✅ Email to Seeker
    if (seeker?.email) {
      await sendEmail({
        to: seeker.email,
        subject: `You applied for "${job.title}"`,
        text: `Hi ${seeker.name},\n\nYour application for "${job.title}" has been submitted successfully.\n\nWe'll notify you when the employer reviews it.\n`,
      });
    }

    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("jobId", "title company")
      .populate("seekerId", "name email");

    res.status(200).json({ total: apps.length, applications: apps });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ seekerId: req.user._id }).populate(
      "jobId",
      "title company"
    );

    res.status(200).json({ total: apps.length, applications: apps });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const application = await Application.findById(id)
      .populate("seekerId", "name email")
      .populate("jobId", "title");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // ✅ Send email to seeker
    const seeker = application.seekerId;
    const job = application.jobId;

    if (seeker?.email) {
      await sendEmail({
        to: seeker.email,
        subject: `Update on your application for "${job.title}"`,
        text: `Hi ${seeker.name},\n\nYour application for the job "${
          job.title
        }" has been updated to: ${status.toUpperCase()}.\n\nPlease log in to your dashboard for more info.\n\nBest,\nJob Board`,
      });
    }

    res.status(200).json({ message: "Status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  applyToJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus,
};
