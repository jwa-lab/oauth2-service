import { SERVICE_NAME } from "./config";
import {
    drain,
    init as initNats,
    registerPrivateHandlers,
    registerPublicHandlers
} from "./nats/nats";
import { authnPrivateHandlers } from "./private/authnPrivateHandler";
import { authorizePrivateHandlers } from "./private/authorizePrivateHandler";
import { sessionPrivateHandlers } from "./private/sessionPrivateHandler";
import { tokenPrivateHandlers } from "./private/tokenPrivateHandler";
import { userinfoPrivateHandlers } from "./private/userinfoPrivateHandler";
import { authnPublicHandlers } from "./public/authnPublicHandler";
import { authorizeCodePublicHandlers } from "./public/authorizeCodePublicHandler";
import { authorizePublicHandlers } from "./public/authorizePublicHandler";
import { sessionPublicHandlers } from "./public/sessionPublicHandler";
import { tokenPublicHandlers } from "./public/tokenPublicHandler";
import { userinfoPublicHandlers } from "./public/userinfoPublicHandler";
import { init as initDocs } from "./services/docs";

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
