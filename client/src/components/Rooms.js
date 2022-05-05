import { useState, useContext, useEffect } from "react";
import { userDetailsContext } from "../App";
import { SERVER } from "./constants";

export const Rooms = () => {
  const [userDetails, setUserDetails] = useState(
    localStorage.getItem("userDetails")
  );
  const [rooms, setRooms] = useState([]);

  const getRooms = async () => {
      const res = await fetch(`${SERVER}/rooms`, {
      method: "GET",
      withcredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        },
    })
    const data = await res.json();
    
    setRooms(data);
    console.log(data)
    
  }

  useEffect( () => {
    getRooms();
  }, []);

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
    console.log(data)
  };

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
              className={`Room ${index === 0 ? "selected" : ""}`}
              key={room._id}
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

          <button
            onClick={() => {
              handleCreateRoom(rooms);
            }}
          >
            Create new Room
          </button>
        </div>
      </div>
    </div>
  );
};