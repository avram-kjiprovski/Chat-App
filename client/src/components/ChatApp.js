import {Rooms} from './Rooms';
import {Chat} from './Chat';
import {io} from 'socket.io-client';
import {useState, useEffect, useContext} from 'react';
import { userDetailsContext } from "../App";


export const ChatApp = () => {
    const [userDetails, setUserDetails] = useContext(userDetailsContext);
    console.log(userDetails);

    const socket = io("http://localhost:8000", {
      cookie: {
        httpOnly: true,
      }
    });
    
    socket.on('connect', () => {
      console.log("connected");
    })


    return (
      <div className="Chat-Container">
        <Rooms />
        <Chat />
      </div>
    );
}