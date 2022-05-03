import { useState, useContext, useEffect } from "react";
import { userDetailsContext } from "../App";
import { SERVER } from "./constants";

export const Rooms = ({ socket, me }) => {
  const [userDetails, setUserDetails] = useContext(userDetailsContext);

  const [rooms, setRooms] = useState([]);

  useEffect(async () => {

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
  }, []);

  const handleJoinRoom = (room) => {
    console.log(room);
  };

  const handleCreateRoom = async (rooms) => {
    // const newRoom = {
    //   name: `Room ${rooms.length + 1}`,
    //   messages: [],
    //   createdBy: me.username,
    // };
    // setRooms([...rooms, newRoom]);

    // // console.log(socket)
    // socket.emit("createRoom", newRoom);
    // socket.on("roomCreated", (room) => {
    //   console.log(room);
    // });

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

    setRooms([...rooms, data]);
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