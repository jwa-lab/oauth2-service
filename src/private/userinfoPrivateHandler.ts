import { Subscription } from "nats";
import { jsonCodec, PrivateNatsHandler } from "../nats/nats";
import { HANDLERS_SUBJECTS } from "../config";
import UserinfoCommand from "../commands/userinfo/userinfoCommand";
import { userinfoService } from "../di.config";
import { ConnectorResponse } from "../network/config/connector";

interface UserinfoResponse extends ConnectorResponse {
    data: Record<never, unknown>;
}

export const userinfoPrivateHandlers: PrivateNatsHandler[] = [
    [
        HANDLERS_SUBJECTS.USERINFO,
        async (subscription: Subscription): Promise<void> => {
            for await (const message of subscription) {
                try {
                    const { headers } = message;

                    if (!headers) {
                        throw new Error("Invalid headers.");
                    }

                    const userinfoCommand = new UserinfoCommand({
                        bearerToken: headers.get("authorization")
                    });

                    const userinfoResponse = (await userinfoService.userinfo(
                        userinfoCommand
                    )) as UserinfoResponse;

                    message.respond(
                        jsonCodec.encode({
                            ...userinfoResponse.data
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
