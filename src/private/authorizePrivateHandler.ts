import { jsonCodec, PrivateNatsHandler } from "../nats/nats";
import { Subscription } from "nats";
import { HANDLERS_SUBJECTS } from "../config";
import {
    AuthorizeInterface,
    AuthorizeResponseInterface
} from "../interfaces/authorize";
import { authorizeService } from "../di.config";
import AuthorizeCommand from "../commands/authorize/authorizeCommand";

export const authorizePrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.AUTHORIZE,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                try {
                    const { headers } = message;
                    const data = jsonCodec.decode(
                        message.data
                    ) as AuthorizeInterface;
                    data.cookie = headers?.get("cookie");

                    const authorizeCommand = new AuthorizeCommand(data);
                    const authorizeResponse = (await authorizeService.authorize(
                        authorizeCommand
                    )) as AuthorizeResponseInterface;

                    if (
                        authorizeResponse.data.state !== authorizeCommand.state
                    ) {
                        throw new Error("Invalid state.");
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
