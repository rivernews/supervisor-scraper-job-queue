import { Authenticator } from "./authenticate";

class ApiSevice {
    private static _singleton: ApiSevice;

    private static PRODUCTION_API_SERVER_BASE_URL = 'https://slack.api.shaungc.com';
    private static DEVELOPMENT_API_SERVER_BASE_URL = 'http://localhost';

    private constructor() {}

    public static get singleton() {
        if (!ApiSevice._singleton) {
            ApiSevice._singleton = new ApiSevice();
        }
        return ApiSevice._singleton;
    }

    private getDevelopmentApiServerBaseUrl() {
        return `${ApiSevice.DEVELOPMENT_API_SERVER_BASE_URL}:${Authenticator.port}`
    }

    private get baseUrl() {
        return process.env.NODE_ENV === 'production' ?
            ApiSevice.PRODUCTION_API_SERVER_BASE_URL :
            this.getDevelopmentApiServerBaseUrl()
    }

    public async asyncTerminateAllJob() {
        const endpoint = '/queues/terminate-all-jobs';
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
                throw new Error(`Terminate all job request failed: ${res.status}, ${res.statusText}`);
            } else {
                return res.json();
            }
        } catch (error) {
            throw error;
        }
    }
}

export const apiService = ApiSevice.singleton;
