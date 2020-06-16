import React from "react";
import { Formik, FormikHelpers } from 'formik';
import { TextField } from "@rmwc/textfield";
import '@rmwc/textfield/styles';
import { Button } from "@rmwc/button";
import '@rmwc/button/styles';

import { ScraperCrossRequest } from "./renewal-job-types";
import { getNestedValueFromName } from "../utilities/formUtilities";
import styles from './renewal-job-form.module.css';
import { Authenticator } from "../services/authenticate";

const tokenCacheKey = 'supervisor-scraper-job-queue:renewal-job-form:token';

const inputList = [
    { name: 'orgInfo', type: 'text' },
    { name: 'orgId', type: 'text' },
    { name: 'orgName', type: 'text' },
    { name: 'lastProgress.processed', type: 'number' },
    { name: 'lastProgress.wentThrough', type: 'number' },
    { name: 'lastProgress.total', type: 'number' },
    { name: 'lastProgress.durationInMilli', type: 'text' },
    { name: 'lastProgress.page', type: 'number' },
    { name: 'lastProgress.processedSession', type: 'number' },
    { name: 'lastReviewPage', type: 'url' },

    { name: 'port', type: 'text' },
    { name: 'token', type: 'text' }
]

const initialValues = {
    'orgInfo': '',
    'orgId': '1138',
    'orgName': 'Apple',
    'lastProgress': {
        'processed': 4413,
        'wentThrough': 4610,
        'total': 15407,
        'durationInMilli': '5430000',
        'page': 461,
        'processedSession': 3
    },
    'lastReviewPage': 'https://www.glassdoor.com/Reviews/Apple-Reviews-E1138_P461.htm',
    'scrapeMode': 'renewal',
    
    'port': Authenticator.port,
    'token': Authenticator.token
}

const formSubmit = async (values: typeof initialValues, { setSubmitting }: FormikHelpers<typeof initialValues>) => {
    const res = await fetch((window.location.href.startsWith('https') ?
        `https://slack.api.shaungc.com/queues/single-org-renewal-job?` : 
        `http://localhost:${values.port}/queues/single-org-renewal-job?`) + new URLSearchParams({
        'token': values.token
    }), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
    });

    if (res.status === 200) {
        const json = await res.json();

        localStorage.setItem(tokenCacheKey, values.token);

        setSubmitting(false);
        return json;
    } else {
        alert('Submit failed!')
        return res;
    }
}



export interface RenewalJobFormProps {
    onReceiveResponse?: (res: any) => void
}

// https://jaredpalmer.com/formik/docs/overview
export const RenewalJobForm = (props: RenewalJobFormProps) => {
    return <div className={styles.renewalForm}>
        <h2>Create a New or Renewal Job</h2>

        <Formik
            initialValues={{
                ...initialValues,
                token: Authenticator.token,
                port: Authenticator.port
            }}
            validate={values => {
                const formValidateResult = ScraperCrossRequest.validate(values);
                return formValidateResult;
            }}
            onSubmit={async (values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) => {
                const res = await formSubmit(values, helpers);
                props.onReceiveResponse && props.onReceiveResponse(res);
            }}
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
                        <Button unelevated className={styles.submitButton} type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                        {inputList.map((inputMeta, index) => (
                            <div
                                key={index}
                                className={styles.field}
                            >
                                <TextField
                                    label={inputMeta.name}
                                    className={styles.input}
                                    type={inputMeta.type}
                                    name={inputMeta.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={getNestedValueFromName(values, inputMeta.name)}
                                />
                                {getNestedValueFromName(errors, inputMeta.name) && getNestedValueFromName(touched, inputMeta.name) && getNestedValueFromName(errors, inputMeta.name)}
                            </div>
                        ))}
                        <Button unelevated className={styles.submitButton} type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                    </form>
                )}
        </Formik>
    </div>
};
