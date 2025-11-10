export class AppConfig {
  private static instancia: AppConfig;
  private readonly vars: Record<string, string>;

  private constructor() {
    this.vars = {
      API_BASE: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
    };
  }
  static getInstancia(): AppConfig {
    if (!AppConfig.instancia) AppConfig.instancia = new AppConfig();
    return AppConfig.instancia;
  }
  get(key: keyof typeof this.vars) { return this.vars[key]; }
}
