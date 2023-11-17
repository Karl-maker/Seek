export const MessageTopics = {
    START_CHAT_SERVICE_PROFILE: 'MESSAGE_START_CHAT_SERVICE_PROFILE',
}

export interface IMessageStartChatServiceProfilePayload {
    service_profile_id: string;
    from: {
        account_id: string;
    }
}
