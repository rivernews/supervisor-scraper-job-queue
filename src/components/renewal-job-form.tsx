import React from "react";
import { Formik, FormikValues, FormikHelpers } from 'formik';
import { ScraperCrossRequest } from "./renewal-job-types";

import styles from './renewal-job-form.module.css';

const inputList = [
    { name: 'orgId', type: 'text' },
    { name: 'orgName', type: 'text' },
    { name: 'lastProgress.processed', type: 'number' },
    { name: 'lastProgress.wentThrough', type: 'number' },
    { name: 'lastProgress.total', type: 'number' },
    { name: 'lastProgress.durationInMilli', type: 'text' },
    { name: 'lastProgress.page', type: 'number' },
    { name: 'lastProgress.processedSession', type: 'number' },
    { name: 'lastReviewPage', type: 'url' },
    
    { name: 'token', type: 'text' }
]

const initialValues = {
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
    
    'token': ''
}

const formSubmit = async (values: typeof initialValues, { setSubmitting }: FormikHelpers<typeof initialValues>) => {
    const res = await fetch((window.location.href.startsWith('https') ?
        `https://slack.api.shaungc.com/queues/single-org-renewal-job?` : 
        `http://localhost:55564/queues/single-org-renewal-job?`) + new URLSearchParams({
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
        alert('Submit success! Job number ' + json.id);
        setSubmitting(false);
        return json;
    } else {
        return res;
    }
}

const getNestedValueFromName = (values: FormikValues, name: string) => {
    const [mainField, ...subFields] = name.split('.');

    return subFields.reduce((acc, cur) => {
        if (!acc) {
            return acc;
        }
        return acc[cur];
    }, values[mainField]);
}

export interface RenewalJobFormProps {
    onReceiveResponse?: (res: any) => void
}

// https://jaredpalmer.com/formik/docs/overview
export const RenewalJobForm = (props: RenewalJobFormProps) => {
    

    return <div className={styles.renewalForm}>
        <h1>Create a Renewal Job</h1>
        <Formik
            initialValues={initialValues}
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
                        {inputList.map((inputMeta, index) => (
                            <div
                                key={index}
                                className={styles.field}
                            >
                                <label>{inputMeta.name}: </label>
                                <input
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
                        <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </form>
                )}
        </Formik>
    </div>
};
