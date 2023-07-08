const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: String,
    content: String,
    status: { type: Number, default: 1 },
    start_date: Date,
    end_date: Date,
    estimate_time: Number,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    asignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;