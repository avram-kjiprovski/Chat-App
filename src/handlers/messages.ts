import Message from '../models/Message';
import User from '../models/User';
import Room from '@/models/Room';
import {io} from '../server'
import { decodeToken } from '@/middlewares/jwt';

export const writeMessageToDB = async (data) => {
    // const data = {
    //     eventName: "message",
    //     room: room_id,
    //     message: message,
    //     _id: user_id,
    //   };

    try { // let's hope this works
    
        const message = new Message({
            content: data.message,
            sentBy: data._id,
            createdAt: new Date(),
            room_id: data.room
        });

        await message.save();
    
        const room = await Room.findOne({
            _id: data.room
        })
    
        room.messages.push(message);
    
        await room.save();
    
        return true;   // why am I returning true?
    } catch (error) {
        return error
    }

}

export const getMessages = async (req, res) => {
    const decoded: Object | any = decodeToken(req.cookies.token);

    try {
        // check if user is really them
        const user = await User.findOne({
            username: decoded.username
        });

        if(user.username == decoded.username) {
            const room = await Room.findOne({
                _id: req.params.room_id
            });

            const messages = await Message.find({
                _id: {
                    $in: room.messages
                }
            });

            return res.status(200).json(messages);
        }

        return res.status(401).json('Unauthorized');

    } catch (error) {
        return res.status(500).json('Server error.');
    }
}