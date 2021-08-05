import { Subscription } from "nats";
import { HANDLERS_SUBJECTS, SERVICE_NAME } from "../config";
import { AirlockPayload, getConnection, jsonCodec, PublicNatsHandler } from "../nats/nats";

export const authorizePublicHandlers: PublicNatsHandler[] = [
    [
        "GET",
        HANDLERS_SUBJECTS.AUTHORIZE,
        async (subsciption: Subscription): Promise<void> => {
            for await (const message of subsciption) {
                try {
                    const natsConnection = getConnection();
                    const { query } = jsonCodec.decode(
                        message.data
                    ) as AirlockPayload;
                    console.log(message.headers && message.headers.get("cookie"));
                    const response = await natsConnection.request(
                        `${SERVICE_NAME}.${HANDLERS_SUBJECTS.AUTHORIZE}`,
                        jsonCodec.encode({
                            ...(query as Record<never, unknown>),
                            cookie:
                                message?.headers &&
                                message.headers.get("cookie")
                        }),
                        { timeout: 6000 }
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
