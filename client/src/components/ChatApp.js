import { Rooms } from "./Rooms";
import { Chat } from "./Chat";
import { useState, useEffect, useContext } from "react";
import { appDetailsContext } from "../App";
import { socket } from "./socket";
import { SERVER } from "./constants";

export const ChatApp = () => {
  // const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [appDetails, setAppDetails] = useContext(appDetailsContext);
  // fetch user rooms
  const getRooms = async () => {
    const res = await fetch(`${SERVER}/rooms`, {
      method: "GET",
      withcredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    await localStorage.setItem("rooms", JSON.stringify(data));
    await localStorage.setItem("selectedRoom", data[0]._id);
    
  };

  useEffect(() => {
    getRooms();
    if (appDetails.username === "" || appDetails.selectedRoom_id === "") {
      setAppDetails({
        username: JSON.parse(localStorage.getItem("userDetails")).username,
        user_id: JSON.parse(localStorage.getItem("userDetails"))._id,
        selectedRoom_id: (JSON.parse(localStorage.getItem("rooms"))[0]._id || ""),
        rooms: JSON.parse(localStorage.getItem("rooms")),
      });
    }
    console.log("ChatApp: ", appDetails);
  }, [appDetails]);

      socket.on("update", (msg) => {
        console.log(msg);
      });

  if (appDetails.username != "") {
    
    socket.on("connect", () => {
      // send socket request to get room data
      socket.emit("getRooms", (data) => {
        console.log("socket getRooms: ", data);
      });
    });
    
    socket.on("update", (msg) => {
      console.log(msg);
    });

    socket.on('message', data => {
      console.log(data);
    })

    
  }

  return (
    <div className="Chat-Container">
      <Rooms />
      <Chat />
    </div>
  );
};
