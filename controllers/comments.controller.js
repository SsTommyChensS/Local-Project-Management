const commentService = require('../services/comments.service');
const userService = require('../services/users.service');

const NotFoundError = require('../errors/NotFoundError');

//Comment at a project
const commentProject = async (req, res, next) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        const project_id = req.project_data._id;
        const content = req.body.content;

        await commentService.commentProject(project_id, user._id, content);

        res.status(200).send({
            status: 'Success',
            message: `Post comment at project ${project_id} successfully!`
        });
    } catch (error) {
        next(error);
    }
}

//Get comments by project
const getCommentsByProject = async (req, res, next) => {
    try {
        const project_id = req.project_data._id;
        const currentPage = req.params.page;

        const comments = await commentService.getCommentsByProject(project_id, currentPage);

        res.status(200).send({
            status: 'Success',
            message: `Get comments by project ${project_id} successfully!`,
            ...comments
        });
    } catch (error) {
        next(error);
    }
}

//Update comment
const updateComment = async (req, res, next) => {
    try {
        const comment_id = req.params.id;
        const content = req.body.content;
    
        const comment_updated = await commentService.updateComment(comment_id, content);
        if(!comment_updated) {
            throw new NotFoundError( `Cannot find comment with id ${comment_id}!`);
        }

        res.status(200).send({
            status: 'Success',
            message: `Update comment with id ${comment_id} successfully!`,
            data: comment_updated
        });    
    } catch (error) {
        next(error);
    }
}

//Remove comment
const removeComment = async (req, res, next) => {
    try {
        const comment_id = req.params.id;

        const comment_removed = await commentService.removeComment(comment_id);
        if(!comment_removed) {
            throw new NotFoundError(`Cannot find comment with id ${comment_id}!`);
        }

        res.status(200).send({
            status: 'Success',
            message: `Remove comment with id ${comment_id} successfully!`,
            data: comment_removed
        });
    } catch (error) {
        next(error);
    }
}

const commentController = {
    commentProject,
    getCommentsByProject,
    updateComment,
    removeComment
}

module.exports = commentController;