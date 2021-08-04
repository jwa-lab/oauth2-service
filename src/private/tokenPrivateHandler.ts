import { jsonCodec, PrivateNatsHandler } from "../nats/nats";
import { Subscription } from "nats";
import { HANDLERS_SUBJECTS } from "../config";
import RefreshTokenCommand from "../commands/token/refreshTokenCommand";
import {
    ExchangeTokenResponse,
    RefreshTokenResponse,
    TokenInterface
} from "../interfaces/token";
import ExchangeTokenCommand from "../commands/token/exchangeTokenCommand";
import { tokenService } from "../di.config";

export const tokenPrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.TOKEN,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                const data = jsonCodec.decode(message.data) as TokenInterface;
                let refreshTokenCommand, exchangeCodeCommand;
                let tokenResponse;

                try {
                    if (!data?.grant_type) {
                        throw new Error("Missing grant_type.");
                    }

                    switch (data.grant_type) {
                        case "refresh_token":
                            refreshTokenCommand = new RefreshTokenCommand(data);
                            tokenResponse = (await tokenService.refreshToken(
                                refreshTokenCommand
                            )) as RefreshTokenResponse;
                            break;
                        case "authorization_code":
                            exchangeCodeCommand = new ExchangeTokenCommand(
                                data
                            );
                            tokenResponse =
                                (await tokenService.exchangeAuthorizationCode(
                                    exchangeCodeCommand
                                )) as ExchangeTokenResponse;
                            break;
                        default:
                            throw new Error("Unsupported grant_type.");
                    }

                    message.respond(
                        jsonCodec.encode({
                            ...tokenResponse.data
                        })
                    );
                } catch (err) {
                    message.respond(
                        jsonCodec.encode({
                            error: err.message
                        })
                    );
                }
            }
        }
    ]
];
