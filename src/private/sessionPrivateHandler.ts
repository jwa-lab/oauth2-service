import { Subscription } from "nats";
import CreateSessionCommand from "../commands/session/createSessionCommand";
import { HANDLERS_SUBJECTS } from "../config";
import { sessionService } from "../di.config";
import {
    deserialize,
    jsonCodec,
    PrivateNatsHandler
} from "../services/natsService";
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
                    const sessionResponse = await sessionService.createSession(
                        createSessionCommand
                    );

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
