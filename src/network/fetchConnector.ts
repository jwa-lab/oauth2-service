import fetch from "node-fetch";
import { URLSearchParams } from "url";
import ConnectorInterface, {
    ConnectorConfigInterface,
    ConnectorResponse
} from "./config/connector";

export default class FetchConnector implements ConnectorInterface {
    public async get(
        url: string,
        params?: Record<string, unknown>,
        config?: ConnectorConfigInterface
    ): Promise<ConnectorResponse> {
        const headers = (config as ConnectorConfigInterface)?.headers || {};
        const f_params = params as unknown as Iterable<[string, string]>;

        const inheaders = {
            ...headers,
            ...(!headers["Accept"] &&
                !headers["accept"] && { Accept: "application/json" }),
            ...(!headers["Content-Type"] &&
                !headers["accept"] && { "Content-Type": "application/json" })
        };
        const response = await fetch(
            url + (params ? "?" + new URLSearchParams(f_params) : ""),
            {
                method: "get",
                headers: inheaders
            }
        );
        const responseData = await response.json();

        const formattedPayload = {
            data: responseData,
            headers: response.headers,
            status: response.status,
            request: undefined
        } as ConnectorResponse;

        return Promise.resolve(formattedPayload);
    }

    public async post(
        url: string,
        body: Record<never, unknown> | string,
        config: ConnectorConfigInterface | unknown
    ): Promise<ConnectorResponse> {
        const headers = (config as ConnectorConfigInterface)?.headers || {};
        const inheaders = {
            ...headers,
            ...(!headers["Accept"] &&
                !headers["accept"] && { Accept: "application/json" }),
            ...(!headers["Content-Type"] &&
                !headers["accept"] && { "Content-Type": "application/json" })
        };
        const response = await fetch(url, {
            method: "post",
            body: typeof body === "object" ? JSON.stringify(body) : body,
            headers: inheaders
        });
        const responseData = await response.json();

        const formattedPayload = {
            data: responseData,
            headers: response.headers,
            status: response.status,
            request: undefined
        } as ConnectorResponse;

        return Promise.resolve(formattedPayload);
    }
}
