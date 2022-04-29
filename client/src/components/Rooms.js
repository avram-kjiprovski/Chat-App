import { useState, useContext } from "react";
import { userDetailsContext } from "../App";

export const Rooms = ({ socket, me }) => {
  const [userDetails, setUserDetails] = useContext(userDetailsContext);

  const [rooms, setRooms] = useState([]);

  const handleJoinRoom = (room) => {
    console.log(room);
  };

  const handleCreateRoom = (rooms) => {
    const newRoom = {
      name: `Room ${rooms.length + 1}`,
      messages: [],
      createdBy: me.username,
    };
    setRooms([...rooms, newRoom]);

    // console.log(socket)
    socket.emit("createRoom", newRoom);
    socket.on("roomCreated", (room) => {
      console.log(room);
    });
  };

  return (
    <div className="Rooms-Container">
      <div className="Title">
        <h3>Rooms:</h3>
      </div>
      <div className="Rooms">
        {rooms.map((room, index) => {
          return (
            <div className="Room" key={room.name + index}>
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