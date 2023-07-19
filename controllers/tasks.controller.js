const mongoose = require('mongoose');

const Task = require('../models/tasks.model');
const Project = require('../models/projects.model');
const User = require('../models/users.model.js');

//Add a task 
const addTask = async (req, res) => {
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
        if(!mongoose.isValidObjectId(user_id)) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Invalid asignee value!'
            });
        }
        //Check existed member
        const user = await User.findById(user_id);
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
        //Add tasks
        const task = new Task({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            estimate_time: req.body.estimate_time,
            project: project._id,
            asignee: user._id
        })

        await task.save();

        res.status(200).send({
            status: 'Success',
            message: `Add task ${req.body.title} for member ${user.fullname} successfully!`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get tasks by project /tasks/project/:id/page/:page/get
const getTasksByProject = async (req, res) => {
    try {
        const project = req.project_data;
        const currentPage = req.params.page;

        let perPage = 5;

        const count = await Task.countDocuments({
            project: project._id
        });
        //Find tasks by project id
        const tasks = await Task.find({
            project: project._id
        }).populate('asignee', { _id: 1, fullname: 1, username: 1 })
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        res.status(200).send({
            status: 'Success',
            message: `Get tasks by project ${project._id} successfully!`,
            data: tasks,
            totalItems: count,
            itemsEachPage: perPage,
            currentPage: currentPage
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get tasks by member /tasks/project/:id/member/:member_id/page/:page/get
const getTasksByMember = async (req, res) => {
    try {
        const project = req.project_data;
        const user_id = req.params.member_id;
        const currentPage = req.params.page;

        //check existed member
        const user = await User.findById(user_id);
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
        let perPage = 5;

        const count = await Task.countDocuments({
            project: project._id,
            asignee: user._id
        });

        const tasks = await Task.find({
            project: project._id,
            asignee: user._id
        }).populate('asignee', { _id: 1, fullname: 1, username: 1 })
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        res.status(200).send({
            status: 'Success',
            message: `Get tasks by member ${user_id} of project ${project._id} successfully!`,
            data: tasks,
            totalItems: count,
            itemsEachPage: perPage,
            currentPage: currentPage
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get tasks by status /tasks/project/:id/task/status/:status/get
const getTasksByStatus = async (req, res) => {
    try {
        const project = req.project_data;
        const status = req.params.status;
        const currentPage = req.params.page;

        let perPage = 5;
        const count = await Task.countDocuments({
            project: project._id,
            status: status
        });

        const tasks = await Task.find({
            project: project._id,
            status: status
        }).populate('asignee', { _id: 1, username: 1, fullname: 1, email: 1 })
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        res.status(200).send({
            status: 'Success',
            message: `Get tasks by project ${project._id} with status ${status} successfully!`,
            data: tasks,
            totalItems: count,
            itemsEachPage: perPage,
            currentPage: currentPage
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }

}

//Get tasks by title /tasks/project/:id/title/:title/get
const getTasksByTitle = async (req, res) => {
    try {
        const project = req.project_data;
        const title = (req.params.title).trim();
        const currentPage = req.params.page;

        let perPage = 5;
        const count = await Task.countDocuments({
            title: new RegExp(title, 'i')
        });

        const tasks = await Task.find({
            title: new RegExp(title, 'i')
        })
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        res.status(200).send({
            status: 'Success',
            message: `Get tasks by project ${project._id} with ${title} successfully!`,
            data: tasks,
            totalItems: count,
            itemsEachPage: perPage,
            currentPage: currentPage
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Update task
const updateTask = async (req, res) => {
    try {
        const task_id = req.params.id;
        const task_data = req.body;

        if(!task_id) {
            return res.status(400).send({
                status: 'Failed',
                message: 'No project id provided!'
            })
        }

        //Check body data is empty
        if(!Object.keys(task_data).length) {
            return res.status(400).send({
                status: 'Failed',
                message: 'No update information provided!'
            });
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

        const task_updated = await Task.findByIdAndUpdate(task_id, task_data, {
            new: true, //Get updated data
        });

        if(!task_updated) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find task with id ${task_id}!`
            });
        }

        res.status(200).send({
            status: 'Success',
            message: `Update task's information successfully!`,
            data: task_updated
        });
        //Not yet: still check start_date && end_date
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Remove task
const removeTask = async (req, res) => {
    try {
        const task_id = req.params.id;

        const task_removed = await Task.findByIdAndRemove(task_id);
        if(!task_removed) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find task with id ${task_id}!`
            });
        }

        res.status(200).send({
            status: 'Success',
            message: `Remove task with id ${task_id} successfully!`,
            data: task_removed
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
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