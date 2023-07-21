const Comment = require('../models/comments.model');

//Set comment items per page
const itemsEachPage = 5;

//Comment at a project
const commentProject = async (project_id, user_id, content) => {
    const comment = new Comment({
        content: content,
        user: user_id,
        project: project_id,
        commentAt: new Date()
    });
    await comment.save();
}

//Get comments by project
const getCommentsByProject = async (project_id, currentPage) => {
    const count = await Comment.countDocuments({
        project: project_id
    });

    const comments = await Comment.find({
        project: project_id
    }).populate('user', 'fullname email').sort({
        commentAt: -1
    })
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage); 

    const result = {
        data: comments,
        totalItems: count,
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    }
    return result;
};

//Update comment
const updateComment = async (comment_id, content) => {
    const comment_updated = await Comment.findByIdAndUpdate(comment_id, {
        content: content,
        commentAt: new Date()
    }, {
        new: true
    });
    return comment_updated;
}

//Remove comment
const removeComment = async (comment_id) => {
    const comment_removed = await Comment.findByIdAndRemove(comment_id);
    return comment_removed;
}

//Remove comments by project
const removeCommentsByProject = async (project_id) => {
    await Comment.deleteMany({ project: project_id });
};

const commentService = {
    commentProject,
    getCommentsByProject,
    updateComment,
    removeComment,
    removeCommentsByProject
};

module.exports = commentService;