export interface IRoom {
    _id: string;
    name?: string;
    createdBy: string;
    messages?: string[];
    usersJoined?: string[];
} 