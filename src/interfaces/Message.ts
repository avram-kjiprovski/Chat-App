export interface IMessage {
    _id: string;
    content: string;
    sentBy: string;
    createdAt?: Date;
    room_id: string;
}