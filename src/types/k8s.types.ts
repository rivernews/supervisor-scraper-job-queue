import { IncomingMessage } from "http";

export interface KubernetesNodePool {
    name: string;
    nodes: KubernetesNode[];
}

export interface KubernetesNode {
    id: string;
    name: string;
    status: { state: string };
}

interface KubernetesClientResponse<T> {
    response: IncomingMessage;
    body: T
}

interface KubernetesMetadata {
    name: string
}

interface KubernetesDeployment {
    metadata: KubernetesMetadata;
    status: { conditions: Array<{ type: string, message: string }> } 
}

interface KubernetesService {
    metadata: KubernetesMetadata;
    spec: { ports: Array<{port: number}>, clusterIP: string }
}

export interface SeleniumMicroservice {
    hubDeploymentResult: KubernetesClientResponse<KubernetesDeployment>;
    chromeNodeDeploymentResult: KubernetesClientResponse<KubernetesDeployment>;
    serviceResult: KubernetesClientResponse<KubernetesService>;
    errors: Error[];
}
