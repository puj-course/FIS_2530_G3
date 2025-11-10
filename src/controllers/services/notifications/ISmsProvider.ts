export interface SmsMessage {
  to: string;
  body: string;
}

export interface ISmsProvider {
  send(message: SmsMessage): Promise<void>;
}
