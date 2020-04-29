import { Authenticator } from "./authenticate";
import { KubernetesNodePool } from "../types/k8s.types";

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

    private get baseUrl () {
        return process.env.NODE_ENV === 'production' ?
            this.PRODUCTION_API_SERVER_BASE_URL :
            this.developmentApiServerBaseUrl
    }

    private asyncRequest = async (endpoint: string, logPrefix: string, method: 'POST' | 'GET' | 'DELETE' = 'POST') => {
        const url = `${this.baseUrl}${endpoint}?` + new URLSearchParams({
            token: Authenticator.token
        });

        try {
            const res = await fetch(
                url, {
                    method
                }
            );

            if (res.status !== 200) {
                throw new Error(`${logPrefix} request failed: ${res.status}, ${res.statusText}`);
            } else {
                return await res.json();
            }
        } catch (error) {
            throw error;
        }
    }

    public asyncTerminateAllJobs = () => {
        return this.asyncRequest('/queues/terminate-all-jobs', 'Terminate all job');
    }

    public asyncResumeAllQueues = () => {
        return this.asyncRequest('/queues/resume-all-queues', 'Resume all queues');
    }

    public asyncPauseAllQueues = () => {
        return this.asyncRequest('/queues/pause-all-queues', 'Pause all queues');
    }

    public asyncStartS3Job = () => {
        return this.asyncRequest(`/queues/s3-orgs-job`, 'Start S3 Job');
    }

    public asyncCreateNode = () => {
        return this.asyncRequest(`/k8s/create-node`, `Create node`)
    }

    public asyncListNodes = async () => {
        const res = await this.asyncRequest(`/k8s/list-node`, `List nodes`);
        if (res.scraperWorkerNodePools) {
            const nodePools = res.scraperWorkerNodePools as KubernetesNodePool[];
            return nodePools.flatMap(np => np.nodes);
        }

        return [];
    }

    public asyncCleanNodes = () => {
        return this.asyncRequest(`/k8s/clean-node`, `Clear all nodes`);
    }

    public asyncGetSeleniumMicroservice = () => {
        return this.asyncRequest(`/k8s/selenium`, `Get selenium`, 'GET');
    }

    public asyncProvisionSeleniumMicroservice = () => {
        return this.asyncRequest(`/k8s/selenium`, `Provision selenium`, 'POST');
    }

    public asyncDestroySeleniumMicroservice = () => {
        return this.asyncRequest(`/k8s/selenium`, `Destroy selenium`, 'DELETE');
    }
}

export const apiService = ApiSevice.singleton;
