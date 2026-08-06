import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'EVENT_ALERT' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 2592000 }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
export { Notification };