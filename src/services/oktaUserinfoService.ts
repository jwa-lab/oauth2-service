import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { USERINFO_ENDPOINT } from "../config";
import { UserinfoServiceInterface } from "../interfaces/userinfo";
import UserinfoCommand from "../commands/userinfo/userinfoCommand";

export default class OktaUserinfoService implements UserinfoServiceInterface {
    private readonly _restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        this._restConnector = restConnector;
    }

    public async userinfo(
        userinfoCommand: UserinfoCommand
    ): Promise<ConnectorResponse> {
        const { bearerToken } = userinfoCommand;

        return this._restConnector.get(USERINFO_ENDPOINT, undefined, {
            headers: {
                authorization: bearerToken
            }
        });
    }
}
