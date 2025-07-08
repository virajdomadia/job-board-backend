import Application from "../models/application.js";

import Application from "../models/application.js";
import Job from "../models/job.js";

const applyToJob = async (req, res) => {
  const { jobId, coverLetter } = req.body;

  try {
    const job = await Job.findById(jobId);
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
    const resumePath = req.file ? req.file.path : null;

    const newApplication = new Application({
      jobId,
      seekerId: req.user._id,
      coverLetter,
      resume: resumePath,
      status: "Pending",
    });

    const saved = await newApplication.save();

    res.status(201).json({
      message: "Applied successfully",
      application: saved,
    });
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
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

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
