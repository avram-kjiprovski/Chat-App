import TextField from "@mui/material/TextField";

const RoomMessages = () => {
  return (
    <div className="roomMessages">
      <h1>"Room Name:"</h1>
      <div className="messages">some text messages</div>
      <div>
        <TextField fullWidth autoFocus label="Click here to chat... " />
      </div>
    </div>
  );
};

export default RoomMessages;
