import { debug } from 'console';
import Room from '../models/Room';
import User from '../models/User';

export const createRoom = async (room) => {
    const { name, createdBy, messages } = room;

    if (!name || !createdBy) {
        return `Missing room name or creator name`;
    }

    try {
        const existingUser = await User.findOne({
            username: createdBy,
        })

        if(!existingUser) return `User does not exist`;

        const existingRoom = await Room.findOne({
            name
        });

        if(!existingRoom) {
            const newRoom = new Room({
                name: name,
                messages: messages,
                createdBy: existingUser._id
            });

            await newRoom.save();

            return newRoom;
        }

        return existingRoom;
        
    } catch (error) {
        return `rooms handler: createRoom: \n${error}`;
    }

}

export const joinRoom = async (req, res, next) => {
    const { username, roomName } = req.body;

    if (!roomName || !username) {
        return res.status(400).json({
            message: 'Missing room name or username'
        });
    }

    try {
        // add this room to the user's rooms
        const user = await User.findOne({
            username
        });

        if (!user) return res.status(400).json('You do not exist.');

        

    } catch (error) {
        return res.status(500).json("rooms handler: joinRoom: \n", error);
    }
}