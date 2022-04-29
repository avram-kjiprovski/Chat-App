import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        rooms: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }]
    });

const User = mongoose.model('users', userSchema);

export default User;