const { connect, JSONCodec, headers } = require("nats");
const { APP_CONFIG, TEST_APP, TEST_USER } = require("./config/config");
const { JEST_TIMEOUT = 20000 } = process.env;

describe("Given Auth Service is connected to NATS", () => {
    let natsConnection;
    let jsonCodec = JSONCodec();

    beforeAll(async () => {
        natsConnection = await connect();
    });

    describe("When I try to authorize a user with an invalid cookie", () => {
        let authnResponse;
        let authorizeResponse;

        beforeAll(async () => {
            jest.setTimeout(JEST_TIMEOUT);
            authnResponse = await natsConnection.request(
                "auth-service.authn",
                jsonCodec.encode({
                    username: TEST_USER.AUTH_SERVICE_USERNAME,
                    password: TEST_USER.AUTH_SERVICE_PASSWORD
                }),
                { timeout: JEST_TIMEOUT }
            );
            const natsHeaders = headers();
            natsHeaders.append("cookie", "sid=ThisIsABadCookieValue");
            authorizeResponse = await natsConnection.request(
                "auth-service.authorize",
                jsonCodec.encode({
                    client_id: TEST_APP.AUTH_SERVICE_CLIENT_ID,
                    ...APP_CONFIG
                }),
                { timeout: 6000, headers: natsHeaders }
            );
        });

        it("Then returns an error.", () => {
            expect(jsonCodec.decode(authorizeResponse.data).error.message).toBe(
                "EXPIRED_OR_INVALID_COOKIE"
            );
        });
    });

    afterAll(() => {
        natsConnection.close();
    });
});
