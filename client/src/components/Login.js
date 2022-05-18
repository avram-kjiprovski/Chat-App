import { useState, useContext, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import "./Login.scss";
import { SERVER } from "./constants";
import { Link, useNavigate } from "react-router-dom";
import { appDetailsContext } from "../App";

export const Login = () => {
  const [appDetails, setAppDetails] = useContext(appDetailsContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const [userResponse, rooms] = await Promise.all([
        fetch(`${SERVER}/login`, {
          // TODO:
          // [] change backend not to send back any sort of password version
          method: "POST",
          withcredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }),

        // TODO
        //  [] On back-end have rooms just return rooms (do not include messages in this return)
        fetch(`${SERVER}/rooms`, {
          method: "GET",
          withcredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ]);

      const userData = await userResponse.json();
      const roomData = await rooms.json();
      console.log('UserData: ', userData);
      console.log('roomData: ', roomData);

      if(userResponse.status === 200 && rooms.status === 200) {
        // console.log("status: ", userInfo.status)
        
        const selectedRoom = roomData.filter(room => {
          if(room.usersJoined.includes(userData._id))
          return userData._id
        })
        // console.log("Rooms that include user: ", selectedRoom)

        await setAppDetails({
          username: userData.username,
          user_id: userData._id,
          selectedRoom_id: selectedRoom[0]._id,
          // selectedRoom_id: "",
          rooms: roomData,
          messages: [],
        });

        await localStorage.setItem('appDetails', JSON.stringify(appDetails));

        navigate("/chat");

      } 
      // TODO:
      // [] deal with wrong user info:
      // prompt user to try again or something

    } catch (error) {
      console.log("This is a fetch error: ", error);
    }

  };

  return (
    <div className="Login">
      <Box>
        <TextField
          id="standard-basic"
          label="Username"
          variant="standard"
          autoComplete="off"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <TextField
          id="standard-password-input"
          label="Password"
          variant="standard"
          type={"password"}
          autoComplete="off"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            handleLogin();
          }}
        >
          Login
        </Button>
        <Link to="/register">
          <sub>Register</sub>
        </Link>
      </Box>
    </div>
  );
};
