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
                    password: "INVALID_PASSWORD"
                }),
                { timeout: JEST_TIMEOUT }
            );
        });

        it("Then returns an authentication error", () => {
            console.log(jsonCodec.decode(response.data))
            expect(jsonCodec.decode(response.data).error).toBe(
                "AUTHENTICATION_FAILED"
            );
        });
    });

    describe("When I try to authenticate with no username", () => {
        let response;

        beforeAll(async () => {
            jest.setTimeout(JEST_TIMEOUT);
            response = await natsConnection.request(
                "auth-service.authn",
                jsonCodec.encode({
                    username: "",
                    password: "SAMPLE_PASSWORD"
                }),
                { timeout: JEST_TIMEOUT }
            );
        });

        it("Then returns an username error", () => {
            console.log(jsonCodec.decode(response.data))
            expect(jsonCodec.decode(response.data).error).toBe(
                "INVALID_USERNAME"
            );
        });
    });

    describe("When I try to authenticate with no password", () => {
        let response;

        beforeAll(async () => {
            jest.setTimeout(JEST_TIMEOUT);
            response = await natsConnection.request(
                "auth-service.authn",
                jsonCodec.encode({
                    username: "SAMPLE_USERNAME",
                    password: ""
                }),
                { timeout: JEST_TIMEOUT }
            );
        });

        it("Then returns an username error", () => {
            console.log(jsonCodec.decode(response.data))
            expect(jsonCodec.decode(response.data).error).toBe(
                "INVALID_PASSWORD"
            );
        });
    });

    afterAll(() => {
        natsConnection.close();
    });
});
