const { TEST_USER } = require("./config/config");
const { connect, JSONCodec } = require("nats");
const { JEST_TIMEOUT = 20000 } = process.env;

describe("Given Auth Service is connected to NATS", () => {
    let natsConnection;
    let jsonCodec = JSONCodec();

    beforeAll(async () => {
        natsConnection = await connect();
    });

    describe("When I try to authenticate a user", () => {
        let response, authnHeaders;

        beforeAll(async () => {
            jest.setTimeout(JEST_TIMEOUT);
            response = await natsConnection.request(
                "auth-service.authn",
                jsonCodec.encode({
                    username: TEST_USER.AUTH_SERVICE_USERNAME,
                    password: TEST_USER.AUTH_SERVICE_PASSWORD
                }),
                { timeout: JEST_TIMEOUT }
            );
            authnHeaders = JSON.parse(
                response.headers.get("set-cookie")
            ).cookies;
        });

        it("Then returns a header with a session id cookie", () => {
            expect(authnHeaders).toEqual(
                expect.arrayContaining([expect.stringMatching(/^sid=[\S\w]/)])
            );
        });
    });

    afterAll(() => {
        natsConnection.close();
    });
});
