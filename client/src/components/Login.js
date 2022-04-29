import { useState, useContext, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import "./Login.scss";
import { SERVER } from "./constants";
import { Link, useNavigate } from "react-router-dom";
import { userDetailsContext } from "../App";

export const Login = () => {
  const [userDetails, setUserDetails] = useContext(userDetailsContext);

  const [username, setUsername] = useState(userDetails.username);
  const [password, setPassword] = useState(userDetails.password);
  const [loggedIn, setLoggedIn] = useState(userDetails.loggedIn);

  const navigate = useNavigate();

  const handleLogin = () => {


    fetch(`${SERVER}/login`, {
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
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        if (data.username === username) {
          setUserDetails({
            _id: data._id,
            username: username,
            password: password,
            loggedIn: true,
            rooms: data.rooms,
          })
        }
      })
      .catch((err) => {
        console.log(err)
      });
  };

  useEffect(() => {
    if(userDetails.loggedIn) {
      console.log(userDetails);
      return navigate('/chat')
    }
  }, [userDetails]);

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
          id="standard-basic"
          label="Password"
          variant="standard"
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
