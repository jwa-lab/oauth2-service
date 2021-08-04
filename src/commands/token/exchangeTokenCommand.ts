import { ExchangeTokenInterface } from "../../interfaces/token";
import * as yup from "yup";

function exchangeTokenSchema() {
    return yup
        .object()
        .shape({
            grant_type: yup.string().required(),
            client_id: yup.string().required(),
            client_secret: yup.string().required(),
            code: yup.string().required(),
            redirect_uri: yup.string()
        })
        .noUnknown(true);
}

export default function ExchangeTokenCommand(
    payload: ExchangeTokenInterface
): ExchangeTokenInterface {
    const isValid = exchangeTokenSchema().isValidSync(payload, {
        strict: true
    });

    if (!isValid) {
        throw new Error("Invalid parameters.");
    }

    return Object.freeze(Object.assign(Object.create(null), payload));
}
