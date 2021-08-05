import { Subscription } from "nats";
import {
    AirlockPayload,
    getConnection,
    jsonCodec,
    PublicNatsHandler
} from "../nats/nats";
import { HANDLERS_SUBJECTS, SERVICE_NAME } from "../config";

export const sessionPublicHandlers: PublicNatsHandler[] = [
    [
        "POST",
        HANDLERS_SUBJECTS.SESSION,
        async (subsciption: Subscription): Promise<void> => {
            for await (const message of subsciption) {
                try {
                    const natsConnection = getConnection();

                    const { body } = jsonCodec.decode(
                        message.data
                    ) as AirlockPayload;

                    const response = await natsConnection.request(
                        `${SERVICE_NAME}.${HANDLERS_SUBJECTS.SESSION}`,
                        jsonCodec.encode(body),
                        { timeout: 5000 }
                    );

                    message.respond(response.data);
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
