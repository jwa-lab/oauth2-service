import { headers, Subscription } from "nats";
import AuthnCommand from "../commands/authn/authnCommand";
import CreateSessionCommand from "../commands/session/createSessionCommand";
import { HANDLERS_SUBJECTS } from "../config";
import { authnService, sessionService } from "../di.config";
import { ConnectorResponse } from "../network/config/connector";
import { deserialize, jsonCodec, PrivateNatsHandler } from "../services/natsService";

export interface AuthnResponseInterface extends ConnectorResponse {
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
                    ));

                    const createSessionCommand = new CreateSessionCommand({
                        sessionToken: authnResponse.data?.sessionToken
                    });
                    const createSessionResponse =
                        await sessionService.createSession(
                            createSessionCommand
                        );

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
                            error:
                                err?.response?.status === 401
                                    ? "AUTHENTICATION_FAILED"
                                    : err.message
                        })
                    );
                }
            }
        }
    ]
];
