import qs from "qs";
import ExchangeTokenCommand from "../commands/exchangeTokenCommand";
import RefreshTokenCommand from "../commands/refreshTokenCommand";
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
    ) => Promise<ConnectorResponse<RefreshTokenResponse>>;
    exchangeAuthorizationCode: (
        exchangeTokenCommand: ExchangeTokenCommand
    ) => Promise<ConnectorResponse<ExchangeTokenResponse>>;
}

export default class OktaTokenService implements TokenServiceInterface {
    private readonly restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        if (!restConnector) {
            throw new Error("No valid REST connector.");
        }

        this.restConnector = restConnector;
    }

    private async postToken<T>(
        payload: unknown,
        authorization?: string
    ): Promise<ConnectorResponse<T>> {
        return this.restConnector.post<T>(
            TOKEN_ENDPOINT,
            qs.stringify(payload),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    ...(authorization && { authorization: authorization })
                }
            }
        );
    }

    public async refreshToken({
        scope,
        refresh_token,
        grant_type,
        authorization
    }: RefreshTokenCommand): Promise<ConnectorResponse<RefreshTokenResponse>> {
        return this.postToken<RefreshTokenResponse>(
            {
                grant_type,
                refresh_token,
                scope
            },
            authorization
        );
    }

    public async exchangeAuthorizationCode({
        client_id,
        client_secret,
        grant_type,
        code
    }: ExchangeTokenCommand): Promise<
        ConnectorResponse<ExchangeTokenResponse>
    > {
        return this.postToken<ExchangeTokenResponse>({
            grant_type,
            redirect_uri: INTERNAL_REDIRECT_URI,
            client_id,
            client_secret,
            code
        });
    }
}
