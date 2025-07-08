import Job from "../models/job.js";

const createJob = async (req, res) => {
  const { title, description, company, location, salary, type } = req.body;

  if (!title || !description || !company || !location || !salary || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      type,
      employerId: req.user._id,
    });

    const savedJob = await newJob.save();

    res
      .status(201)
      .json({ message: "Job created successfully", job: savedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getJob = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employerId", "name email");
    res.status(200).json({ total: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const jobDetails = await Job.findById(id).populate(
      "employerId",
      "name email"
    );

    if (!jobDetails) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(jobDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, description, company, location, salary, type } = req.body;

  if (!title || !description || !company || !location || !salary || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const jobToUpdate = await Job.findById(id);

    if (!jobToUpdate) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (jobToUpdate.employerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    jobToUpdate.title = title;
    jobToUpdate.description = description;
    jobToUpdate.company = company;
    jobToUpdate.location = location;
    jobToUpdate.salary = salary;
    jobToUpdate.type = type;

    const updatedJob = await jobToUpdate.save();

    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const jobToDelete = await Job.findById(id);

    if (!jobToDelete) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (jobToDelete.employerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await jobToDelete.deleteOne();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { createJob, getJob, getJobById, updateJob, deleteJob };
