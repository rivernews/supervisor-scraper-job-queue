import React, { useState, useEffect } from "react";
import { Theme } from "@rmwc/theme";
import '@rmwc/theme/styles';
import { Button } from "@rmwc/button";
import '@rmwc/button/styles';
import { Switch } from "@rmwc/switch";
import '@rmwc/switch/styles';

import { apiService } from "../services/apiService";
import { KubernetesNode, SeleniumMicroservice } from "../types/k8s.types";

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
        if (!Array.isArray(apiServiceFunction)) {
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
        <Switch checked={!disablePollingState} onChange={event => setDisablePollingState(!event.currentTarget.checked) } 
            label={'Polling is ' + (disablePollingState ? 'off' : 'on')}
        />
    </div>)
}


const NodeSizeSelector = (initialValue: string, setNodeInstanceSize: React.Dispatch<React.SetStateAction<string>>) => {

    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNodeInstanceSize(event.target.value as string)
    }

    return (
        <select onChange={handleOnChange} value={initialValue}>
            <option value="MEDIUM">Medium - 4G RAM, $20</option>
            <option value="LARGE">Large - 8G RAM, $40</option>
            <option value="LARGE_16G">Large - 6CPU/16G RAM, $80</option>
            <option value="MEMORY_2CPU">Memory Optimized - 2CPU/16G RAM, $75</option>
            <option value="CPU_4CPU">CPU Optimized - 4CPU/8G RAM, $80</option>
            <option value="CPU_2CPU">CPU Optimized - 2CPU/4G RAM, $40</option>
        </select>
    )
}


export function NodeScalingPanel() {
    const [submitting, setSubmitting] = useState(false);
    const [nodes, setNodes] = useState<KubernetesNode[]>([]);
    const [disablePolling, setDisablePolling] = useState(true);
    const [nodeInstanceSize, setNodeInstanceSize] = useState<string>('MEDIUM');

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
            <Button unelevated disabled={submitting} type="button" onClick={handleClickCreateNode}>Create node</Button >
            <div>
                {createNodeResponse}
            </div>
        </div>
        <div>
            <Button unelevated danger disabled={submitting} type="button" onClick={handleClickDeleteNodes}>Delete all nodes</Button >
            <div>
                {deleteAllNodesResponse}
            </div>
        </div>


        <h2>Node Status</h2>

        {PollingToggleComponent(disablePolling, setDisablePolling)}

        <Button   disabled={submitting} type="button" onClick={handleClickListNodes}>List nodes</Button >
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
    const [provisionSeleniumHubResponse, setProvisionGetSeleniumHubResponse] = useState('--');
    const [provisionSeleniumChromeNodeResponse, setProvisionGetSeleniumChromeNodeResponse] = useState('--');
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
    const handleClickProvisionSeleniumHub = () => apiRequestHandler(
        `ProvisionSeleniumHub`,
        [apiService.asyncProvisionSeleniumMicroservice, 'hub'],
        undefined,
        setProvisionGetSeleniumHubResponse,
        setSubmitting
    );
    const handleClickProvisionSeleniumChromeNode = () => apiRequestHandler(
        `ProvisionSeleniumChromeNode`,
        [apiService.asyncProvisionSeleniumMicroservice, 'chrome-node'],
        undefined,
        setProvisionGetSeleniumChromeNodeResponse,
        setSubmitting
    );
    const handleClickDestroySelenium = () => apiRequestHandler(
        `DestroySelenium`,
        apiService.asyncDestroySeleniumMicroservice,
        undefined,
        setDestroyGetSeleniumResponse,
        setSubmitting
    );

    return (<Theme use='surface'>
        <h2>Selenium Microservices Scaling</h2>
        <h3>Hub Provision</h3>

        <Button unelevated disabled={submitting} onClick={handleClickProvisionSeleniumHub}>Provision selenium hub</Button >
        <div>{provisionSeleniumHubResponse}</div>

        <Button   disabled={submitting} onClick={handleClickProvisionSeleniumChromeNode}>Provision selenium chrome nodes</Button >
        <div>{provisionSeleniumChromeNodeResponse}</div>

        <Button danger disabled={submitting} onClick={handleClickDestroySelenium}>Destroy selenium</Button >
        <div>{destroySeleniumResponse}</div>


        <h3>Selenium Microservices Status</h3>

        {PollingToggleComponent(disablePolling, setDisablePolling)}

        <Button   disabled={submitting} onClick={handleClickGetSelenium}>Get selenium hub</Button >
        {seleniumMicroservice ? (<div>

            <h4>Hub Status</h4>
            {seleniumMicroservice.hubDeploymentResult ? (<>
                <h5>{seleniumMicroservice.hubDeploymentResult.body.metadata.name}</h5>
                {seleniumMicroservice.hubDeploymentResult.body.status.conditions.map((condition, index) => (<div key={index}>
                    <p>
                        Status: {condition.type} - {condition.message}
                    </p>
                </div>))}
            </>) : (<div>--</div>)}
            {seleniumMicroservice.serviceResult ? (<>
                <h3>{seleniumMicroservice.serviceResult.body.metadata.name}</h3>
                <div>IP: {seleniumMicroservice.serviceResult.body.spec.clusterIP}</div>
                <div>Port: {seleniumMicroservice.serviceResult.body.spec.ports.map(port => port.port)}</div>
            </>) : (<div>--</div>)}

            <h4>Chrome Node Status</h4>
            {seleniumMicroservice.chromeNodeDeploymentResult ? (<>
                <h5>{seleniumMicroservice.chromeNodeDeploymentResult.body.metadata.name}</h5>
                {seleniumMicroservice.chromeNodeDeploymentResult.body.status.conditions.map((condition, index) => (<div key={index}>
                    <p>
                        Status: {condition.type} - {condition.message}
                    </p>
                </div>))}
            </>) : (<div>--</div>)}
        </div>) : (<div>--</div>)}
    </Theme>);
}
