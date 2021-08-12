import { Subscription } from "nats";
import UserinfoCommand from "../commands/userinfo/userinfoCommand";
import { HANDLERS_SUBJECTS } from "../config";
import { userinfoService } from "../di.config";
import { jsonCodec, PrivateNatsHandler } from "../services/natsService";
import { ConnectorResponse } from "../network/config/connector";

export interface UserinfoResponse extends ConnectorResponse {
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
                    ));

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
