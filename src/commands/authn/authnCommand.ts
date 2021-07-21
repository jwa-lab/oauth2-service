import * as yup from "yup";
import { AuthnInterface } from "../../interfaces/authn";

function authnSchema() {
    return yup
        .object()
        .shape({
            username: yup.string().required(),
            password: yup.string().required()
        })
        .noUnknown(true);
}

export default function AuthnCommand(payload: AuthnInterface): AuthnInterface {
    const isValid = authnSchema().isValidSync(payload, { strict: true });

    if (!isValid) {
        throw new Error("Invalid parameters.");
    }

    return Object.freeze(Object.assign(Object.create(null), payload));
}
