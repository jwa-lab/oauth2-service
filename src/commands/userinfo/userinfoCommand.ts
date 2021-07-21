import { UserinfoInterface } from "../../interfaces/userinfo";

import * as yup from "yup";

function userInfoSchema() {
    return yup
        .object()
        .shape({
            bearerToken: yup.string().required()
        })
        .noUnknown(true);
}

export default function UserinfoCommand(
    payload: UserinfoInterface
): UserinfoInterface {
    const isValid = userInfoSchema().isValidSync(payload, { strict: true });

    if (!isValid) {
        throw new Error("Invalid parameters.");
    }

    return Object.freeze(Object.assign(Object.create(null), payload));
}
