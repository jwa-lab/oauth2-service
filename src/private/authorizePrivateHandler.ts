import { Subscription } from "nats";
import AuthorizeCommand from "../commands/authorizeCommand";
import { HANDLERS_SUBJECTS } from "../config";
import { authorizeService } from "../di.config";
import {
    deserialize,
    jsonCodec,
    PrivateNatsHandler
} from "../services/natsService";

export interface AuthorizeResponse {
    code: string;
    state: string;
    redirect_uri: string;
}

export const authorizePrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.AUTHORIZE,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                try {
                    const authorizeCommand = deserialize<AuthorizeCommand>(
                        message.data,
                        AuthorizeCommand,
                        message?.headers
                    );

                    const authorizeResponse = await authorizeService.authorize(
                        authorizeCommand
                    );

                    if (
                        authorizeResponse.data.state !== authorizeCommand.state
                    ) {
                        throw new Error("INVALID_STATE");
                    }

                    if (!authorizeResponse.data.code) {
                        throw new Error("REQUEST_ERROR");
                    }

                    message.respond(
                        jsonCodec.encode({
                            code: authorizeResponse.data.code,
                            redirect_uri: authorizeCommand.redirect_uri
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
