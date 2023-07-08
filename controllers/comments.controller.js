const Comment = require('../models/comments.model');
const User = require('../models/users.model');
const mongoose = require('mongoose');

//Comment at a project
const commentProject = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const comment = new Comment({
            content: req.body.content,
            user: user._id,
            project: req.project_data._id,
            commentAt: new Date()
        })

        await comment.save();

        res.status(200).send({
            status: 'Success',
            message: `Post comment at project ${req.project_data._id} successfully!`
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get comments by project
const getCommentsByProject = async (req, res) => {
    try {
        const project_id = req.project_data._id;
        const currentPage = req.params.page;

        let perPage = 5;

        const count = await Comment.countDocuments({
            project: project_id
        });

        const comments = await Comment.find({
            project: project_id
        }).populate('user', 'fullname email').sort({
            commentAt: -1
        })
        .skip((perPage * currentPage) - perPage)
        .limit(perPage); 

        res.status(200).send({
            status: 'Success',
            message: `Get comments by project ${project_id} successfully!`,
            data: comments,
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

//Update comment
const updateComment = async (req, res) => {
    try {
        const comment_id = req.params.id;
        const content = req.body.content;
    
        if(!mongoose.isValidObjectId(comment_id)) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Invalid comment id value!'
            });
        }
    
        const comment_updated = await Comment.findByIdAndUpdate(comment_id, {
            content: content,
            commentAt: new Date()
        }, {
            new: true
        });
    
        if(!comment_updated) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find comment with id ${comment_id}!`
            });
        }
    
        res.status(200).send({
            status: 'Success',
            message: `Update comment with id ${comment_id} successfully!`,
            data: comment_updated
        });    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Remove comment
const removeComment = async (req, res) => {
    try {
        const comment_id = req.params.id;

        if(!mongoose.isValidObjectId(comment_id)) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Invalid comment id value!'
            });
        }

        const comment_removed = await Comment.findByIdAndRemove(comment_id);

        if(!comment_removed) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find comment with id ${comment_id}!`
            });
        }

        res.status(200).send({
            status: 'Success',
            message: `Remove comment with id ${comment_id} successfully!`,
            data: comment_removed
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

const commentController = {
    commentProject,
    getCommentsByProject,
    updateComment,
    removeComment
}

module.exports = commentController;