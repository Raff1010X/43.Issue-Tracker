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
        toObject: { virtuals: true },
    }
);

issueSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret.id;
    },
});

// module.exports = mongoose.model('Issue', issueSchema);
module.exports = issueSchema;
