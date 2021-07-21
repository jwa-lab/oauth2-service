const TEST_USER = ({ AUTH_SERVICE_USERNAME = "", AUTH_SERVICE_PASSWORD = "" } =
    process.env);

const TEST_APP = ({
    AUTH_SERVICE_CLIENT_ID = "",
    AUTH_SERVICE_CLIENT_SECRET = ""
} = process.env);

const APP_CONFIG = {
    response_type: "code",
    scope: "profile openid offline_access",
    redirect_uri: "http://localhost:3000/auth/callback",
    state: "TEST_STATE"
};

module.exports = {
    TEST_APP,
    APP_CONFIG,
    TEST_USER
};
