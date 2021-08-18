export interface ConnectorResponse<T> {
    data: T;
    headers: Record<string, unknown>;
    status: number;
    request?: never;
}

export interface ConnectorConfigInterface {
    headers?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    withCredentials?: boolean;
    maxBodyLength?: number;
    maxRedirects?: number;
}

export default interface ConnectorInterface {
    post: <T>(
        url: string,
        body: Record<never, unknown>,
        config?: ConnectorConfigInterface
    ) => Promise<ConnectorResponse<T>>;
    get: <T>(
        url: string,
        params?: Record<string, unknown>,
        config?: ConnectorConfigInterface
    ) => Promise<ConnectorResponse<T>>;
}
