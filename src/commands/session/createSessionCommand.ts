import * as yup from "yup";
import { CreateSessionInterface } from "../../interfaces/session";

function createSessionSchema() {
    return yup
        .object()
        .shape({
            sessionToken: yup.string().required()
        })
        .noUnknown(true);
}

export default function CreateSessionCommand(
    payload: CreateSessionInterface
): CreateSessionInterface {
    const isValid = createSessionSchema().isValidSync(payload, {
        strict: true
    });

    if (!isValid) {
        throw new Error("Invalid parameters.");
    }

    return Object.freeze(Object.assign(Object.create(null), payload));
}
