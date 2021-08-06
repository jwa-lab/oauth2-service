const { connect, JSONCodec } = require("nats");
const { TEST_USER } = require("./config/config");
const { JEST_TIMEOUT = 20000 } = process.env;

describe("Given Auth Service is connected to NATS", () => {
    let natsConnection;
    let jsonCodec = JSONCodec();

    beforeAll(async () => {
        natsConnection = await connect();
    });

    describe("When I try to authenticate an invalid user", () => {
        let response;

        beforeAll(async () => {
            jest.setTimeout(JEST_TIMEOUT);
            response = await natsConnection.request(
                "auth-service.authn",
                jsonCodec.encode({
                    username: TEST_USER.AUTH_SERVICE_USERNAME,
                    password: "ThisIsABadPassword"
                }),
                { timeout: JEST_TIMEOUT }
            );
        });

        it("Then returns a bad request error", () => {
            expect(jsonCodec.decode(response.data).error.message).toBe(
                "AUTHENTICATION_FAILED"
            );
        });
    });

    afterAll(() => {
        natsConnection.close();
    });
});
