import ISMS from './'; // Import the ISMS interface
import { Twilio } from 'twilio'; // Import the Twilio library

export default class TwilioSMS implements ISMS {
    private client: Twilio;
    from: string;

    constructor(from: string, accountSid: string, authToken: string) {
        this.client = new Twilio(accountSid, authToken);
        this.from = from;
    }

    async send(mobile: string, message: string): Promise<void> {
        try {
            await this.client.messages.create({
                body: message,
                from: this.from, // Your Twilio phone number
                to: mobile,
            });

        } catch (error) {
            throw error;
        }
    }
}
