import qs from "qs";
import ExchangeTokenCommand from "../commands/token/exchangeTokenCommand";
import RefreshTokenCommand from "../commands/token/refreshTokenCommand";
import { INTERNAL_REDIRECT_URI, TOKEN_ENDPOINT } from "../config";
import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import {
    ExchangeTokenResponse,
    RefreshTokenResponse
} from "../private/tokenPrivateHandler";

interface TokenServiceInterface {
    refreshToken: (
        tokenCommand: RefreshTokenCommand
    ) => Promise<ConnectorResponse>;
    exchangeAuthorizationCode: (
        exchangeTokenCommand: ExchangeTokenCommand
    ) => Promise<ConnectorResponse>;
}

export default class OktaTokenService implements TokenServiceInterface {
    private readonly restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        if (!restConnector) {
            throw new Error("No valid REST connector.");
        }

        this.restConnector = restConnector;
    }

    private async postToken(
        payload: unknown,
        basic_auth?: string
    ): Promise<ConnectorResponse> {
        return this.restConnector.post(TOKEN_ENDPOINT, qs.stringify(payload), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                ...(basic_auth && { authorization: `Basic ${basic_auth}` })
            }
        });
    }

    public async refreshToken(
        refreshTokenCommand: RefreshTokenCommand
    ): Promise<RefreshTokenResponse> {
        const { scope, refresh_token, grant_type, basic_auth } =
            refreshTokenCommand;
        const payload = {
            grant_type: grant_type,
            refresh_token: refresh_token,
            ...(scope && { scope: scope })
        };

        return this.postToken(
            payload,
            basic_auth
        ) as Promise<RefreshTokenResponse>;
    }

    public async exchangeAuthorizationCode(
        exchangeTokenCommand: ExchangeTokenCommand
    ): Promise<ExchangeTokenResponse> {
        const { client_id, client_secret, grant_type, code } =
            exchangeTokenCommand;
        const payload = {
            grant_type: grant_type,
            redirect_uri: INTERNAL_REDIRECT_URI,
            client_id: client_id,
            client_secret: client_secret,
            code: code
        };

        return this.postToken(payload) as Promise<ExchangeTokenResponse>;
    }
}
