

export const Chat = () => {
  return (
    <div className="Chat-Box">
      <div className="Title">
        <h3>Selected Room Name</h3>
        {/* horizontal rule or border or w/e */}
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
          <input placeholder="Your text here..."></input>
          <button>Send</button>
        </div>

      </div>
    </div>
  );
};
