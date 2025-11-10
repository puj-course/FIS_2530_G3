export interface IHttpResponse<T = unknown> {
  status: number;
  data: T;
}
export interface IHttpClient {
  get<T>(url: string, config?: unknown): Promise<IHttpResponse<T>>;
  post<T>(url: string, body?: unknown, config?: unknown): Promise<IHttpResponse<T>>;
  put<T>(url: string, body?: unknown, config?: unknown): Promise<IHttpResponse<T>>;
  delete<T>(url: string, config?: unknown): Promise<IHttpResponse<T>>;
}
