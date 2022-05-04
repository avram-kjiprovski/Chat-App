import { useState, useContext, useEffect } from "react";
import { userDetailsContext } from "../App";
import { SERVER } from "./constants";

export const Rooms = ({ socket, me }) => {
  const [userDetails, setUserDetails] = useContext(userDetailsContext);

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
            <div className="Room" key={room._id}>
              <p>{room.name}</p>
              {/* napravi uslov kajsto ako korisnikot e vo taa soba nema da ima button */}
              <button
                onClick={() => {
                  handleJoinRoom(room);
                }}
              >
                Join
              </button>
            </div>
          );
        })}
        <div className="Create-New-Room">
          {/* Button or whatever for new room */}
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