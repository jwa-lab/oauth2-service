import ConnectorInterface, { ConnectorResponse } from "../network/config/connector";
import qs from "qs";
import { ExchangeTokenInterface, RefreshTokenInterface, TokenServiceInterface } from "../interfaces/token";
import { INTERNAL_REDIRECT_URI, TOKEN_ENDPOINT } from "../config";

export default class OktaTokenService implements TokenServiceInterface {
    private readonly _restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        this._restConnector = restConnector;
    }

    private async postToken(
        payload: RefreshTokenInterface | ExchangeTokenInterface,
        basic_auth?: string
    ): Promise<ConnectorResponse> {
        return this._restConnector.post(TOKEN_ENDPOINT, qs.stringify(payload), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                ...(basic_auth && { authorization: `Basic ${basic_auth}` })
            }
        });
    }

    public async refreshToken(
        refreshTokenCommand: RefreshTokenInterface
    ): Promise<ConnectorResponse> {
        const { scope, refresh_token, grant_type, basic_auth } =
            refreshTokenCommand;
        const payload = {
            grant_type: grant_type,
            refresh_token: refresh_token,
            ...(scope && { scope: scope })
        } as RefreshTokenInterface;

        return this.postToken(payload, basic_auth);
    }

    public async exchangeAuthorizationCode(
        exchangeTokenCommand: ExchangeTokenInterface
    ): Promise<ConnectorResponse> {
        const { client_id, client_secret, grant_type, code } =
            exchangeTokenCommand;
        const payload = {
            grant_type: grant_type,
            redirect_uri: INTERNAL_REDIRECT_URI,
            client_id: client_id,
            client_secret: client_secret,
            code: code
        } as ExchangeTokenInterface;

        return this.postToken(payload);
    }
}
