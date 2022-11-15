const mongoose = require('mongoose');

//+ Schema for issue model
const issueSchema = new mongoose.Schema(
    {
        issue_title: {
            type: String,
            required: [true, 'required field(s) missing'],
        },
        issue_text: {
            type: String,
            required: [true, 'required field(s) missing'],
        },
        created_on: { type: Date, default: new Date() },
        updated_on: { type: Date, default: new Date() },
        created_by: {
            type: String,
            required: [true, 'required field(s) missing'],
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
