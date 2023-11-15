import IBaseRepository, { IBase } from "../base-repository";
import { IMember } from "../chat-room-repository";

export default interface IMessageRepository extends IBaseRepository<IMessage> {

} 

export interface IMessage extends IBase {
    from: IMember;
    chat_room_id: string;
    text: string;
}

