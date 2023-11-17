import IChatRoomRepository from "../../modules/chat-room-repository";
import IMessageRepository, { IMessage } from "../../modules/message-repository";

// stateful

export default interface IChat {
    connect(chat_room_id: string): Promise<void>;
    disconnect(chat_room_id: string): Promise<void>;
    send(
        message: ISentMessage, 
        messageRepository: IMessageRepository, 
        chatRoomRepository: IChatRoomRepository, 
        callback: (
            status: { 
                success: boolean 
            }, 
            error?: Error
        ) => void
    ): void;
    retrieve(chat_room_id: string, messageRepository: IMessageRepository, chatRoomRepository: IChatRoomRepository): Promise<IGetChatRoomMessages>;
    listen(chat_room_id: string, callback: (message: ISentMessage) => void): Promise<void>;
}

export interface IGetChatRoomMessages {
    messages: IMessage[];
}

export interface ISentMessage {
    message: IMessage;
}

/**
 * send()
 * 
 * 1. create chatroom if not there
 * 2. send message through XMPP protocol
 */