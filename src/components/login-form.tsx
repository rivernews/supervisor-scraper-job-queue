import React from "react";
import { FormikHelpers, Formik } from "formik";
import { getNestedValueFromName } from "../utilities/formUtilities";
import { Authenticator } from "../services/authenticate";

const inputList = [
    { name: 'token', type: 'text' },
    { name: 'port', type: 'text' },
]

const formSubmit = async (values: { 'token': string, 'port': string }, { setSubmitting }: FormikHelpers<{ 'token': string, 'port': string }>) => {
    const tokenValue = values.token.trim();
    const portValue = values.port.trim();

    if (tokenValue !== '') {
        Authenticator.token = tokenValue;
    }

    if (portValue !== '') {
        Authenticator.port = portValue;
    }

    alert('Credentials stored');

    setSubmitting(false);
}

export const LoginForm = () => {
    const initialValues = {
        'token': Authenticator.token,
        'port': Authenticator.port
    }

    return <div>
        <Formik
            initialValues={initialValues}
            validate={() => {}}
            onSubmit={formSubmit}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
            }) => (
                    <form onSubmit={handleSubmit}>
                        {inputList.map((inputMeta, index) => (
                            <div
                                key={index}
                            >
                                <label>{inputMeta.name}: </label>
                                <input
                                    type={inputMeta.type}
                                    name={inputMeta.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={getNestedValueFromName(values, inputMeta.name)}
                                />
                                {getNestedValueFromName(errors, inputMeta.name) && getNestedValueFromName(touched, inputMeta.name) && getNestedValueFromName(errors, inputMeta.name)}
                            </div>
                        ))}
                        <button type="submit" disabled={isSubmitting}>
                            Store
                        </button>
                    </form>
                )}
        </Formik>
    </div>
}
