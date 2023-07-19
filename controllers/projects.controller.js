const Project = require('../models/projects.model');
const User = require('../models/users.model');
const Task = require('../models/tasks.model');
const Comment = require('../models/comments.model');
const Attachment = require('../models/attachments.model');

const cloudinaryConfig = require('../configs/cloudinary');

const mongoose = require('mongoose');

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
        const user_project = await User.findById(user_id);
        //Add onwer to member field with permission full
        const owner_add_member = [{
            member: user_project._id,
            permission: 3
        }];
        const project = new Project({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            status: req.body.status,
            progress: req.body.progress,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            owner: user_project._id,
            members: owner_add_member
        })

        await project.save();
    
        res.status(200).send({
            status: 'Success',
            message: `Create project ${req.body.title} successfully!`
        });
        
    } catch (error) {
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
        
        let perPage = 2; 

        const my_projects = await Project.find({
            owner: user_id
        }, '-members -owner')
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        const count = await Project.countDocuments({
            owner: user_id
        });

        res.status(200).send({
            status: 'Success',
            message: 'Get my projects successfully!',
            data: my_projects,
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

//Get my shared projects 
const getMySharedProjects = async (req, res) => {
    try {
        const user_data = req.user;
        const currentPage = parseInt(req.params.page);
        
        let perPage = 2; 

        const user = await User.findById(user_data.id);

        const count = await Project.countDocuments(
            { members: { $elemMatch: { member: user._id}}},
        );

        const shared_projects = await Project.find(
            { members: { $elemMatch: { member: user._id}}},
            { 'members.$': 1, title: 1, description: 1, content: 1, status: 1, progress: 1, start_date: 1, end_date: 1, owner: 1 },
        ).populate('owner', 'fullname email')
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        res.status(200).send({
            status: 'Success',
            message: `Get my shared projects successfully!`,
            data: shared_projects,
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

//Get my shared projects by status
const getMySharedProjectsByStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const currentPage = parseInt(req.params.page);
        const user_data = req.user;
        
        let perPage = 2; 

        const user = await User.findById(user_data.id);

        const count = await Project.countDocuments({ 
                status: status,
                members: { $elemMatch: { member: user._id}}},
        );

        const shared_projects_status = await Project.find(
            { 
                status: status,
                members: { $elemMatch: { member: user._id}}},
            { 'members.$': 1, title: 1, description: 1, content: 1, status: 1, progress: 1, start_date: 1, end_date: 1, owner: 1 },
        ).populate('owner', 'fullname email')
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        res.status(200).send({
            status: 'Success',
            message: `Get my shared projects by status ${status} successfully!`,
            data: shared_projects_status,
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

//Get my projects by status 
const getMyProjectsByStatus = async (req, res) => {
    try {
        const user_id = req.user.id;
        const status = req.params.status;
        const currentPage = parseInt(req.params.page);
        
        let perPage = 2; 

        const count = await Project.countDocuments({
            owner: user_id,
            status: status
        });

        const my_projects = await Project.find({
            owner: user_id,
            status: status
        }, '-members -owner')
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        res.status(200).send({
            status: 'Success',
            message: `Get my projects with status ${status} successfully!`,
            data: my_projects,
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

//Get my projects by title
const getMyProjectsByTitle = async (req, res) => {
    try {
        const user_id = req.user.id;
        const title = (req.params.title).trim();
        const currentPage = parseInt(req.params.page);
        
        let perPage = 2; 

        const count = await Project.countDocuments({
            owner: user_id,
            title:  new RegExp(title, 'i')
        });

        const my_projects = await Project.find({
            owner: user_id,
            title: new RegExp(title, 'i')
        }, '-members -owner')
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        res.status(200).send({
            status: 'Success',
            message: `Get my projects with title ${title} successfully!`,
            data: my_projects,
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

//Get my shared projects by title
const getMySharedProjectsByTitle = async (req, res) => {
    try {
        const title = (req.params.title).trim();
        const currentPage = parseInt(req.params.page);
        
        let perPage = 2; 

        const user_data = req.user;
        const user = await User.findById(user_data.id);

        const count = await Project.countDocuments({ 
            title: new RegExp(title, 'i'),
            members: { $elemMatch: { member: user._id}}},
        );

        const shared_projects_title = await Project.find(
            { 
                title: new RegExp(title, 'i'),
                members: { $elemMatch: { member: user._id}}},
            { 'members.$': 1, title: 1, description: 1, content: 1, status: 1, progress: 1, start_date: 1, end_date: 1, owner: 1 },
        ).populate('owner', 'fullname email')
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);

        res.status(200).send({
            status: 'Success',
            message: `Get my shared projects by title ${title} successfully!`,
            data: shared_projects_title,
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

//Update a project
const updateProject = async(req, res) => {
    try {
        const project_id = req.project_data._id;
        const project_data = req.body;

        if(!project_id) {
            return res.status(400).send({
                status: 'Failed',
                message: 'No project id provided!'
            })
        }

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

        const project_updated = await Project.findByIdAndUpdate(project_id, project_data, {
            new: true, //Get updated data
        });

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

//Invite a member to project (Not yet - Must check user had already invited to project)
const inviteUserToProject = async (req, res) => {
    try {
        const project_id = req.project_data._id;
        const { user_code, permission } = req.body;

        //Check existed user
        const user_code_checked = await User.findOne({
            code: user_code,
            username: {
                $nin: req.user.username
            }
        });
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
        const member_added = await Project.findByIdAndUpdate(project_id, {
            $push: {
                members: member_add
            }
        }, { new: true });
    
        res.status(200).send({
            status: 'Success',
            message: `Invite user to project ${member_added.title} successfully!`,
            data: member_added.members
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

        let perPage = 5; 
        //1: [0,2], 2: [2, 2], 3: [4,2], 4: [6,2], 5: [8, 2]
        const project = await Project.findById(project_id, {members:{$slice: [perPage * (currentPage - 1), perPage]}})
                            .populate('members.member', {
                                username: 1,
                                fullname: 1,
                                email: 1,
                                avatar: 1 
                            });
        //Get members size
        const project_members = await Project.findById(project_id);
        const members_size = project_members.members.length;                       
        
        res.status(200).send({
            status: 'Success',
            message: `Get members of project ${project.title} successfully!`,
            data: project.members,
            totalItems: members_size,
            itemsEachPage: perPage,
            currentPage: currentPage 
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
        const user = await User.findById(user_id);
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
        const member_change_permission = await Project.findOneAndUpdate({
            _id: project_id,
            'members.member': user_id
        }, {
            $set: {
                'members.$.permission': permission
            }
        },{
            new: true
        })

        res.status(200).send({
            status: 'Success',
            message: `Change user's permisson of user ${user_id} successfully!`,
            data: member_change_permission.members,
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
        const user_id = req.params.user_id;
        
        //Check existed user
        if(!mongoose.isValidObjectId(user_id)) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Invalid user id value!'
            });
        }
        const user = await User.findById(user_id);
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
    
        const member_removed = await Project.findOneAndUpdate({ _id: project._id, }, {
            $pull: { 
                members: { member: user_id }
            }
        }, {
            new: true
        });
        
        res.status(200).send({
            status: 'Failed',
            message: `Remove a member with id ${user_id} successfully!`,
            data: member_removed.members
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
        await Task.deleteMany({ project: project_id });
        //Remove comments belong project
        await Comment.deleteMany({ project: project_id });
        //Remove attachments belong project
        const attachments = await Attachment.find({ project: project_id });
        attachments.map(async (attachment) => {
            await cloudinaryConfig.uploader.destroy(attachment.public_id)
        });
        await Attachment.deleteMany({ project: project_id });

        const project_removed = await Project.findByIdAndDelete(project_id);
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