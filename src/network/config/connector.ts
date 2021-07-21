export interface ConnectorResponse {
    data: unknown;
    headers: never | unknown;
    status: number;
    request?: never;
}

export interface ConnectorConfigInterface {
    url?: string;
    method?: string;
    headers?: Record<string, unknown>;
    params?: Record<string, never>;
    body?: Record<never, unknown> | string;
    withCredentials?: boolean;
    maxBodyLength?: number;
    maxRedirects?: number;
}

export default interface ConnectorInterface {
    post: (
        url: string,
        body: Record<never, unknown> | string,
        config?: ConnectorConfigInterface
    ) => Promise<ConnectorResponse>;
    get: (
        url: string,
        params?: Record<string, unknown>,
        config?: ConnectorConfigInterface
    ) => Promise<ConnectorResponse>;
}
