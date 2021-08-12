import {
    connect,
    NatsConnection,
    Subscription,
    JSONCodec,
    SubscriptionOptions,
    MsgHdrs
} from "nats";
import { NATS_URL, SERVICE_NAME } from "../config";

export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

export type PrivateNatsHandler = [
    topic: string,
    handler: (subscription: Subscription) => Promise<void>,
    options?: Omit<SubscriptionOptions, "callback">
];

export type PublicNatsHandler = [
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    topic: string,
    handler: (subscription: Subscription) => Promise<void>,
    options?: Omit<SubscriptionOptions, "callback">
];

export interface AirlockPayload {
    body: JSONValue;
    query: JSONValue;
}

export function deserialize<T>(
    serialized: Uint8Array,
    deserializer: { new (data: Record<string, never>): T },
    headers?: MsgHdrs
): T {
    const deserialized = jsonCodec.decode(serialized) as Record<never, unknown>;
    const parsedHeaders: JSONValue = {};

    if (headers) {
        for (const [key] of headers) {
            parsedHeaders[key] = headers.get(key);
        }
    }

    return new deserializer({ ...deserialized, ...(headers && parsedHeaders) });
}

let natsConnection: NatsConnection;

export async function init(): Promise<void> {
    natsConnection = await connect({
        servers: NATS_URL
    });

    console.info(
        `[${SERVICE_NAME}] Connected to Nats on ${natsConnection.getServer()}`
    );

    (async () => {
        for await (const status of natsConnection.status()) {
            console.info(`${status.type}: ${JSON.stringify(status.data)}`);
        }
    })().then();
}

export function registerPrivateHandlers(
    prefix: string,
    handlers: PrivateNatsHandler[]
): void {
    handlers.map(([subject, handler, options]) => {
        const fullSubject = `${prefix}.${subject}`;
        console.log(
            `[${SERVICE_NAME}] Registering private handler ${fullSubject}`
        );
        handler(natsConnection.subscribe(fullSubject, options));
    });
}

export function registerPublicHandlers(
    prefix: string,
    handlers: PublicNatsHandler[]
): void {
    handlers.map(([method, subject, handler, options]) => {
        const fullSubject = `${method}:${prefix}.${subject}`;
        console.log(
            `[${SERVICE_NAME}] Registering public handler ${fullSubject}`
        );
        handler(natsConnection.subscribe(fullSubject, options));
    });
}

export function drain(): Promise<void> {
    console.log(
        `[${SERVICE_NAME}] Draining connection to NATS server ${NATS_URL}`
    );
    return natsConnection.drain();
}

export function getConnection(): NatsConnection {
    return natsConnection;
}

export const jsonCodec = JSONCodec();
