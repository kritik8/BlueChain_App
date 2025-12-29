import Project from "../models/Project";

// @desc    Create a new project
// @route   POST /api/projects
// @access  Public (or you can add auth later)
export const createProject = async (req, res) => {
  try {
    const { projectName, hectaresRestored, location, media } = req.body;

    if (!projectName || !hectaresRestored) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const project = new Project({
      generator: req.user._id, // Automatically assign generator
      projectName,
      hectaresRestored,
      location,
      media,
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
