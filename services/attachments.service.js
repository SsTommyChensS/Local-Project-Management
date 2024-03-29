const Attachment = require('../models/attachments.model');

const itemsEachPage = 5;

//Add attachment
const addAttachment = async (attachment_info) => {
    const attachment = new Attachment({
        name: attachment_info.name,
        type: attachment_info.type,
        size: attachment_info.size,
        uploadAt: attachment_info.uploadAt,
        public_id: attachment_info.public_id,
        url: attachment_info.url,
        project: attachment_info.project
    })
    await attachment.save();    
};

//Get attachments by project
const getAttachmentsByProject = async (project_id, currentPage) => {
    const count = await Attachment.countDocuments({
        project: project_id
    });

    const attachments = await Attachment.find({
        project: project_id
    }).sort({
        uploadAt: -1
    })
    .skip((itemsEachPage * currentPage) - itemsEachPage)
    .limit(itemsEachPage);

    const result = {
        data: attachments,
        totalItems: count,
        itemsEachPage: itemsEachPage,
        currentPage: currentPage
    };
    return result;
};

//Get attachments by other conidtion
const getAttachmentsBy = async (condition) => {
    const attachments = await Attachment.find(condition);
    return attachments;
}

//Remove attachment
const removeAttachment = async (attachment_id) => {
    const attachment_removed = await Attachment.findByIdAndRemove(attachment_id);
    return attachment_removed;
};

//Remove attachments by project
const removeAttachmentsByProject = async (project_id) => {
    await Attachment.deleteMany({ project: project_id });
};

const attachmentService = {
    addAttachment,
    getAttachmentsBy,
    getAttachmentsByProject,
    removeAttachment,
    removeAttachmentsByProject
}

module.exports = attachmentService;