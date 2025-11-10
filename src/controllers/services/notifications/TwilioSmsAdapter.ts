import { ISmsProvider, SmsMessage } from "./ISmsProvider";
import twilio from "twilio";

export class TwilioSmsAdapter implements ISmsProvider {
  private client: ReturnType<typeof twilio>;
  private from: string;

  constructor() {
    const sid = process.env.TWILIO_ACCOUNT_SID || "";
    const token = process.env.TWILIO_AUTH_TOKEN || "";
    this.from = process.env.TWILIO_FROM || "";
    if (!sid || !token || !this.from) throw new Error("Twilio config incompleta");
    this.client = twilio(sid, token);
  }

  async send(message: SmsMessage): Promise<void> {
    await this.client.messages.create({
      from: this.from,
      to: message.to,
      body: message.body,
    });
  }
}
