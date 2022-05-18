import Room from "../models/Room";
import User from "../models/User";
import Message from "../models/Message";
import { decodeToken } from "../middlewares/jwt";
import Logger from "@/logger/logger";

export const createRoom = async (req, res) => {
  const decoded: Object | any = decodeToken(req.cookies.token);

  const user = await User.findOne({
    username: decoded.username,
  });

  let rooms = await Room.find({});

  const room = await Room.create({
    name: `Room ${rooms.length + 1}`, // ne gi broi sam, mongo ima funkcija za count na elementi, zemi go posledniot i dodaj 1
    createdBy: user._id,
    messages: [],
    usersJoined: [user],
  });
  rooms = await Room.find({});

  return res.status(200).json(rooms);
};

export const getRooms = async (req, res) => {
  const decoded: Object | any = decodeToken(req.cookies.token);

  try {
    // check if user is really them
    const user = await User.findOne({
      username: decoded.username,
    });

    // check user validity
    if (user.username == decoded.username) {
      const rooms = await Room.find({});
    
      // check and proceed if there are rooms
      if (rooms.length > 0) {

        // check if user is in any room
        const isMissing = rooms.find((room) => {
            return room.usersJoined.includes(user._id);
        });
        if(typeof(isMissing) == 'undefined') {
            rooms[0].usersJoined.push(user);
            await rooms[0].save();
        }

        return res.status(200).json(rooms);
      }

      // if no rooms, create one
      const room = await Room.create({
        name: `Room ${rooms.length + 1}`, // TODO: [] - find a better way to generate names, ideally by user input
        createdBy: user._id,
        messages: [],
        usersJoined: [user],
      });

      rooms.push(room);

      return res.status(200).json(rooms);
    }

    return res.status(401).json("Unauthorized");
  } catch (error) {
    return res.status(500).json("Server error.");
  }
};

export const joinRoom = async (req, res) => {
  const decoded: Object | any = decodeToken(req.cookies.token);
  const room_id = req.params.room_id;

  try {
    const user = await User.findOne({
      username: decoded.username,
    });

    if (user.username != decoded.username) {
      return res.status(401).json("Unauthorized");
    }

    const room = await Room.findOne({
      _id: room_id,
    });

    if (room.usersJoined.includes(user._id)) {
      return res.status(200).json(room);
    }

    room.usersJoined.push(user._id);
    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    return res.status(500).json("Server error.");
  }
};
