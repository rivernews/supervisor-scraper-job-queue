export enum ScraperMode {
    REGULAR = 'regular',
    RENEWAL = 'renewal'
}

export interface ScraperCrossRequestData {
    orgId: string;
    orgName: string;
    lastProgress: ScraperProgressData;
    lastReviewPage: string;
    scrapeMode: ScraperMode;
};

export class ScraperCrossRequest implements ScraperCrossRequestData {
    public orgId: string;
    public orgName: string;
    public lastProgress: ScraperProgressData;
    public lastReviewPage: string;
    public scrapeMode: ScraperMode;

    constructor (props: ScraperCrossRequestData) {
        // ScraperCrossRequest.isScraperCrossRequestData(props);

        this.orgId = props.orgId;
        this.orgName = props.orgName;
        this.lastProgress = props.lastProgress;
        this.lastReviewPage = props.lastReviewPage;
        this.scrapeMode = props.scrapeMode;
    }

    // type guard in Typescript
    // https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
    public static validate (
        props: any,
    ): { [key: string]: string } | void {

        for (const classFieldName of ([
            'orgId',
            'orgName',
            // 'lastProgress', // validate in its own logic later
            'lastReviewPage',
            'scrapeMode',
        ] as Array<keyof ScraperCrossRequestData>)) {
            if (!props[classFieldName]) {
                return {
                    [classFieldName]: 'required'
                } as { [key in keyof ScraperCrossRequestData]: string };
            }
        }

        const lastProgressValidateResult = ScraperProgress.validate(props.lastProgress);

        if (lastProgressValidateResult) {
            const [lastProgressKey,] = Object.keys(lastProgressValidateResult) as Array<keyof ScraperProgressData>;
            return {
                [`lastProgress.${lastProgressKey}`]: lastProgressValidateResult[lastProgressKey]
            };
        }

        return;
    }
}

export interface ScraperProgressData {
    // used in all cases
    processed: number;
    wentThrough: number;
    total: number;

    // used in FINISH and propogate back progress to schedule cross session job
    durationInMilli: string;
    page: number;
    processedSession: number;
}

export class ScraperProgress {
    private static _validate(props: any,  classFieldName: keyof ScraperProgressData, typeName: 'number' | 'string'): { [key in keyof ScraperProgressData]: string } | void {
        if (typeof props[classFieldName] !== typeName) {
            return { [classFieldName]: 'required' } as { [key in keyof ScraperProgressData]: string };
        }
    }

    public static validate (
        props: any,
    ) {
        for (const classField of ([
            { key: 'processed', type: 'number' },
            { key: 'wentThrough', type: 'number' },
            { key: 'total', type: 'number' },
            { key: 'durationInMilli', type: 'string' },
            { key: 'page', type: 'number' },
            { key: 'processedSession', type: 'number' },
        ] as Array<{ key: keyof ScraperProgressData, 'type': 'number' | 'string' }>)) {
            const valiateResult = ScraperProgress._validate(props, classField.key, classField.type);

            if (valiateResult) {
                return valiateResult;
            }
        }

        return;
    }
}
