const { connect, JSONCodec, headers } = require("nats");
const { APP_CONFIG, TEST_APP, TEST_USER } = require("./config/config");
const { JEST_TIMEOUT = 20000 } = process.env;

describe("Given Auth Service is connected to NATS", () => {
    let natsConnection;
    let jsonCodec = JSONCodec();

    beforeAll(async () => {
        natsConnection = await connect();
    });

    describe("When I try to get an access and refresh token with an invalid code", () => {
        let authnResponse;
        let authorizeResponse;
        let tokenResponse;
        let natsHeaders = headers();

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

            natsHeaders.append(
                "cookie",
                JSON.parse(authnResponse.headers.get("set-cookie")).cookies[0]
            );

            authorizeResponse = await natsConnection.request(
                "auth-service.authorize",
                jsonCodec.encode({
                    client_id: TEST_APP.AUTH_SERVICE_CLIENT_ID,
                    ...APP_CONFIG
                }),
                { timeout: 6000, headers: natsHeaders }
            );
            authorizeResponse = jsonCodec.decode(authorizeResponse.data);

            tokenResponse = await natsConnection.request(
                "auth-service.token",
                jsonCodec.encode({
                    grant_type: "authorization_code",
                    code: authorizeResponse.code,
                    redirect_uri: authorizeResponse.redirect_uri,
                    client_id: TEST_APP.AUTH_SERVICE_CLIENT_ID,
                    client_secret: TEST_APP.AUTH_SERVICE_CLIENT_SECRET
                }),
                { timeout: 5000 }
            );
        });

        it("Then returns an error.", () => {
            expect(jsonCodec.decode(authorizeResponse.data).error.message).toBe(
                "INVALID_PARAMETERS"
            );
        });
    });

    afterAll(() => {
        natsConnection.close();
    });
});
