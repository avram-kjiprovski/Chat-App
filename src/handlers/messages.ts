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
            createdAt: new Date()
        });

        await message.save();
    
        const room = await Room.findOne({
            _id: data.room
        })
    
        room.messages.push(message);
    
        await room.save();
    
        return true;   
    } catch (error) {
        return error
    }

}