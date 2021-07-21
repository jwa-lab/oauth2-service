import { AuthorizeInterface } from "../../interfaces/authorize";
import * as yup from "yup";

function authorizeSchema() {
    return yup
        .object()
        .shape(
            {
                state: yup.string().required(),
                client_id: yup.string().required(),
                redirect_uri: yup.string().required(),
                scope: yup.string().required(),
                cookie: yup
                    .string()
                    .when("sessionToken", (sessionToken, passSchema) => {
                        return sessionToken
                            ? passSchema
                            : passSchema.required();
                    }),
                sessionToken: yup
                    .string()
                    .when("cookie", (cookie, passSchema) => {
                        return cookie ? passSchema : passSchema.required();
                    })
            },
            [["cookie", "sessionToken"]]
        )
        .noUnknown(true);
}

export default function AuthorizeCommand(
    payload: AuthorizeInterface
): AuthorizeInterface {
    const isValid = authorizeSchema().isValidSync(payload, { strict: true });

    if (!isValid) {
        throw new Error("Invalid parameters.");
    }

    return Object.freeze(Object.assign(Object.create(null), payload));
}
