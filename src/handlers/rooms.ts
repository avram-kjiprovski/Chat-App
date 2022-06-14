import Room from "../models/Room";
import User from "../models/User";
import Logger from "@/logger/logger";
import { Request, Response, IUser } from "../interfaces/";
import { HttpStatusCode } from "./status_codes";

import { RoomService } from "@/services/roomService";
import { isArray } from "lodash";

import { JWTService } from "@/middlewares/jwt";

export const createRoom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const roomService = new RoomService();
    const rooms = await roomService.createRoom(req.cookies.token);
    if (typeof rooms !== null) {
      return res.status(HttpStatusCode.OK).json(rooms);
    }

    return res.status(HttpStatusCode.NOT_FOUND).json("Room not found");
  } catch (error) {
    Logger.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const getRooms = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const roomService = new RoomService();
    const rooms = await roomService.getRooms(req.cookies.token);

    if (isArray(rooms)) {
      return res.status(HttpStatusCode.OK).json(rooms);
    } else if (rooms == HttpStatusCode.UNAUTHORIZED) {
      res.status(HttpStatusCode.UNAUTHORIZED).json("Unauthorized!");
    }
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json("Server error!");
  } catch (error) {
    Logger.error(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const joinRoom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const room_id: string = req.params.room_id;
  const jwtService = new JWTService();
  const decoded: Object | any = jwtService.decodeToken(req.cookies.token);

  try {
    const user: IUser = await User.findOne({
      username: decoded.username,
    });

    if (user.username != decoded.username) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json("Unauthorized");
    }

    const room = await Room.findOne({
      _id: room_id,
    });

    if (room.usersJoined.includes(user._id)) {
      return res.status(HttpStatusCode.OK).json(room);
    }

    room.usersJoined.push(user._id);
    await room.save();

    return res.status(HttpStatusCode.OK).json(room);
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json("Server error.");
  }
};
