# OAuth2.0 Service

OAuth2.0 Interface service for the Playtix SSO.

## What is it?

An OAuth2.0 interface to authenticate users from the Okta's Playtix organization.

## How to set up the Dev environment

Required environment variable :

-   NATS_URL - *Nats server url*
-   INTERNAL_REDIRECT_URI - *Intermediate redirect url for the OAuth2.0 provider's authorization code, should be the current service url*
-   TOKEN_ENDPOINT - *OAuth2.0 provider **/token** endpoint*
-   USERINFO_ENDPOINT - *OAuth2.0 provider **/userinfo** endpoint (if any)*
-   AUTHORIZE_ENDPOINT - *OAuth2.0 provider **/authorize** endpoint*
-   AUTHN_ENDPOINT - *OAuth2.0 provider **/authn** endpoint*
-   SESSIONS_ENDPOINT - *OAuth2.0 provider **/sessions** endpoint*

For testing purposes, the required environment variables are configured for
the Okta's Playtix organization in the run file.

## How to

1. Start a **Nats**, **Airlock**, and **Authentication-service** instance. You can run the given docker compose file to start the three of them.

2. Start the service with `./run dev`, this will set up the required environment variables for Playtix.

3. Sign-in with the **/authn** endpoint to authenticate the user and create a new session.

4. Call the **/authorize** endpoint with the given user's session cookie to begin the OAuth2.0 flow. (If you are on Postman, copy the `sid` cookie and add it in the request headers with the key `Cookie` and the value `sid=MY_COOKIE_VALUE`)

5. Exchange the given authorization code at the **/token** endpoint to receive an access token, a refresh token and the default user's data.

6. You can now use the user's access token, and the refresh token in your app.
