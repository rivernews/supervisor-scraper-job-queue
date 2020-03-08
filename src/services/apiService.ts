import { Authenticator } from "./authenticate";

class ApiSevice {
    private static _singleton: ApiSevice;

    public PRODUCTION_API_SERVER_BASE_URL = '//slack.api.shaungc.com';
    private static DEVELOPMENT_API_SERVER_BASE_URL = '//localhost';

    private constructor() {}

    public static get singleton() {
        if (!ApiSevice._singleton) {
            ApiSevice._singleton = new ApiSevice();
        }
        return ApiSevice._singleton;
    }

    public get developmentApiServerBaseUrl() {
        return `${ApiSevice.DEVELOPMENT_API_SERVER_BASE_URL}:${Authenticator.port}`
    }

    private get baseUrl() {
        return process.env.NODE_ENV === 'production' ?
            this.PRODUCTION_API_SERVER_BASE_URL :
            this.developmentApiServerBaseUrl
    }

    private async asyncPost(endpoint: string, logPrefix: string) {
        const url = `${this.baseUrl}${endpoint}?` + new URLSearchParams({
            token: Authenticator.token
        });

        try {
            const res = await fetch(
                url, {
                    method: 'POST'
                }
            )

            if (res.status !== 200) {
                console.error(res);
                throw new Error(`${logPrefix} request failed: ${res.status}, ${res.statusText}`);
            } else {
                return res.json();
            }
        } catch (error) {
            throw error;
        }
    }

    public async asyncTerminateAllJobs() {
        return await this.asyncPost('/queues/terminate-all-jobs', 'Terminate all job');
    }

    public async asyncResumeAllQueues() {
        return this.asyncPost('/queues/resume-all-queues', 'Resume all queues');
    }

    public async asyncPauseAllQueues() {
        return this.asyncPost('/queues/pause-all-queues', 'Pause all queues');
    }
}

export const apiService = ApiSevice.singleton;
