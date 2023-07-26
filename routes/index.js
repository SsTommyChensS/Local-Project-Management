const express = require('express');
const router = express.Router();

//Error handler middleware
const errorHandler = require('../middlewares/errorHandler');

const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const projectsRoutes = require('./projects.routes');
const tasksRoutes = require('./tasks.routes');
const commentsRoutes = require('./comments.routes');
const attachmentsRoutes = require('./attachments.routes');

router.use(authRoutes, usersRoutes, projectsRoutes, tasksRoutes, commentsRoutes, attachmentsRoutes);
//Apply error handler
router.use(errorHandler);

module.exports = router;