import Application from "../model/Application.js";
import Job from "../model/Job.js";
import cloudinary from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import fs from "fs";

const applyToJob = async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const resume = req.file ? req.file.path : null;
  let cloudUrl = null;

  try {
    const job = await Job.findById(jobId).populate("employerId");
    if (!job) return res.status(404).json({ message: "Job not found" });

    const alreadyApplied = await Application.findOne({
      jobId,
      seekerId: req.user._id,
    });
    if (alreadyApplied)
      return res.status(400).json({ message: "Already applied to this job" });

    if (resume) {
      const result = await cloudinary.uploader.upload(resume, {
        folder: "jobboard/resumes",
        resource_type: "raw", // ✅ FIX: ensure PDF uploads properly
      });
      cloudUrl = result.secure_url;
      fs.unlinkSync(resume); // Clean up local file
    }

    const application = await Application.create({
      jobId,
      seekerId: req.user._id,
      coverLetter,
      resume: { local: resume, cloud: cloudUrl },
    });

    // Email to Employer
    if (job.employerId?.email) {
      await sendEmail({
        to: job.employerId.email,
        subject: `New Application: "${job.title}"`,
        text: `Hi ${job.employerId.name},\n\n${req.user.name} has applied for "${job.title}".\nLog in to view the application.`,
      });
    }

    // Email to Seeker
    if (req.user?.email) {
      await sendEmail({
        to: req.user.email,
        subject: `Application submitted: "${job.title}"`,
        text: `Hi ${req.user.name},\n\nYou've applied for "${job.title}".\nWe'll notify you of status updates.`,
      });
    }

    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user._id }, "_id");
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title company")
      .populate("seekerId", "name email");

    res.status(200).json({ total: applications.length, applications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      seekerId: req.user._id,
    }).populate("jobId", "title company");

    res.status(200).json({ total: applications.length, applications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

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
    application.statusUpdatedAt = new Date();
    if (typeof notes === "string") application.notes = notes;

    await application.save();

    // Notify Seeker
    if (application.seekerId?.email) {
      await sendEmail({
        to: application.seekerId.email,
        subject: `Application status updated: "${application.jobId.title}"`,
        text: `Hi ${application.seekerId.name},\n\nYour application for "${
          application.jobId.title
        }" has been marked as ${status.toUpperCase()}.\n\n${
          notes ? `Notes: ${notes}\n\n` : ""
        }Please check your dashboard for more info.`,
      });
    }

    res.status(200).json({ message: "Status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const checkIfApplied = async (req, res) => {
  const { jobId } = req.params;

  try {
    const existing = await Application.findOne({
      jobId,
      seekerId: req.user._id,
    });

    res.status(200).json({ alreadyApplied: !!existing });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export {
  applyToJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus,
  checkIfApplied,
};
