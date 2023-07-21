const Project = require('../models/projects.model');

let itemsEachPage = 2;

//Create project
const addProject = async (project_info) => {
    const project = new Project({
        title: project_info.title,
        description: project_info.description,
        content: project_info.content,
        status: project_info.status,
        progress: project_info.progress,
        start_date: project_info.start_date,
        end_date: project_info.end_date,
        owner: project_info.owner,
        members: project_info.members
    })
    await project.save();
};

//Get a project's information by id
const getProject = async (project_id) => {
    const project = await Project.findById(project_id);
    return project;
}

//Get my projects
const getMyProjects = async (user_id, currentPage) => {
    const count = await Project.countDocuments({
        owner: user_id
    });

    const my_projects = await Project.find({
        owner: user_id
    }, '-members -owner')
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: my_projects,
        totalItems: count,
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get my projects by status
const getMyProjectsByStatus = async (user_id, status, currentPage) => {
    const count = await Project.countDocuments({
        owner: user_id,
        status: status
    });

    const my_projects_status = await Project.find({
        owner: user_id,
        status: status
    }, '-members -owner')
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: my_projects_status,
        totalItems: count,
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get my projects by title
const getMyProjectsByTitle = async (user_id, title, currentPage) => {
    const count = await Project.countDocuments({
        owner: user_id,
        title:  new RegExp(title, 'i')
    });

    const my_projects_title = await Project.find({
        owner: user_id,
        title: new RegExp(title, 'i')
    }, '-members -owner')
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: my_projects_title,
        totalItems: count,
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get my shared projects
const getMySharedProjects = async (user_id, currentPage) => {
    const count = await Project.countDocuments(
        { 
            owner: {$ne: user_id},
            members: { $elemMatch: { member: user_id}}
        }
    );

    const my_shared_projects = await Project.find(
        { 
            owner: {$ne: user_id},
            members: { $elemMatch: { member: user_id}}},
        { 'members.$': 1, title: 1, description: 1, content: 1, status: 1, progress: 1, start_date: 1, end_date: 1, owner: 1 },
    ).populate('owner', 'fullname email')
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: my_shared_projects,
        totalItems: count,
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get my shared projects by status
const getMySharedProjectsByStatus = async (user_id, status, currentPage) => {
    const count = await Project.countDocuments({ 
        status: status,
        owner: {$ne: user_id},
        members: { $elemMatch: { member: user_id}}},
    );

    const my_shared_projects_status = await Project.find(
        { 
            status: status,
            owner: {$ne: user_id},
            members: { $elemMatch: { member: user_id}}},
        { 'members.$': 1, title: 1, description: 1, content: 1, status: 1, progress: 1, start_date: 1, end_date: 1, owner: 1 },
    ).populate('owner', 'fullname email')
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: my_shared_projects_status,
        totalItems: count,
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get my shared projects by title
const getMySharedProjectsByTitle = async (user_id, title, currentPage) => {
    const count = await Project.countDocuments({ 
        owner: {$ne: user_id},
        title: new RegExp(title, 'i'),
        members: { $elemMatch: { member: user_id}}},
    );

    const my_shared_projects_title = await Project.find(
        {
            owner: {$ne: user_id}, 
            title: new RegExp(title, 'i'),
            members: { $elemMatch: { member: user_id}}},
        { 'members.$': 1, title: 1, description: 1, content: 1, status: 1, progress: 1, start_date: 1, end_date: 1, owner: 1 },
    ).populate('owner', 'fullname email')
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: my_shared_projects_title,
        totalItems: count,
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get members of a project
const getMembers = async (project_id, currentPage) => {
    itemsEachPage = 5;
    const project_info = await getProject(project_id);
    const count = project_info.members.length;

    const project_members = await Project.findById(project_id, {members:{$slice: [itemsEachPage * (currentPage - 1), itemsEachPage]}})
    .populate('members.member', {
        username: 1,
        fullname: 1,
        email: 1,
        avatar: 1 
    });
    
    const result = {
        data: project_members.members,
        totalItems: count,
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Change member's permission
const changeMemberPermission = async (project_id, user_id, permission) => {
    const member_change_permission = await Project.findOneAndUpdate({
        _id: project_id,
        'members.member': user_id
    }, {
        $set: {
            'members.$.permission': permission
        }
    },{
        new: true,
        select: { "members": 1, "_id": 0 }
    }, {

    });
    const result = member_change_permission.members.filter(member => member.member == user_id)[0];
    return result;
};

//Remove a member
const removeMember = async (project_id, user_id) => {
    const member_removed = await Project.findByIdAndUpdate(project_id, {
        $pull: { 
                members: { member: user_id }
        }
    }, {
        new: true
    });
    const result = member_removed.members;
    return result;
};

//Remove project
const removeProject = async (project_id) => {
    const project_removed = await Project.findByIdAndDelete(project_id);
    return project_removed;
};

//Update project
const updateProject = async (project_id, data) => {
    const project_updated = await Project.findByIdAndUpdate(project_id, data, {
        new: true, //Get updated data
    });
    return project_updated;
};

const projectService = {
    addProject,
    getProject,
    getMyProjects,
    getMyProjectsByStatus,
    getMyProjectsByTitle,
    getMySharedProjects,
    getMySharedProjectsByStatus,
    getMySharedProjectsByTitle,
    getMembers,
    changeMemberPermission,
    removeMember,
    removeProject,
    updateProject
};

module.exports = projectService;