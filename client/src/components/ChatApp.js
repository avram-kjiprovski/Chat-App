import { useState, useEffect, useContext } from "react";
import { appDetailsContext } from "../App";
import { socket } from "./socket";
import { SERVER } from "./constants";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {v4} from 'uuid';



export const ChatApp = () => {
  // Context
  const [appDetails, setAppDetails] = useContext(appDetailsContext);

  // Navigation
  const navigate = useNavigate();

  // State
  const [message, setMessage] = useState("");

  // on first render, get rooms
  useEffect(() => {
    if(appDetails._id === '' || appDetails.username === ''){
      navigate('/')
    }
    getMessages(appDetails.selectedRoom_id); // I want this only to execute on first load
    // getRooms();
    // setLocal();
  }, []);

  useEffect(() => {
    
  }, [appDetails]);

  // SOCKETIO
  // CLIENT
  socket.on("connect", () => {
    // send socket request to get room data
    socket.emit("getRooms", (data) => {
      console.log("socket connect-getRooms: ", data);
    });

    socket.on("update", async (message) => {
      console.log('Socket update received');
      // console.log("socket connect-update", message);
      await handleMessageUpdate(message);
    });

    socket.on("message", (data) => {
      console.log("socket connect-message", data);
    });
  });

  const handleMessageUpdate = async (message) => {
    message['_id'] = v4();
    const newMessages = appDetails.messages
    newMessages.push(message)

    setAppDetails({
      ...appDetails,
      messages: newMessages
    })
  }

  const getMessages = async (room_id) => {
    const response = await fetch(`${SERVER}/rooms/${room_id}/messages`, {
      method: "GET",
      withcredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseMessages = await response.json();

    if (response.status === 200) {
      await setAppDetails({
        ...appDetails,
        messages: responseMessages,
      });

      socket.emit("joinRoom", appDetails.selectedRoom_id);
    }
  };

  const handleSelectRoom = async (room_id) => {
    // select room is selecting regardless if rooom is joined or not
    // [] - first check if room is joined, if true, select it

    const response = await fetch(`${SERVER}/rooms/${room_id}/messages`, {
      method: "GET",
      withcredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const roomMessages = await response.json();

    setAppDetails({
      ...appDetails,
      selectedRoom_id: room_id,
      messages: roomMessages,
    });
  };

  const handleCreateRoom = async () => {
    const res = await fetch(`${SERVER}/createRoom`, {
      method: "GET",
      withcredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const rooms = await res.json();

    setAppDetails({
      ...appDetails,
      rooms: rooms,
    });
  };

  // [] - fix whatever issue with join room!
  const handleJoinRoom = async (room_id) => {
    const res = await fetch(`${SERVER}/rooms/${room_id}/join`, {
      method: "GET",
      withcredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const room = await res.json();

    if (res.status === 200) {

      setAppDetails({
        ...appDetails,
        selectedRoom_id: room._id
      });
    }
  };

  const handleSendMessage = async () => {
    const data = {
      'eventName': "message",
      room_id: appDetails.selectedRoom_id,
      content: message,
      sentBy: appDetails.user_id,
    };
    await socket.emit("message", data);
    setMessage("");

    data['_id'] = v4()
    const newAppDetails = appDetails
    newAppDetails.messages.push(data)

    setAppDetails(newAppDetails);
  };

  return (
    <div className="Chat-Container">
      {/* <Rooms /> */}

      <div className="Rooms-Container">
        <div className="Title">
          <h3>Rooms</h3>
        </div>
        <div className="Rooms">
          {appDetails.rooms &&
            appDetails.rooms.map((room, index) => {
              return (
                <div
                  className={`Room ${
                    appDetails.selectedRoom_id === room._id ? "selected" : ""
                  }`}
                  key={room._id}
                  onClick={() => {
                    handleSelectRoom(room._id);
                  }}
                >
                  <p>{room.name}</p>
                  {room.usersJoined.includes(appDetails.user_id) ? (
                    ""
                  ) : (
                    <button
                      onClick={() => {
                        handleJoinRoom(room._id);
                      }}
                    >
                      Join
                    </button>
                  )}
                </div>
              );
            })}
          <div className="Create-New-Room">
            <Button
              fullWidth
              color="primary"
              onClick={() => {
                handleCreateRoom();
              }}
            >
              Create new Room
            </Button>
          </div>
        </div>
      </div>

      {/* <Chat /> */}
      <div className="Chat-Box">
        <div className="Title">
          <h3>Chat</h3>
        </div>

        <div className="Chat-Messages">
          {/* Od tuka mapping */}
          {appDetails.messages ? (
            appDetails.messages.map((message, index) => {
              return (
                <div
                  key={message._id}
                  className={`${
                    message.sentBy === appDetails.user_id
                      ? "Chat-My-Message"
                      : "Chat-Message"
                  } Message`}
                >
                  <div className="Message-User">
                    <p>{message.content}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No messages</p>
          )}

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
    </div>
  );
};
