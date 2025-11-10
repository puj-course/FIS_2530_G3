import type { IHttpClient } from "../http/IHttpClient";
import { AxiosHttpClientAdapter } from "../http/AxiosHttpClientAdapter";

export type RegisterDTO = {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
};

export type AuthResponse = {
  ok: boolean;
  message?: string;
  token?: string;
  user?: { id: string; nombre: string; email: string };
};

export class AuthFacade {
  private static _inst: AuthFacade;
  private http: IHttpClient;

  private constructor(http?: IHttpClient) {
    this.http = http ?? new AxiosHttpClientAdapter();
  }

  static getInstancia(): AuthFacade {
    if (!AuthFacade._inst) AuthFacade._inst = new AuthFacade();
    return AuthFacade._inst;
  }

  async register(payload: RegisterDTO): Promise<AuthResponse> {
    const { data } = await this.http.post<any>("/auth/register", payload);
    if (typeof data?.ok === "boolean") return data as AuthResponse;
    return { ok: Boolean(data?.token || data?.user), token: data?.token, user: data?.user };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await this.http.post<any>("/auth/login", { email, password });
    if (typeof data?.ok === "boolean") return data as AuthResponse;
    return { ok: Boolean(data?.token || data?.user), token: data?.token, user: data?.user };
  }
}
