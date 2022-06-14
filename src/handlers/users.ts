import bcrypt from "bcrypt";
import User from "../models/User";
import { HttpStatusCode } from "./status_codes";
import {JWTService} from "@/middlewares/jwt";

export const loginUser = async (req, res, next) => {
  const userInfo = req.body;

  if (!userInfo.username || !userInfo.password) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "Missing username or password",
    });
  }

  try {
    const userInDB = await User.findOne({
      username: userInfo.username,
    });

    if (!userInDB)
      return res.status(HttpStatusCode.UNAUTHORIZED).json("User not found");

    const passwordComparison = await bcrypt.compare(
      userInfo.password,
      userInDB.password
    );

    if (passwordComparison) {
      const jwtService = new JWTService();
      const newToken = jwtService.createToken(userInfo.username);

      const userToSend = {
        username: userInDB.username,
        _id: userInDB._id,
      };

      return res
        .cookie("token", newToken, {
          httpOnly: true,
          maxAge: 10800000,
        })
        .status(HttpStatusCode.OK)
        .json(userToSend);
    } else {
      return res.status(HttpStatusCode.UNAUTHORIZED).json("Wrong password");
    }
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const createUser = async (req, res, next) => {
  const userInfo = req.body;

  if (!userInfo.username || userInfo.username.length < 6) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "Username must be at least 6 characters long",
    });
  }

  if (!userInfo.password || userInfo.password.length < 6) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    const existingUser = await User.findOne({
      username: userInfo.username,
    });

    if (existingUser)
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json("Username already exists");

    const encryptedPassword = await bcrypt.hash(
      userInfo.password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const newUser = {
      username: userInfo.username,
      password: encryptedPassword,
    };

    await User.create(newUser);
    return res.status(HttpStatusCode.CREATED).json("User created");
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(`Error: ${error}`);
  }
};

export const userJoinRoom = async (req, res, next) => {
  const { username, roomName } = req.body;

  try {
    const user = await User.findOne({
      username,
    });

    if (!user)
      return res.status(HttpStatusCode.UNAUTHORIZED).json("You do not exist.");

    const room = await user.rooms.find((room) => room.name === roomName);

    if (!room) {
      user.rooms.push({
        name: roomName,
        messages: [],
      });
    }

    await user.save();

    return res.status(HttpStatusCode.OK).json("User joined room");
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json("Handler -> userJoinRoom: \n", error);
  }
};
