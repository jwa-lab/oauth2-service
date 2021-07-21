import { Subscription } from "nats";
import ExchangeTokenCommand from "../commands/exchangeTokenCommand";
import RefreshTokenCommand from "../commands/refreshTokenCommand";
import { HANDLERS_SUBJECTS } from "../config";
import { tokenService } from "../di.config";
import {
    deserialize,
    jsonCodec,
    PrivateNatsHandler
} from "../services/natsService";

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

export interface ExchangeTokenResponse {
    access_token: string;
    refresh_token: string;
    scope: string;
}

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token?: string;
}

export const tokenPrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.TOKEN,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                const data = jsonCodec.decode(message.data) as TokenInterface;
                let refreshTokenCommand, exchangeCodeCommand;
                let exchangeTokenData;
                let tokenResponse;

                try {
                    if (!data?.grant_type) {
                        throw new Error("GRANT_TYPE_MISSING");
                    }

                    switch (data.grant_type) {
                        case "refresh_token":
                            refreshTokenCommand =
                                deserialize<RefreshTokenCommand>(
                                    message.data,
                                    RefreshTokenCommand,
                                    message.headers
                                );

                            tokenResponse = await tokenService.refreshToken(
                                refreshTokenCommand
                            );

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
                                await tokenService.exchangeAuthorizationCode(
                                    exchangeCodeCommand
                                );
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
                            error:
                                err.response?.status === 400
                                    ? "INVALID_PARAMETERS"
                                    : err.message
                        })
                    );
                }
            }
        }
    ]
];
