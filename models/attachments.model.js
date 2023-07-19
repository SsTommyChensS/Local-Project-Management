const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
    name: String,
    type: String,
    size: Number,
    uploadAt: Date,
    public_id: String,
    url: String,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }
});

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;