const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    eventType: { type: String },
    eventDate: { type: Date },
    eventLocation: { type: String },
    message: { type: String, required: true },
    profession: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Contacted', 'Completed'], 
        default: 'Pending' 
    },
}, {
    timestamps: { createdAt: 'submittedAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);