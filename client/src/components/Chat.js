import { useState, useContext } from "react";
import { SERVER } from "./constants";
import { Button } from "@mui/material";
import { socket } from "./socket";
import { appDetailsContext } from "../App";

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [appDetails, setAppDetails] = useContext(appDetailsContext);
  
  const handleSendMessage = async () => {

    const data = {
      "eventName": "message",
      room: appDetails.selectedRoom_id,
      message: message,
      // _id: JSON.parse(localStorage.getItem("userDetails"))._id,
      _id: appDetails.user_id,
    };

    socket.emit("message", data);
    setMessage("");

  };

  return (
    <div className="Chat-Box">
      <div className="Title">
        <h3>Chat</h3>
      </div>

      <div className="Chat-Messages">
        <div className="Chat-Message Message">
          <p className="timestamp">
            <sub>11:32</sub>
          </p>
          <p>Yo, wassup!</p>
        </div>

        <div className="Chat-My-Message Message">
          <p className="timestamp">
            <sub>11:32</sub>
          </p>
          <p>I've been expecting you!</p>
        </div>

        <div className="Chat-Message Message">
          <p className="timestamp">
            <sub>11:32</sub>
          </p>
          <p>Who... Who are you?!</p>
        </div>

        <div className="Chat-New-Message">
          <input
            placeholder="Your text here..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          ></input>
          <Button
            variant="outlined"
            onClick={() => {
              handleSendMessage();
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
