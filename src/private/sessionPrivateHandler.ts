import { jsonCodec, PrivateNatsHandler } from "../nats/nats";
import { Subscription } from "nats";
import { HANDLERS_SUBJECTS } from "../config";
import CreateSessionCommand from "../commands/session/createSessionCommand";
import { CreateSessionResponse, SessionInterface } from "../interfaces/session";
import { sessionService } from "../di.config";

export const sessionPrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.SESSION,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                try {
                    const data = jsonCodec.decode(
                        message.data
                    ) as SessionInterface;
                    const createSessionCommand = new CreateSessionCommand(data);
                    const sessionResponse = (await sessionService.createSession(
                        createSessionCommand
                    )) as CreateSessionResponse;

                    message.respond(
                        jsonCodec.encode({
                            ...sessionResponse.data
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
