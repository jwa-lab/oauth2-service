import { RefreshTokenInterface } from "../../interfaces/token";
import * as yup from "yup";

function refreshTokenSchema() {
    return yup
        .object()
        .shape({
            grant_type: yup.string().required(),
            refresh_token: yup.string().required(),
            basic_auth: yup.string().required(),
            scope: yup.string()
        })
        .noUnknown(true);
}

export default function RefreshTokenCommand(
    payload: RefreshTokenInterface
): RefreshTokenInterface {
    const isValid = refreshTokenSchema().isValidSync(payload, { strict: true });

    if (!isValid) {
        throw new Error("Invalid parameters.");
    }

    return Object.freeze(Object.assign(Object.create(null), payload));
}
