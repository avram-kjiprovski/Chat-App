import Message from '../models/Message';
import User from '../models/User';
import Room from '@/models/Room';
import { decodeToken } from '@/middlewares/jwt';
import Logger from '@/logger/logger';
import { Request, Response, IMessage, IUser} from '../interfaces/';

// WEBSOCKETS API - SOCKETIO
export const writeMessageToDB = async (data):Promise<void> => {
    try {
        const message:IMessage = await Message.create({
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
    
        // return true;   // why am I returning boolean?
    } catch (error) {
        Logger.error('Write message to DB error: ', error);
        // return false;
    }
}

// REST API - EXPRESS
export const getMessages = async (req: Request, res: Response):Promise<Response> => {
    const decoded: Object | any = decodeToken(req.cookies.token);

    try {
        // check if user is really them
        const user:IUser = await User.findOne({
            username: decoded.username
        });

        if(user.username == decoded.username) {
            const room = await Room.findOne({
                _id: req.params.room_id
            });

            const messages: IMessage[] = await Message.find({
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