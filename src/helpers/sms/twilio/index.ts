import ISMS from './'; // Import the ISMS interface
import { Twilio } from 'twilio'; // Import the Twilio library
import {config} from "../../../config";

export default class TwilioSMS implements ISMS {
    private client: Twilio;
    from: string;

    constructor() {
        this.client = new Twilio(config.twilio.account_sid, config.twilio.auth_token);
        this.from = config.twilio.number;
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
