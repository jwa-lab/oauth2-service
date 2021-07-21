import { AirlockPayload, jsonCodec, PublicNatsHandler } from "../nats/nats";
import { Subscription } from "nats";
import { HANDLERS_SUBJECTS } from "../config";
import { AuthorizeCodeInterface } from "../interfaces/authorize";

export const authorizeCodePublicHandlers: PublicNatsHandler[] = [
    [
        "GET",
        HANDLERS_SUBJECTS.AUTHORIZE_CODE,
        async (subsciption: Subscription): Promise<void> => {
            for await (const message of subsciption) {
                try {
                    const { query } = jsonCodec.decode(
                        message.data
                    ) as AirlockPayload;
                    const { state, code } =
                        query as unknown as AuthorizeCodeInterface;

                    message.respond(
                        jsonCodec.encode({
                            code: code,
                            ...(state && { state: state })
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
