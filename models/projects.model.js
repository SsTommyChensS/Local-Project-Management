const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: String,
    description: String,
    content: String,
    status: { type: Number, default: 1 },
    progress: Number,
    start_date: Date,
    end_date: Date,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        _id: false,
        member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        permission: { type: Number }
    }]
    }, {
    timestamps: true //createdAt && updatedAt    
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
