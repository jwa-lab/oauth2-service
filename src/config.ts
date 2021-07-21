const SERVICE_NAME = "auth-service";

const {
    NATS_URL = "nats://localhost:4222",
    INTERNAL_REDIRECT_URI = "http://localhost:8000/auth/auth-service/authorize_code",
    TOKEN_ENDPOINT = "a",
    USERINFO_ENDPOINT = "a",
    AUTHORIZE_ENDPOINT = "a",
    AUTHN_ENDPOINT = "a",
    SESSIONS_ENDPOINT = "a"
} = process.env;

const HANDLERS_SUBJECTS = {
    TOKEN: "token",
    AUTHN: "authn",
    SESSION: "sessions",
    USERINFO: "userinfo",
    AUTHORIZE: "authorize",
    AUTHORIZE_CODE: "authorize_code"
};

if (!NATS_URL) {
    throw new Error(
        `Please provide a valid NATS_URL so the service can connect to NATS. 
        For example, use nats://nats:4222`
    );
}

if (!INTERNAL_REDIRECT_URI) {
    throw new Error(
        `Please provide an internal redirect uri as INTERNAL_REDIRECT_URI to 
        intercept the authorization code sent from the authorization server.`
    );
}

if (!TOKEN_ENDPOINT) {
    throw new Error(`Please provide a token endpoint with TOKEN_ENDPOINT.`);
}

if (!USERINFO_ENDPOINT) {
    throw new Error(
        `Please provide a user info endpoint with USERINFO_ENDPOINT.`
    );
}

if (!AUTHORIZE_ENDPOINT) {
    throw new Error(
        `Please provide an authorize endpoint with AUTHORIZE_ENDPOINT.`
    );
}

if (!AUTHN_ENDPOINT) {
    throw new Error(
        `Please provide an authentication endpoint with AUTHN_ENDPOINT.`
    );
}

if (!SESSIONS_ENDPOINT) {
    throw new Error(
        `Please provide a session endpoint with SESSIONS_ENDPOINT.`
    );
}

export {
    SERVICE_NAME,
    NATS_URL,
    HANDLERS_SUBJECTS,
    INTERNAL_REDIRECT_URI,
    TOKEN_ENDPOINT,
    AUTHN_ENDPOINT,
    USERINFO_ENDPOINT,
    SESSIONS_ENDPOINT,
    AUTHORIZE_ENDPOINT
};
