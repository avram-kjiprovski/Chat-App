import { useState, useContext, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import "./Login.scss";
import { SERVER } from "./constants";
import { Link, useNavigate } from "react-router-dom";
import { userDetailsContext } from "../App";

export const Login = () => {
  // const [userDetails, setUserDetails] = useContext(userDetailsContext);

  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [password, setPassword] = useState("");
  // const [loggedIn, setLoggedIn] = useState(userDetails.loggedIn); // this needs to be eh localstorage man

  const navigate = useNavigate();

  const handleLogin = async () => {

    // refactor fetch
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

    if (data.username === username) {
      localStorage.setItem("userDetails", JSON.stringify(data));
    }
  };

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails")
    if(userDetails) {
      return navigate('/chat')
    }
  }, []);

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
