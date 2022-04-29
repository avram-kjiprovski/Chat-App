import React, { useState, createContext, useContext } from "react";
import "./App.css";
import { ChatApp } from "./components/ChatApp";
import { Login } from "./components/Login";

import {
  Routes,
  Route
} from "react-router-dom";

export const userDetailsContext = createContext();

const App = () => {
  const [userDetails, setUserDetails] = useState({
    _id: "",
    username: "",
    password: "",
    loggedIn: false,
    rooms: [],
  });

  
  return (
    <userDetailsContext.Provider value={[userDetails, setUserDetails]}>
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </div>
    </userDetailsContext.Provider>
  );
};

export default App;
