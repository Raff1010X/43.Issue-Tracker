const mongoose = require('mongoose');

//+ Schema for issue model
const issueSchema = new mongoose.Schema(
    {
        issue_title: {
            type: String,
            required: [true, 'A issue must have a title'],
        },
        issue_text: {
            type: String,
            required: [true, 'A issue must have a description'],
        },
        created_on: { type: Date, default: new Date() },
        updated_on: { type: Date, default: new Date() },
        created_by: {
            type: String,
            required: [true, 'A issue must have an author'],
        },
        assigned_to: { type: String, default: '' },
        open: { type: Boolean, default: true },
        status_text: { type: String, default: '' },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model('Issue', issueSchema);
