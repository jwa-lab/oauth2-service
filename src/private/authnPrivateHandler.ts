import { jsonCodec, PrivateNatsHandler } from "../nats/nats";
import { headers, Subscription } from "nats";
import { HANDLERS_SUBJECTS } from "../config";
import { AuthnInterface, AuthnResponseInterface } from "../interfaces/authn";
import AuthnCommand from "../commands/authn/authnCommand";
import CreateSessionCommand from "../commands/session/createSessionCommand";
import { CreateSessionResponse } from "../interfaces/session";
import { authnService, sessionService } from "../di.config";

export const authnPrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.AUTHN,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                try {
                    const data = jsonCodec.decode(
                        message.data
                    ) as AuthnInterface;
                    const authnCommand = AuthnCommand(data);
                    const responseHeaders = headers();
                    const authnResponse = (await authnService.authn(
                        authnCommand
                    )) as AuthnResponseInterface;
                    const createSessionCommand = CreateSessionCommand({
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
