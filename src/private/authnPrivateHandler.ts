import { headers, Subscription } from "nats";
import { deserialize, jsonCodec, PrivateNatsHandler } from "../nats/nats";
import { HANDLERS_SUBJECTS } from "../config";
import AuthnCommand from "../commands/authn/authnCommand";
import CreateSessionCommand from "../commands/session/createSessionCommand";
import { authnService, sessionService } from "../di.config";
import { CreateSessionResponse } from "./sessionPrivateHandler";
import { ConnectorResponse } from "../network/config/connector";

interface AuthnResponseInterface extends ConnectorResponse {
    data: {
        sessionToken: string;
    };
}

export const authnPrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.AUTHN,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                try {
                    const data = deserialize<AuthnCommand>(
                        message.data,
                        AuthnCommand
                    );
                    const responseHeaders = headers();

                    const authnCommand = new AuthnCommand(data);
                    const authnResponse = (await authnService.authn(
                        authnCommand
                    )) as AuthnResponseInterface;

                    const createSessionCommand = new CreateSessionCommand({
                        sessionToken: authnResponse.data?.sessionToken
                    });
                    const createSessionResponse =
                        (await sessionService.createSession(
                            createSessionCommand
                        )) as CreateSessionResponse;

                    responseHeaders.append(
                        "set-cookie",
                        JSON.stringify({
                            cookies: [
                                `sid=${createSessionResponse.data.id}; Path=/; Secure; HttpOnly`
                            ]
                        })
                    );
                    message.respond(
                        jsonCodec.encode({
                            ...authnResponse.data
                        }),
                        {
                            headers: responseHeaders
                        }
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
