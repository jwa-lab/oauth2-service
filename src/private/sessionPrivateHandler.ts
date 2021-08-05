import { Subscription } from "nats";
import { deserialize, jsonCodec, PrivateNatsHandler } from "../nats/nats";
import { HANDLERS_SUBJECTS } from "../config";
import CreateSessionCommand from "../commands/session/createSessionCommand";
import { sessionService } from "../di.config";
import { ConnectorResponse } from "../network/config/connector";

export interface CreateSessionResponse extends ConnectorResponse {
    data: {
        id: string;
    };
}

export const sessionPrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.SESSION,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                try {
                    const data = deserialize<CreateSessionCommand>(
                        message.data,
                        CreateSessionCommand
                    );
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
