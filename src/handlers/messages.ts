import Message from '../models/Message';
import User from '../models/User';
import Room from '@/models/Room';
import {io} from '../server'
import { decodeToken } from '@/middlewares/jwt';
import Logger from '@/logger/logger';

// WEBSOCKETS API - SOCKETIO
export const writeMessageToDB = async (data) => {

    try {
        // console.log('writeMessageToDB: ', data.content, data.sentBy, data.createdAt, data.room_id);
        
        const message = await Message.create({
            content: data.content,
            sentBy: data.sentBy,
            createdAt: data.createdAt,
            room_id: data.room_id
        });
    
        const room = await Room.findOne({
            _id: data.room_id
        })
    
        room.messages.push(message);
    
        await room.save();
    
        return true;   // why am I returning true?
    } catch (error) {
        Logger.error('Write message to DB error: ', error);
        return false;
    }

}

// REST API - EXPRESS
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