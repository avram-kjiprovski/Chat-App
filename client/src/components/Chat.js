import { useState } from 'react';
import {SERVER} from './constants'

export const Chat = () => {

  const [message, setMessage] = useState('')

  const handleSendMessage = async () => {
    const res = await fetch(`${SERVER}/message`, {
      method: "POST",
      withcredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    const data = await res.json();
    console.log("Chat: ", data)

    
  }

  return (
    <div className="Chat-Box">
      <div className="Title">
        <h3>Selected Room Name</h3>
      </div>
      
      <div className="Chat-Messages">
        <div className="Chat-Message Message">
          <p>Yo, wassup!</p>
        </div>

        <div className="Chat-My-Message Message">
          <p>I've been expecting you!</p>
        </div>
        
        <div className="Chat-Message Message">
          <p>Who... Who are you?!</p>
        </div>

        <div className="Chat-New-Message">
          <input placeholder="Your text here..." value={message} onChange={(e) => {
            setMessage(e.target.value)
          }}></input>
          <button onClick={
            () => {
              handleSendMessage()
            }
          }>Send</button>
        </div>

      </div>
    </div>
  );
};
