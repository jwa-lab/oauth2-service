import fs from "fs";
import { SERVICE_NAME } from "../config";
import { getConnection, jsonCodec } from "../nats/nats";

export async function init(): Promise<void> {
    const docs = String(fs.readFileSync("./docs/oas-docs.json"));
    let jsonDocs;

    try {
        jsonDocs = JSON.parse(docs);
    } catch (err) {
        console.error(`[${SERVICE_NAME}] Invalid docs`, err);
        throw new Error(`[${SERVICE_NAME}] Invalid docs`);
    }

    const natsConnection = getConnection();

    console.log(`[${SERVICE_NAME}] Registering docs subject`);

    const docsSubscription = natsConnection.subscribe("docs", {
        queue: SERVICE_NAME
    });

    (async () => {
        for await (const message of docsSubscription) {
            message.respond(jsonCodec.encode(jsonDocs));
        }
    })().then();
}
