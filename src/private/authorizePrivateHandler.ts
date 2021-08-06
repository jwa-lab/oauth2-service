import { Subscription } from "nats";
import { deserialize, jsonCodec, PrivateNatsHandler } from "../nats/nats";
import { HANDLERS_SUBJECTS } from "../config";
import { authorizeService } from "../di.config";
import AuthorizeCommand from "../commands/authorize/authorizeCommand";
import { ConnectorResponse } from "../network/config/connector";

interface AuthorizeResponseInterface extends ConnectorResponse {
    data: {
        code: string;
        state: string;
        redirect_uri: string;
    };
}

export const authorizePrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.AUTHORIZE,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                try {
                    const data = deserialize<AuthorizeCommand>(
                        message.data,
                        AuthorizeCommand,
                        message?.headers
                    );
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
