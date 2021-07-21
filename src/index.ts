import {
    drain,
    init as initNats,
    registerPrivateHandlers,
    registerPublicHandlers
} from "./nats/nats";
import { init as initDocs } from "./services/docs";
import { SERVICE_NAME } from "./config";
import { tokenPrivateHandlers } from "./private/tokenPrivateHandler";
import { tokenPublicHandlers } from "./public/tokenPublicHandler";
import { authnPrivateHandlers } from "./private/authnPrivateHandler";
import { authnPublicHandlers } from "./public/authnPublicHandler";
import { sessionPrivateHandlers } from "./private/sessionPrivateHandler";
import { sessionPublicHandlers } from "./public/sessionPublicHandler";
import { userinfoPrivateHandlers } from "./private/userinfoPrivateHandler";
import { userinfoPublicHandlers } from "./public/userinfoPublicHandler";
import { authorizePrivateHandlers } from "./private/authorizePrivateHandler";
import { authorizePublicHandlers } from "./public/authorizePublicHandler";
import { authorizeCodePublicHandlers } from "./public/authorizeCodePublicHandler";

async function start() {
    async function shutdown(exitCode: number): Promise<void> {
        try {
            await drain();
            process.exit(exitCode);
        } catch (e) {
            console.error(
                "[AIRLOCK] Unable to drain Nats connection, shutting down . . ."
            );
        } finally {
            process.exit(1);
        }
    }

    try {
        await initNats();
        await initDocs();

        registerPrivateHandlers(SERVICE_NAME, tokenPrivateHandlers);
        registerPrivateHandlers(SERVICE_NAME, authnPrivateHandlers);
        registerPrivateHandlers(SERVICE_NAME, sessionPrivateHandlers);
        registerPrivateHandlers(SERVICE_NAME, userinfoPrivateHandlers);
        registerPrivateHandlers(SERVICE_NAME, authorizePrivateHandlers);

        registerPublicHandlers(SERVICE_NAME, tokenPublicHandlers);
        registerPublicHandlers(SERVICE_NAME, authnPublicHandlers);
        registerPublicHandlers(SERVICE_NAME, sessionPublicHandlers);
        registerPublicHandlers(SERVICE_NAME, userinfoPublicHandlers);
        registerPublicHandlers(SERVICE_NAME, authorizePublicHandlers);
        registerPublicHandlers(SERVICE_NAME, authorizeCodePublicHandlers);

        process.on("SIGINT", () => {
            console.log("[OAUTH-SERVICE] Gracefully shutting down...");
            shutdown(0);
        });

        process.on("SIGTERM", () => {
            console.log("[OAUTH-SERVICE] Gracefully shutting down...");
            shutdown(0);
        });
    } catch (err) {
        console.error(`[OAUTH-SERVICE] Item Store exited with error: ${err}`);
        console.error(err);
        shutdown(1);
    }
}

start();
