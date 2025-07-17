import Job from "../model/Job.js";

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
    const {
      title,
      company,
      location,
      type,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    let filter = {};

    // 🔍 Filters
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (company) {
      filter.company = { $regex: company, $options: "i" };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (type) {
      filter.type = type;
    }

    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    if (req.user.role === "employer") {
      filter.employerId = req.user._id;
    }

    // 🧮 Pagination
    const skip = (page - 1) * limit;

    // 🔃 Sorting
    const sortOrder = order === "asc" ? 1 : -1;

    const jobs = await Job.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .populate("employerId", "name email");

    const totalJobs = await Job.countDocuments(filter);

    res.status(200).json({
      total: totalJobs,
      page: Number(page),
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    });
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
