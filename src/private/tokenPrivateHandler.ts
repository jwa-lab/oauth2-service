import { Subscription } from "nats";
import ExchangeTokenCommand from "../commands/token/exchangeTokenCommand";
import RefreshTokenCommand from "../commands/token/refreshTokenCommand";
import { HANDLERS_SUBJECTS } from "../config";
import { tokenService } from "../di.config";
import { deserialize, jsonCodec, PrivateNatsHandler } from "../nats/nats";
import { ConnectorResponse } from "../network/config/connector";

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

interface ExchangeTokenResponse extends ConnectorResponse {
    data: {
        access_token: string;
        refresh_token: string;
        scope: string;
    };
}

interface RefreshTokenResponse extends ConnectorResponse {
    data: {
        access_token: string;
        refresh_token?: string;
    };
}

export const tokenPrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.TOKEN,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                const data = jsonCodec.decode(message.data) as TokenInterface;
                let refreshTokenCommand, exchangeCodeCommand;
                let refreshTokenData, exchangeTokenData;
                let tokenResponse;

                try {
                    if (!data?.grant_type) {
                        throw new Error("GRANT_TYPE_MISSING");
                    }

                    switch (data.grant_type) {
                        case "refresh_token":
                            refreshTokenData = deserialize<RefreshTokenCommand>(
                                message.data,
                                RefreshTokenCommand
                            );
                            refreshTokenCommand = new RefreshTokenCommand(
                                refreshTokenData
                            );
                            tokenResponse = (await tokenService.refreshToken(
                                refreshTokenCommand
                            )) as RefreshTokenResponse;
                            break;
                        case "authorization_code":
                            exchangeTokenData =
                                deserialize<ExchangeTokenCommand>(
                                    message.data,
                                    ExchangeTokenCommand
                                );
                            exchangeCodeCommand = new ExchangeTokenCommand(
                                exchangeTokenData
                            );
                            tokenResponse =
                                (await tokenService.exchangeAuthorizationCode(
                                    exchangeCodeCommand
                                )) as ExchangeTokenResponse;
                            break;
                        default:
                            throw new Error("UNSUPPORTED_GRANT_TYPE");
                    }

                    message.respond(
                        jsonCodec.encode({
                            ...tokenResponse.data
                        })
                    );
                } catch (err) {
                    message.respond(
                        jsonCodec.encode({
                            error: err.response?.status === 400 ? "INVALID_PARAMETERS" : err.message
                        })
                    );
                }
            }
        }
    ]
];
