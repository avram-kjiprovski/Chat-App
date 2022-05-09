import { useState, useContext, useEffect } from "react";
import { appDetailsContext } from "../App";
import { SERVER } from "./constants";
import { Button } from "@mui/material";


export const Rooms = () => {
  const [userDetails, setUserDetails] = useState(
    localStorage.getItem("userDetails")
  );

  const [appDetails, setAppDetails] = useContext(appDetailsContext);
  const [rooms, setRooms] = useState(appDetails.rooms);
  const [selectedRoom, setSelectedRoom] = useState(appDetails.selectedRoom_id);

  useEffect(() => {
    setRooms(appDetails.rooms);
    setSelectedRoom(appDetails.selectedRoom_id);
  }, [appDetails])

  const handleJoinRoom = async (room) => {
    console.log(room._id)
    const res = await fetch(`${SERVER}/rooms/${room._id}/join`, {
      method: "GET",
      withcredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        },
    });

    const data = await res.json();
    // console.log(data);
  };

  const handleSelectRoom = (room) => {
    console.log("selecting room: ", room._id);
    setSelectedRoom(room._id);
    localStorage.setItem("selectedRoom", room._id);
  }

  const handleCreateRoom = async (rooms) => {

    const res = await fetch(`${SERVER}/createRoom`, {
      method: "POST",
      withcredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await res.json();
    console.log(data);

    setRooms(data);
  };

  return (
    <div className="Rooms-Container">
      <div className="Title">
        <h3>Rooms:</h3>
      </div>
      <div className="Rooms">
        {rooms.map((room, index) => {
          return (
            <div
              className={`Room ${selectedRoom === room._id ? "selected" : ""}`} // what have I done?
              key={room._id}
              onClick={() => {
                handleSelectRoom(room);
              }}
            >
              <p>{room.name}</p>
              {room.usersJoined.includes(
                JSON.parse(localStorage.getItem("userDetails"))._id
              ) ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    handleJoinRoom(room);
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
              handleCreateRoom(rooms);
            }}
          >
            Create new Room
          </Button>
        </div>
      </div>
    </div>
  );
};