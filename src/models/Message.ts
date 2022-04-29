import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
        content: String,
        sentBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

const Message = mongoose.model('message', messageSchema);

export default Message;