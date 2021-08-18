import ConnectorInterface from "./network/config/connector";
import AxiosConnector from "./network/axiosConnector";
import OktaTokenService from "./services/oktaTokenService";
import OktaAuthnService from "./services/oktaAuthnService";
import OktaSessionService from "./services/oktaSessionService";
import OktaUserinfoService from "./services/oktaUserinfoService";
import OktaAuthorizeService from "./services/oktaAuthorizeService";

const restConnector: ConnectorInterface = new AxiosConnector();
const tokenService = new OktaTokenService(restConnector);
const authnService = new OktaAuthnService(restConnector);
const sessionService = new OktaSessionService(restConnector);
const userinfoService = new OktaUserinfoService(restConnector);
const authorizeService = new OktaAuthorizeService(restConnector);

export {
    restConnector,
    tokenService,
    authnService,
    sessionService,
    userinfoService,
    authorizeService
};
