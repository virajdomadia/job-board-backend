import Job from "../model/Job.js";
import Application from "../model/Application.js";

const getEmployerDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user._id });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title")
      .populate("seekerId", "name email");

    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      jobsPosted: jobs.length,
      totalApplications: applications.length,
      statusBreakdown: statusCounts,
      jobs,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSeekerDashboard = async (req, res) => {
  try {
    const applications = await Application.find({ seekerId: req.user._id })
      .populate("jobId", "title company location")
      .sort("-createdAt");

    res.json({
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getEmployerDashboard, getSeekerDashboard };
