const userService = require('../services/users.service');
const taskService = require('../services/tasks.service');

const NotFoundError = require('../errors/NotFoundError');

//Add a task 
const addTask = async (req, res, next) => {
    try {
        const project = req.project_data;

        //Check start_date - end_date
        const start_date = new Date(req.body.start_date).getTime();
        const end_date = new Date(req.body.end_date).getTime();

        if(start_date >= end_date) {
            return res.status(400).send({
                status: 'Failed',
                message: 'End date must be greater than start date!'
            });
        }
    
        //Check asignee 
        const user_id = req.body.asignee;
        const user = await userService.getUserById(user_id, 2);
        if(!user) {
            throw new NotFoundError(`Cannot find user with id ${user_id}`)
        }
        //Check user is a member of the project or this user is the owner of project
        if(user_id != project.owner) {
            const project_members = project.members;
            const user_checked_member = project_members.filter(member => member.member == user_id);
            if(user_checked_member.length == 0) {
                throw new NotFoundError(`This user with id ${user_id} not a member of the project!`);
            }
        } 
        //Add tasks
        const task_info = {
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            estimate_time: req.body.estimate_time,
            project: project._id,
            asignee: user._id
        }

        await taskService.addTask(task_info);

        res.status(200).send({
            status: 'Success',
            message: `Add task ${req.body.title} for member ${user.fullname} successfully!`
        });
    } catch (error) {
        next(error);
    }
}

//Get tasks by project /tasks/project/:id/page/:page/get
const getTasksByProject = async (req, res, next) => {
    try {
        const project = req.project_data;
        const project_id = project._id;
        const currentPage = req.params.page;

        const tasks = await taskService.getTasksByProject(project_id, currentPage);

        res.status(200).send({
            status: 'Success',
            message: `Get tasks by project ${project_id} successfully!`,
            ...tasks
        });
    } catch (error) {
        next(error);
    }
}

//Get tasks by member /tasks/project/:id/member/:member_id/page/:page/get
const getTasksByMember = async (req, res, next) => {
    try {
        const project = req.project_data;
        const project_id = project._id;
        const user_id = req.params.member_id;
        const currentPage = req.params.page;

        //check existed member
        const user = await userService.getUserById(user_id, 2);
        if(!user) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find user with id ${user_id}`
            });
        }
        //Check user is a member of the project or this user is the owner of project
        if(user_id != project.owner) {
            const project_members = project.members;
            const user_checked_member = project_members.filter(member => member.member == user_id);
            if(user_checked_member.length == 0) {
                return res.status(400).send({
                    status: 'Failed',
                    message: `This user with id ${user_id} not a member of the project!`
                });
            }
        }
        //Get tasks
        const result = await taskService.getTasksByMember(project_id, user_id, currentPage);

        res.status(200).send({
            status: 'Success',
            message: `Get tasks by member ${user_id} of project ${project._id} successfully!`,
            ...result
        });
    } catch (error) {
        next(error);
    }
}

//Get tasks by status /tasks/project/:id/task/status/:status/get
const getTasksByStatus = async (req, res, next) => {
    try {
        const project = req.project_data;
        const project_id = project._id;
        const status = req.params.status;
        const currentPage = req.params.page;

        const result = await taskService.getTasksByStatus(project_id, status, currentPage);

        res.status(200).send({
            status: 'Success',
            message: `Get tasks by project ${project_id} with status ${status} successfully!`,
            ...result
        });
    } catch (error) {
        next(error);
    }
}

//Get tasks by title /tasks/project/:id/title/:title/get
const getTasksByTitle = async (req, res, next) => {
    try {
        const project = req.project_data;
        const project_id = project._id;
        const title = (req.params.title).trim();
        const currentPage = req.params.page;

        const result = await taskService.getTasksByTitle(project_id, title, currentPage);

        res.status(200).send({
            status: 'Success',
            message: `Get tasks by project ${project._id} with ${title} successfully!`,
            ...result
        });
    } catch (error) {
        next(error);
    }
}

//Update task
const updateTask = async (req, res, next) => {
    try {
        const task_id = req.params.id;
        const task_data = req.body;

        //Check body data is empty
        if(!Object.keys(task_data).length) {
            throw new NotFoundError('No update information provided!')
        }

        //Check start_date & end_date in body data
        if(req.body.start_date && req.body.end_date) {
            const start_date = new Date(req.body.start_date).getTime();
            const end_date = new Date(req.body.end_date).getTime();

            if (start_date >= end_date) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'End date must be greater than start date'
                });
            }
        }

        const task_updated = await taskService.updateTask(task_id, task_data);

        if(!task_updated) {
            throw new NotFoundError(`Cannot find task with id ${task_id}!`);
        }

        res.status(200).send({
            status: 'Success',
            message: `Update task's information successfully!`,
            data: task_updated
        });
    } catch (error) {
        next(error);
    }
}

//Remove task
const removeTask = async (req, res, next) => {
    try {
        const task_id = req.params.id;

        const task_removed = await taskService.removeTask(task_id);
        if(!task_removed) {
            throw new NotFoundError(`Cannot find task with id ${task_id}!`);
        }

        res.status(200).send({
            status: 'Success',
            message: `Remove task with id ${task_id} successfully!`,
            data: task_removed
        });
    } catch (error) {
        next(error);
    }
}

const taskController = {
    addTask,
    getTasksByProject,
    getTasksByMember,
    getTasksByStatus,
    getTasksByTitle,
    updateTask,
    removeTask
};

module.exports = taskController;