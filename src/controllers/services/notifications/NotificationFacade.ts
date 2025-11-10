import { ISmsProvider } from "./ISmsProvider";
import { TwilioSmsAdapter } from "./TwilioSmsAdapter";

type UserLite = { id: string; nombre: string; email: string; telefono?: string };

export class NotificationFacade {
  private static _inst: NotificationFacade;
  private sms: ISmsProvider;

  private constructor(provider?: ISmsProvider) {
    this.sms = provider ?? new TwilioSmsAdapter();
  }

  static getInstancia(provider?: ISmsProvider): NotificationFacade {
    if (!NotificationFacade._inst) NotificationFacade._inst = new NotificationFacade(provider);
    return NotificationFacade._inst;
  }

  async userCreated(user: UserLite): Promise<void> {
    const adminPhone = process.env.ADMIN_ALERT_PHONE;
    const sendToUser = String(process.env.SEND_SMS_TO_USER_ON_SIGNUP || "false") === "true";

    const adminBody = `Bienvenido ${user.nombre} esta es tu informacion\nNombre: ${user.nombre}\nEmail: ${user.email}\nId: ${user.id}`;
    const tasks: Promise<void>[] = [];

    if (adminPhone) tasks.push(this.sms.send({ to: adminPhone, body: adminBody }));
    if (sendToUser && user.telefono) {
      const userBody = `¡Hola ${user.nombre}! Tu cuenta fue creada exitosamente.`;
      tasks.push(this.sms.send({ to: user.telefono, body: userBody }));
    }

    try {
      await Promise.all(tasks);
    } catch (e) {
      console.error("[NotificationFacade] Error enviando SMS:", (e as Error).message);
    }
  }
}
