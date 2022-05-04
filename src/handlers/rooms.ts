import Room from '../models/Room';
import User from '../models/User';
import { decodeToken } from '../middlewares/jwt';

export const createRoom = async (req, res) => {

    const decoded: Object | any = decodeToken(req.cookies.token);

    const user = await User.findOne({
        username: decoded.username
    });

    let rooms = await Room.find({})

    const room = await Room.create({
        name: `Room ${rooms.length + 1}`,
        createdBy: user._id,
        messages: []
    });
    rooms = await Room.find({})

    return res.status(200).json(rooms);
}


export const getRooms = async (req, res) => {
    const decoded: Object | any = decodeToken(req.cookies.token);

    try {
        // check if user is really them
        const user = await User.findOne({
            username: decoded.username
        });

        if(user.username == decoded.username) {
            return res.status(200).json(await Room.find({}));
        }

        return res.status(401).json('Unauthorized');

    } catch (error) {
        return res.status(500).json('Server error.');    
    }
}

export const joinRoom = async (req, res) => {
    const decoded: Object | any = decodeToken(req.cookies.token);

    try {
        const user = await User.findOne({
            username: decoded.username
        });

        if(user.username != decoded.username) {
            return res.status(401).json('Unauthorized');
        }   

        const room = await Room.findOne({
            _id: req.params.room_id
        });

        room.users.push(user._id);
        await room.save();

        const rooms = await Room.find({});
        
        return res.status(200).json(rooms);
    } catch (error) {
        return res.status(500).json('Server error.');    
    }
}