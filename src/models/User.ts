import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        username: String,
        password: String,
        rooms: Array
    });

const User = mongoose.model('users', userSchema);

export default User;