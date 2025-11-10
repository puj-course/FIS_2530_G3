import axios from "axios";
import type { IHttpClient, IHttpResponse } from "./IHttpClient";
import { AppConfig } from "../../config/AppConfig";

const baseURL = AppConfig.getInstancia().get("API_BASE");
const instance = axios.create({ baseURL, headers: { "Content-Type": "application/json" } });

export class AxiosHttpClientAdapter implements IHttpClient {
  async get<T>(url: string, config?: unknown): Promise<IHttpResponse<T>> {
    const r = await instance.get<T>(url, config as any);
    return { status: r.status, data: r.data };
  }
  async post<T>(url: string, body?: unknown, config?: unknown): Promise<IHttpResponse<T>> {
    const r = await instance.post<T>(url, body, config as any);
    return { status: r.status, data: r.data };
  }
  async put<T>(url: string, body?: unknown, config?: unknown): Promise<IHttpResponse<T>> {
    const r = await instance.put<T>(url, body, config as any);
    return { status: r.status, data: r.data };
  }
  async delete<T>(url: string, config?: unknown): Promise<IHttpResponse<T>> {
    const r = await instance.delete<T>(url, config as any);
    return { status: r.status, data: r.data };
  }
}
