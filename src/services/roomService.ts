import { IRoom, IUser } from "@/interfaces";
import User from "../models/User";
import Room from "../models/Room";
import Logger from "@/logger/logger";
import { HttpStatusCode } from "@/handlers/status_codes";
import { JWTService } from "@/middlewares/jwt";

export class RoomService {
  constructor() {}

  createRoom = async (token: string): Promise<IRoom[] | null> => {
    const jwtService = new JWTService();
    const decoded: Object | any = jwtService.decodeToken(token);

    try {
      const user: IUser = await User.findOne({
        username: decoded.username,
      });

      if (user.username != decoded.username) {
        return null;
      }

      let rooms = await Room.find({});

      const room = await Room.create({
        name: `Room ${rooms.length + 1}`,
        createdBy: user._id,
        messages: [],
        usersJoined: [user],
      });

      rooms.push(room);

      return rooms;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  };

  getRooms = async (token: string): Promise<IRoom[] | number> => {
    const jwtService = new JWTService();
    const decoded: Object | any = jwtService.decodeToken(token);

    try {
      const user: IUser = await User.findOne({
        username: decoded.username,
      });

      if (user.username != decoded.username) {
        return HttpStatusCode.UNAUTHORIZED;
      }

      const rooms = await Room.find({});

      if (rooms.length > 0) {
        // check if user is in any room
        const isMissing = rooms.find((room) => {
          return room.usersJoined.includes(user._id);
        });
        if (typeof isMissing == "undefined") {
          rooms[0].usersJoined.push(user);
          await rooms[0].save();
        }

        return rooms;
      }

      // if there are no rooms, generate a room
      const room: IRoom = await Room.create({
        // TODO: [] - find a better way to generate room names, ideally by user input
        name: `Room ${rooms.length + 1}`,
        createdBy: user._id,
        messages: [],
        usersJoined: [user],
      });

      rooms.push(room);

      return rooms;
    } catch (error) {
      Logger.error(error);
      return HttpStatusCode.INTERNAL_SERVER_ERROR;
    }
  };


  joinRoom = async (token, room_id):Promise<number> => {
    try {
      const user: IUser = await User.findOne({
        username: token.username
      })

      if(user.username != token.username){
        return HttpStatusCode.UNAUTHORIZED
      }

      const room = await Room.findOne({
        _id: room_id
      })

      if(room.usersJoined.includes(user._id)) {
        return HttpStatusCode.OK
      }

      room.usersJoined.push(user._id)
      await room.save();

      return HttpStatusCode.OK

    } catch (error) {
      return HttpStatusCode.INTERNAL_SERVER_ERROR
    }
  }
}
