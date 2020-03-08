import { FormikValues } from 'formik';

export const getNestedValueFromName = (values: FormikValues, name: string) => {
    const [mainField, ...subFields] = name.split('.');

    return subFields.reduce((acc, cur) => {
        if (!acc) {
            return acc;
        }
        return acc[cur];
    }, values[mainField]);
}