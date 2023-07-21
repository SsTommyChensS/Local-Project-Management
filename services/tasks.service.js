const Task = require('../models/tasks.model');

const itemsEachPage = 5;

//Add task
const addTask = async (task_info) => {
    const task = new Task({
        title: task_info.title,
        content: task_info.content,
        status: task_info.status,
        start_date: task_info.start_date,
        end_date: task_info.end_date,
        estimate_time: task_info.estimate_time,
        project: task_info.project,
        asignee: task_info.asignee
    });
    await task.save();
};

//Get tasks by project
const getTasksByProject = async (project_id, currentPage) => {
    const count = await Task.countDocuments({
        project: project_id
    });

    const tasks = await Task.find({
            project: project_id
        }).populate('asignee', { _id: 1, fullname: 1, username: 1 })
        .skip((itemsEachPage * currentPage) - itemsEachPage)
        .limit(itemsEachPage);
    
    const result = {
        data: tasks,
        totalItems: count, 
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get tasks by member
const getTasksByMember = async (project_id, member_id, currentPage) => {
    const count = await Task.countDocuments({
        project: project_id,
        asignee: member_id
    });

    const tasks = await Task.find({
        project: project_id,
        asignee: member_id
    }).populate('asignee', { _id: 1, fullname: 1, username: 1 })
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: tasks,
        totalItems: count, 
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get tasks by status
const getTasksByStatus = async (project_id, status, currentPage) => {
    const count = await Task.countDocuments({
        project: project_id,
        status: status
    });

    const tasks = await Task.find({
        project: project_id,
        status: status
    }).populate('asignee', { _id: 1, username: 1, fullname: 1, email: 1 })
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: tasks,
        totalItems: count, 
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get tasks by title
const getTasksByTitle = async (project_id, title, currentPage) => {
    const count = await Task.countDocuments({
        title: new RegExp(title, 'i')
    });

    const tasks = await Task.find({
        title: new RegExp(title, 'i')
    })
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: tasks,
        totalItems: count, 
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Update task
const updateTask = async (task_id, task_data) => {
    const task_updated = await Task.findByIdAndUpdate(task_id, task_data, {
        new: true, //Get updated data
    });
    return task_updated;
};

//Remove task
const removeTask = async (task_id) => {
    const task_removed = await Task.findByIdAndRemove(task_id);
    return task_removed;
};

//Remove tasks by project
const removeTasksByProject = async (project_id) => {
    await Task.deleteMany({ project: project_id });
};

const taskService = {
    addTask,
    getTasksByProject,
    getTasksByMember,
    getTasksByStatus,
    getTasksByTitle,
    updateTask,
    removeTask,
    removeTasksByProject
};

module.exports = taskService;