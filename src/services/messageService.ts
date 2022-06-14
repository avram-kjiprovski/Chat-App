import { IMessage, IUser } from "@/interfaces/";
import Message from "@/models/Message";
import User from "@/models/User";
import Room from "@/models/Room";
import Logger from "@/logger/logger";

export class MessageService {
  constructor() {}

  writeMessage = async (data): Promise<void> => {
    try {
      const message: IMessage = await Message.create({
        content: data.content,
        sentBy: data.sentBy,
        createdAt: data.createdAt,
        room_id: data.room_id,
      });

      const room = await Room.findOne({
        _id: data.room_id,
      });

      room.messages.push(message);

      await room.save();
    } catch (error) {
      Logger.error("Write message to DB error: ", error);
    }
  };

  getMessages = async (
    decodedToken: object | any,
    room_id: string
  ): Promise<IMessage[] | number> => {
    try {
      const user: IUser = await User.findOne({
        username: decodedToken.username,
      });

      if (user.username == decodedToken.username) {
        const room = await Room.findOne({
          _id: room_id,
        });

        const messages: IMessage[] = await Message.find({
          _id: {
            $in: room.messages,
          },
        });

        // status OK
        return messages;
      }

      // status unauthurized
      return undefined;
    } catch (error) {
      Logger.error("messageService -> getMessages: ", error);
      return error;
    }
  };
}
