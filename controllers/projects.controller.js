const cloudinaryConfig = require('../configs/cloudinary');
const mongoose = require('mongoose');

const projectService = require('../services/projects.service');
const userService = require('../services/users.service');
const taskService = require('../services/tasks.service');
const commentService = require('../services/comments.service');
const attachmentService = require('../services/attachments.service');

// Create a project
const createProject = async (req, res) => {
    try {
        // Check end_date must be greater than start_date
        const start_date = new Date(req.body.start_date).getTime();
        const end_date = new Date(req.body.end_date).getTime();

        if(start_date >= end_date) {
            return res.status(400).send({
                status: 'Failed',
                message: 'End date must be greater than start date!'
            });
        }

        //Get user_id
        const user_id = req.user.id;
        const user_project = await userService.getUserById(user_id, 1);
        //Add onwer to member field with permission full
        const owner_add_member = [{
            member: user_project._id,
            permission: 3
        }];
        const project_info = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            status: req.body.status,
            progress: req.body.progress,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            owner: user_project._id,
            members: owner_add_member
        };

        await projectService.addProject(project_info);    
        res.status(200).send({
            status: 'Success',
            message: `Create project ${req.body.title} successfully!`
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get all my projects
const getMyProjects = async (req, res) => {
    try {
        const user_id = req.user.id;
        const currentPage = parseInt(req.params.page);

        const result = await projectService.getMyProjects(user_id, currentPage);
        res.status(200).send({
            status: 'Success',
            message: 'Get my projects successfully!',
            ...result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get my shared projects 
const getMySharedProjects = async (req, res) => {
    try {
        const user_data = req.user;
        const user_id = user_data.id;
        const currentPage = parseInt(req.params.page);
        
        const result = await projectService.getMySharedProjects(user_id, currentPage);
        res.status(200).send({
            status: 'Success',
            message: `Get my shared projects successfully!`,
            ...result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get my shared projects by status
const getMySharedProjectsByStatus = async (req, res) => {
    try {
        const user_data = req.user;
        const user_id = user_data.id;
        const status = req.params.status;
        const currentPage = parseInt(req.params.page);

        const result = await projectService.getMySharedProjectsByStatus(user_id, status, currentPage);
        res.status(200).send({
            status: 'Success',
            message: `Get my shared projects by status ${status} successfully!`,
            ...result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get my projects by status 
const getMyProjectsByStatus = async (req, res) => {
    try {
        const user_id = req.user.id;
        const status = req.params.status;
        const currentPage = parseInt(req.params.page);
        
        const result = await projectService.getMyProjectsByStatus(user_id, status, currentPage);
        res.status(200).send({
            status: 'Success',
            message: `Get my projects with status ${status} successfully!`,
            ...result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get my projects by title
const getMyProjectsByTitle = async (req, res) => {
    try {
        const user_id = req.user.id;
        const title = (req.params.title).trim();
        const currentPage = parseInt(req.params.page);

        const result = await projectService.getMyProjectsByTitle(user_id, title, currentPage);
        res.status(200).send({
            status: 'Success',
            message: `Get my projects with title ${title} successfully!`,
            ...result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get my shared projects by title
const getMySharedProjectsByTitle = async (req, res) => {
    try {
        const user_id = req.user.id;
        const title = (req.params.title).trim();
        const currentPage = parseInt(req.params.page);
        
        const result = await projectService.getMySharedProjectsByTitle(user_id, title, currentPage); 
        res.status(200).send({
            status: 'Success',
            message: `Get my shared projects by title ${title} successfully!`,
            ...result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Update a project
const updateProject = async(req, res) => {
    try {
        const project_id = req.project_data._id;
        const project_data = req.body;

        //Check body data is empty
        if(!Object.keys(project_data).length) {
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

        const project_updated = await projectService.updateProject(project_id, project_data);
        res.status(200).send({
            status: 'Success',
            message: `Update project's information successfully!`,
            data: project_updated
        });
        //Not yet: still check start_date && end_date
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Invite a member to project 
const inviteUserToProject = async (req, res) => {
    try {
        const project_id = req.project_data._id;
        const { user_code, permission } = req.body;

        //Check existed user
        const user_code_condition = {
            code: user_code,
            username: {
                $nin: req.user.username
            }
        };
        const user_code_checked = await userService.getUserByCondition(user_code_condition);
        if(!user_code_checked) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find user with code ${user_code}`
            });
        }
    
        //Check the user has already been invited 
        const list_members = req.project_data.members;
        const user_id = user_code_checked._id.toString();

        const user_check_invited = list_members.filter(item => item.member == user_id);
        if(user_check_invited.length != 0) {
            return res.status(400).send({
                status: 'Failed',
                message: 'This user had already been invited!'
            });
        }
 
        //Update project member fields - Invite a member to a project
        const member_add = {
            member: user_code_checked._id,
            permission: permission
        };
        const member_added = await projectService.inviteUserToProject(project_id, member_add);
    
        res.status(200).send({
            status: 'Success',
            message: `Invite user to project ${member_added.title} successfully!`,
            data: member_add
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get members of a project
const getMembers = async (req, res) => {
    try {
        const project_id = req.project_data._id;
        const currentPage = parseInt(req.params.page);
        const project_info = await projectService.getProject(project_id);

        const result = await projectService.getMembers(project_id, currentPage);        
        res.status(200).send({
            status: 'Success',
            message: `Get members of project ${project_info.title} successfully!`,
            ...result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Change member's permission
const changeMemberPermission = async (req, res) => {
    try {
        const project_id = req.project_data._id;
        const { user_id, permission } = req.body;

        //Check existed user
        if(!mongoose.isValidObjectId(user_id)) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Invalid user id value!'
            });
        }
        const user = await userService.getUserById(user_id, 2);
        if(!user) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find user with id ${user_id}`
            });
        }

        //Check member existed in a project
        const project_members = req.project_data.members;
        if(project_members.length == 0) {
            return res.status(400).send({
                status: 'Failed',
                message: 'This project has no members!'
            })
        }
        
        const member_invited = project_members.filter(item => item.member == user_id);
        if(member_invited.length == 0) {
            return res.status(400).send({
                status: 'Failed',
                message: 'This user is not a member of the project!'
            });
        }

        //Update user's permisson of member 
        const result = await projectService.changeMemberPermission(project_id, user_id, permission);
        res.status(200).send({
            status: 'Success',
            message: `Change user's permisson of user ${user_id} successfully!`,
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Remove a member out of a project
const removeMember = async (req, res) => {
    try {
        const project = req.project_data;
        const project_id = project._id;
        const user_id = req.params.user_id;
        
        //Check existed user
        if(!mongoose.isValidObjectId(user_id)) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Invalid user id value!'
            });
        }
        const user = await userService.getUserById(user_id, 2);
        if(!user) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find user with id ${user_id}`
            });
        }
    
        //Check member existed in a project
        const project_members = project.members;
        if(project_members.length == 0) {
            return res.status(400).send({
                status: 'Failed',
                message: 'This project has no members!'
            })
        }
    
        const member_invited = project_members.filter(item => item.member == user_id);
        if(member_invited.length == 0) {
            return res.status(400).send({
                status: 'Failed',
                message: 'This user is not a member of the project!'
            });
        }

        const result = await projectService.removeMember(project_id, user_id);
        res.status(200).send({
            status: 'Failed',
            message: `Remove a member with id ${user_id} successfully!`,
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Remove a project
const removeProject = async (req, res) => {
    try {
        const project_id = req.params.id;

        //Remove tasks belong project
        await taskService.removeTasksByProject(project_id);
        //Remove comments belong project
        await commentService.removeCommentsByProject(project_id);
        //Remove attachments belong project
        const attachments = await attachmentService.getAttachmentsBy({ project: project_id })
        attachments.map(async (attachment) => {
            await cloudinaryConfig.uploader.destroy(attachment.public_id)
        });
        await attachmentService.removeAttachmentsByProject(project_id);

        const project_removed = await projectService.removeProject(project_id);
        res.status(200).send({
            status: 'Success',
            message: `Remove the project with id ${project_id} successfully!`,
            data: project_removed
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

const projectController = {
    createProject,
    getMyProjects,
    getMySharedProjects,
    getMyProjectsByStatus,
    getMyProjectsByTitle,
    getMySharedProjectsByStatus,
    getMySharedProjectsByTitle,
    updateProject,
    inviteUserToProject,
    getMembers,
    changeMemberPermission,
    removeMember,
    removeProject,
};

module.exports = projectController;