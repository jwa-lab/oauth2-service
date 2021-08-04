import { ConnectorResponse } from "../network/config/connector";
import ExchangeTokenCommand from "../commands/token/exchangeTokenCommand";
import RefreshTokenCommand from "../commands/token/refreshTokenCommand";

interface TokenServiceInterface {
    refreshToken: (
        tokenCommand: RefreshTokenCommand
    ) => Promise<ConnectorResponse>;
    exchangeAuthorizationCode: (
        exchangeTokenCommand: ExchangeTokenCommand
    ) => Promise<ConnectorResponse>;
}

interface ExchangeTokenInterface {
    grant_type: string;
    redirect_uri?: string | undefined;
    client_id: string;
    client_secret: string;
    code: string;
}

interface ExchangeTokenResponse extends ConnectorResponse {
    data: {
        access_token: string;
        refresh_token: string;
        scope: string;
    };
}

interface RefreshTokenInterface {
    grant_type: string;
    refresh_token: string;
    basic_auth: string;
    scope?: string | undefined;
}

interface RefreshTokenResponse extends ConnectorResponse {
    data: {
        access_token: string;
        refresh_token?: string;
    };
}

interface TokenInterface {
    grant_type: string;
    redirect_uri: string;
    client_id: string;
    client_secret: string;
    code: string;
    scope: string;
    refresh_token: string;
    basic_auth: string;
}

export {
    TokenServiceInterface,
    ExchangeTokenInterface,
    ExchangeTokenResponse,
    RefreshTokenInterface,
    RefreshTokenResponse,
    TokenInterface
};
