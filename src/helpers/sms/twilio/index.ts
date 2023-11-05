import ISMS from './'; // Import the ISMS interface
import { Twilio } from 'twilio'; // Import the Twilio library
import {config} from "../../../config";
import { logger } from '../../logger/basic-logging';

export default class TwilioSMS implements ISMS {
    private client: Twilio;
    from: string;

    constructor() {
        try{
            this.client = new Twilio(config.twilio.account_sid, config.twilio.auth_token);
            this.from = config.twilio.number;
        } catch(err) {
            logger.error(err, `Issue at TwilioSMS constructor`)
        }
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
