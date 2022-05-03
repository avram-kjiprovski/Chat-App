import Room from '../models/Room';
import User from '../models/User';
import { decodeToken } from '../middlewares/jwt';
import { JwtPayload } from 'jsonwebtoken';

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
    return res.status(200).json(await Room.find({}));
}