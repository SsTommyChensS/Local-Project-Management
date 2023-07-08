const mongoose = require('mongoose');
const Project = require('../models/projects.model');

const checkExistedProject = async (req, res, next) => {
    const project_id = req.params.id;

    if(!mongoose.isValidObjectId(project_id)) {
        return res.status(400).send({
            status: 'Failed',
            message: 'Invalid project id value!'
        });
    }

    const project = await Project.findById(project_id);
    if(!project) {
        return res.status(400).send({
            status: 'Failed',
            message: `Cannot find project with id ${project_id}!`
        });
    }

    req.project_data = project;

    next();
}

module.exports = checkExistedProject;