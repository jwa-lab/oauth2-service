import axios from "axios";
import ConnectorInterface, {
    ConnectorConfigInterface,
    ConnectorResponse
} from "./config/connector";

export default class AxiosConnector implements ConnectorInterface {
    public async get<T>(
        url: string,
        params = {},
        config: ConnectorConfigInterface = {}
    ): Promise<ConnectorResponse<T>> {
        return axios.get<T>(url, {
            params,
            ...config
        });
    }

    public async post<T>(
        url: string,
        body: Record<never, unknown>,
        config: ConnectorConfigInterface = {}
    ): Promise<ConnectorResponse<T>> {
        return axios.post<T>(url, body, config);
    }
}
