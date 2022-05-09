import React, { useState, createContext, useContext } from "react";
import "./App.css";
import { ChatApp } from "./components/ChatApp";
import { Login } from "./components/Login";

import {
  Routes,
  Route
} from "react-router-dom";

export const appDetailsContext = createContext();

const App = () => {
  const [appDetails, setAppDetails] = useState({
    username: '',
    user_id: '',
    selectedRoom_id: '',
    rooms: [],
  });
  
  return (
    <appDetailsContext.Provider value={[appDetails, setAppDetails]}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<ChatApp />} />
        </Routes>
      </div>
    </appDetailsContext.Provider>
  );
};

export default App;
