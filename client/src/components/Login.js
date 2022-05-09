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

    const res = await fetch(`${SERVER}/login`, {
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
    });

    const data = await res.json();

    if(data.username === username) { // if data has _id ?
      setAppDetails({
        username: data.username,
        user_id: data._id,
        selectedRoom_id: "",
        rooms: [],
      });
      await localStorage.setItem("userDetails", JSON.stringify({
        username: data.username,
        _id: data._id,
      }));
      
      navigate("/chat");
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
