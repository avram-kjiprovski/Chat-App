import Rooms from './Rooms';
import RoomMessages from './RoomMessages';
import './Chat.css';

const Chat = () => {
    return (
        <div className='container'>
            <Rooms />
            <RoomMessages />
        </div>
    )
}

export default Chat;