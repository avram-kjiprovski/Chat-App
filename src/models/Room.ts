import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
        name: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }],
        usersJoined: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    });

const Room = mongoose.model('rooms', roomSchema);

export default Room;