import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { KubernetesNode, SeleniumMicroservice, NodeInstanceSize, } from "../types/k8s.types";

export function NodeScalingPage() {
    return (<>
        {NodeScalingPanel()}

        {SeleniumMicroserviceScalingPanel()}
    </>)
}

const apiRequestHandler = async (
    actionName: string,
    apiServiceFunction: (() => Promise<any>) | [(...args: any[]) => Promise<any>, ...any[]],
    setStateFunction?: React.Dispatch<React.SetStateAction<any>>,
    setResponseFunction?: React.Dispatch<React.SetStateAction<string>>,
    setSubmitting?: (value: boolean) => void
) => {
    const timestamp = new Date();
    setSubmitting && setSubmitting(true);
    try {
        let resultObjects: any;
        if (!Array.isArray(apiServiceFunction) ) {
            resultObjects = await apiServiceFunction();
        } else {
            const [apiServiceFunc, ...apiServiceFuncArgs] = apiServiceFunction;
            resultObjects = await apiServiceFunc(...apiServiceFuncArgs);
        }
        console.log(actionName, resultObjects);
        setStateFunction && setStateFunction(resultObjects);
        setResponseFunction && setResponseFunction(`${actionName} Status: OK ${JSON.stringify(resultObjects)} -- ${timestamp}`);
    } catch (error) {
        if (setResponseFunction) {
            let errorMessage = '';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = JSON.stringify(error);
            }

            setResponseFunction(`Error: ` + errorMessage + ` -- ${timestamp}`);
        }
    } finally {
        setSubmitting && setSubmitting(false);
    }
}

const polling = (
    disabled: boolean,
    actionName: string,
    apiServiceFunction: () => Promise<any>,
    setStateFunction?: React.Dispatch<React.SetStateAction<any>>,
    setResponseFunction?: React.Dispatch<React.SetStateAction<string>>,
    setSubmitting?: (value: boolean) => void,
) => {
    return () => {
        if (disabled) {
            return;
        }

        const pollingScheduler = setInterval(() => {
            return apiRequestHandler(
                actionName,
                apiServiceFunction,
                setStateFunction,
                setResponseFunction,
                setSubmitting
            )
        }, 5000)

        // need to return a func for handling unmount
        // https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
        return () => clearInterval(pollingScheduler);
    }
}


const PollingToggleComponent = (
    disablePollingState: boolean,
    setDisablePollingState: React.Dispatch<React.SetStateAction<boolean>>
) => {
    return (<div>
        <button onClick={() => setDisablePollingState(!disablePollingState)}>Toggle polling</button>
        <span>Polling is {disablePollingState ? 'off' : 'on'}</span>
    </div>)
}


const NodeSizeSelector = (initialValue: NodeInstanceSize, setNodeInstanceSize: React.Dispatch<React.SetStateAction<NodeInstanceSize>>) => {

    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNodeInstanceSize(event.target.value as NodeInstanceSize)
    }

    return (
        <select onChange={handleOnChange} value={initialValue}>
            <option value="MEDIUM">Medium - 4G RAM</option>
            <option value="LARGE">Large - 8G RAM</option>
        </select>
    )
}


export function NodeScalingPanel() {
    const [submitting, setSubmitting] = useState(false);
    const [nodes, setNodes] = useState<KubernetesNode[]>([]);
    const [disablePolling, setDisablePolling] = useState(true);
    const [nodeInstanceSize, setNodeInstanceSize] = useState<NodeInstanceSize>('MEDIUM');

    const [createNodeResponse, setCreateNodeResponse] = useState('--');
    const [deleteAllNodesResponse, setDeleteAllNodesResponse] = useState('--');
    const [listNodesResponse, setListNodesResponse] = useState('--');

    useEffect(polling(
        disablePolling,
        `ListNode`,
        apiService.asyncListNodes,
        setNodes,
        setListNodesResponse,
        setSubmitting
    ), [disablePolling]);

    // UI handler

    const handleClickListNodes = () => {
        return apiRequestHandler(
            `ListNode`,
            apiService.asyncListNodes,
            setNodes,
            setListNodesResponse,
            setSubmitting
        )
    }

    const handleClickCreateNode = () => {
        return apiRequestHandler(
            `CreateNode`,
            [apiService.asyncCreateNode, nodeInstanceSize],
            undefined,
            setCreateNodeResponse,
            setSubmitting
        );
    }

    const handleClickDeleteNodes = () => {
        return apiRequestHandler(
            `DeleteNodes`,
            apiService.asyncCleanNodes,
            undefined,
            setDeleteAllNodesResponse,
            setSubmitting
        );
    }

    return <>
        <h2>Node Scaling</h2>
        <div>
            <div>{NodeSizeSelector(nodeInstanceSize, setNodeInstanceSize)}</div>
            <button disabled={submitting} type="button" onClick={handleClickCreateNode}>Create node</button>
            <div>
                {createNodeResponse}
            </div>
        </div>
        <div>
            <button disabled={submitting} type="button" onClick={handleClickDeleteNodes}>Delete all nodes</button>
            <div>
                {deleteAllNodesResponse}
            </div>
        </div>


        <h2>Node Status</h2>

        {PollingToggleComponent(disablePolling, setDisablePolling)}

        <button disabled={submitting} type="button" onClick={handleClickListNodes}>List nodes</button>
        <div>
            {listNodesResponse}
        </div>

        {nodes.length === 0 ? (<div>No scraper worker node.</div>) : nodes.map((node, index) => {
            return !node ? (<div key={index}><h3>(Null)</h3> {JSON.stringify(node)}</div>) : (
                <div key={index} >
                    <h3>{node.name || '(No name)'}</h3>
                    <div>State: {node.status ? node.status.state : JSON.stringify(node)}</div>
                    <div><em>Payload: {JSON.stringify(node)}</em></div>
                </div>
            );
        })}
    </>
}

export const SeleniumMicroserviceScalingPanel = () => {
    const [submitting, setSubmitting] = useState(false);
    const [seleniumMicroservice, setSeleniumMicroservice] = useState<SeleniumMicroservice | undefined>(undefined);
    const [provisionSeleniumResponse, setProvisionGetSeleniumResponse] = useState('--');
    const [destroySeleniumResponse, setDestroyGetSeleniumResponse] = useState('--');
    const [disablePolling, setDisablePolling] = useState(true);

    useEffect(polling(
        disablePolling,
        `GetSelenium`,
        apiService.asyncGetSeleniumMicroservice,
        setSeleniumMicroservice,
        undefined,
        setSubmitting
    ), [disablePolling]);

    const handleClickGetSelenium = () => {
        return apiRequestHandler(
            `GetSelenium`,
            apiService.asyncGetSeleniumMicroservice,
            setSeleniumMicroservice,
            undefined,
            setSubmitting
        );
    };
    const handleClickProvisionSelenium = () => apiRequestHandler(
        `ProvisionSelenium`,
        apiService.asyncProvisionSeleniumMicroservice,
        undefined,
        setProvisionGetSeleniumResponse,
        setSubmitting
    );
    const handleClickDestroySelenium = () => apiRequestHandler(
        `DestroySelenium`,
        apiService.asyncDestroySeleniumMicroservice,
        undefined,
        setDestroyGetSeleniumResponse,
        setSubmitting
    );

    return (<>
        <h2>Selenium Scaling</h2>

        <button disabled={submitting} onClick={handleClickProvisionSelenium}>Provision selenium</button>
        <div>{provisionSeleniumResponse}</div>

        <button disabled={submitting} onClick={handleClickDestroySelenium}>Destroy selenium</button>
        <div>{destroySeleniumResponse}</div>


        <h2>Selenium Status</h2>

        {PollingToggleComponent(disablePolling, setDisablePolling)}

        <button disabled={submitting} onClick={handleClickGetSelenium}>Get selenium</button>
        {seleniumMicroservice && (seleniumMicroservice.deploymentResult && seleniumMicroservice.serviceResult) ? (<div>
            {seleniumMicroservice.deploymentResult && (<>
                <h3>{seleniumMicroservice.deploymentResult.body.metadata.name}</h3>
                {seleniumMicroservice.deploymentResult.body.status.conditions.map((condition, index) => (<div key={index}>
                    <p>
                        Status: {condition.type} - {condition.message}
                    </p>
                </div>))}
            </>)}

            {seleniumMicroservice.serviceResult && (<>
                <h3>{seleniumMicroservice.serviceResult.body.metadata.name}</h3>
                <div>IP: {seleniumMicroservice.serviceResult.body.spec.clusterIP}</div>
                <div>Port: {seleniumMicroservice.serviceResult.body.spec.ports.map(port => port.port)}</div>
            </>)}
        </div>) : (<div>--</div>)}
    </>);
}
