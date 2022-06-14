import Logger from "@/logger/logger";
import { Request, Response, IMessage } from "../interfaces/";
import { HttpStatusCode } from "./status_codes";
import { MessageService } from "@/services/messageService";
import { JWTService } from "@/middlewares/jwt";

// REST API - EXPRESS
export const getMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const jwtService = new JWTService();
  const decoded: Object | any = jwtService.decodeToken(req.cookies.token);

  try {
    const messageService = new MessageService();
    const messages: IMessage[] | number = await messageService.getMessages(
      decoded,
      req.params.room_id
    );

    if (typeof messages == "undefined") {
      return res.status(HttpStatusCode.UNAUTHORIZED).json("Unauthorized");
    }

    return res.status(HttpStatusCode.OK).json(messages);
  } catch (error) {
    Logger.error("handler -> getMessages: ", error);
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json("Server error.");
  }
};
