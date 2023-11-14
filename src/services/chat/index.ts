import IChatRoomRepository from "../../modules/chat-room-repository";
import IMessageRepository from "../../modules/message-repository";

export default interface IChat {
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
    ): Promise<ISendMessageResult>;
    retrieve(chat_room_id: string, messageRepository: IMessageRepository, chatRoomRepository: IChatRoomRepository): Promise<IGetChatRoomMessages>;
    listen(chat_room_id: string, callback: (message: ISentMessage) => void): Promise<void>;
}

export interface ISendMessageResult {
    
}

export interface IGetChatRoomMessages {

}

export interface ISentMessage {
    message: string;
    chat_room_id: string;
    from: {
        account_id: string;
        service_profile_id?: string;
    };
}

/**
 * send()
 * 
 * 1. create chatroom if not there
 * 2. send message through XMPP protocol
 */