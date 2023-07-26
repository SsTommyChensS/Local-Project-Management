const projectService = require('../services/projects.service');

const NotFoundError = require('../errors/NotFoundError');

const checkExistedProject = async (req, res, next) => {
    try {
        const project_id = req.params.id;
    
        const project = await projectService.getProject(project_id);
        if(!project) {
            throw new NotFoundError(`Cannot find project with id ${project_id}!`);
        }
    
        req.project_data = project;
    
        next();  
    } catch (error) {
        next(error);
    }
}

module.exports = checkExistedProject;