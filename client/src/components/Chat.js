import { useState, useContext, useEffect } from "react";
import { SERVER } from "./constants";
import { Button } from "@mui/material";
import { socket } from "./socket";
import { appDetailsContext } from "../App";

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [appDetails, setAppDetails] = useContext(appDetailsContext);
  const [messages, setMessages] = useState([]);

  useEffect( () => {
    if(appDetails && appDetails.rooms.find(room => room._id === appDetails.selectedRoom_id) != undefined){
      setMessages(
        appDetails.rooms.find(room => room._id === appDetails.selectedRoom_id).messages
      )
    }
  }, [appDetails]);

  const handleSendMessage = async () => {
    const data = {
      eventName: "message",
      room: appDetails.selectedRoom_id,
      message: message,
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
        {/* Od tuka mapping */}
        {
          // if messages is not empty then map through it
          messages.length > 0 ?
          messages.map(message => {
            return (
              <div className={`${message.sentBy === appDetails.user_id ? 'Chat-My-Message' : 'Chat-Message'} Message`}>
                <div className="Message-User">
                  <p>{message.content}</p>
                </div>
              </div>
              );
        }) : <p>No messages</p> }

        {/* <div className="Chat-Message Message">
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
        </div> */}

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
