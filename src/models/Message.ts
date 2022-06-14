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
        },
        room_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    });

const Message = mongoose.model('message', messageSchema);

export default Message;