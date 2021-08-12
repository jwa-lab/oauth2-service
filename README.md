# OAuth2.0 Service

OAuth2.0 Interface service for the Playtix SSO.

## What is it?

An OAuth2.0 interface to authenticate users from the Okta's Playtix organization.

## How to set up the Dev environment

Required environment variable :

- NATS_URL - _Nats server url_
- INTERNAL_REDIRECT_URI - _Intermediate redirect url for the OAuth2.0 provider's authorization code, should be the current service url_
- TOKEN_ENDPOINT - _OAuth2.0 provider **/token** endpoint_
- USERINFO_ENDPOINT - _OAuth2.0 provider **/userinfo** endpoint (if any)_
- AUTHORIZE_ENDPOINT - _OAuth2.0 provider **/authorize** endpoint_
- AUTHN_ENDPOINT - _OAuth2.0 provider **/authn** endpoint_
- SESSIONS_ENDPOINT - - _OAuth2.0 provider **/sessions** endpoint_

For testing purposes, the required environment variables are configured for
the Okta's Playtix organization in the run file.

## How to

1. Start a **Nats**, **Airlock**, and **Authentication-service** instance. You can run the given docker compose file to start the three of them.

2. Start the service with ```./run dev```, this will set up the required environment variables for Playtix.

2. Sign-in with the **/authn** endpoint to authenticate the user and create a new session.

3. Call the **/authorize** endpoint with the given user's session cookie to begin the OAuth2.0 flow. (If you are on Postman, copy the ```sid``` cookie and add it in the request headers with the key ```Cookie``` and the value ```sid=MY_COOKIE_VALUE```)

4. Exchange the given authorization code at the **/token** endpoint to receive an access token, a refresh token and the default user's data.

5. You can now use the user's access token, and the refresh token in your app.