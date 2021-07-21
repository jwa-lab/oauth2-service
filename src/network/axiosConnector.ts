import axios, { AxiosRequestConfig } from "axios";
import ConnectorInterface, {
    ConnectorConfigInterface
} from "./config/connector";

export default class AxiosConnector implements ConnectorInterface {
    public async get(
        url: string,
        params: Record<string, unknown> | undefined,
        config: ConnectorConfigInterface | undefined
    ): Promise<never> {
        const a_config = (config as AxiosRequestConfig) || {};

        return axios.get(url, {
            ...(params && { params: params }),
            ...(a_config && a_config)
        });
    }

    public async post(
        url: string,
        body: Record<never, unknown> | string,
        config: ConnectorConfigInterface | unknown
    ): Promise<never> {
        const a_config = (config as AxiosRequestConfig) || {};

        return axios.post(url, body, a_config);
    }
}
