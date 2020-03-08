import React, { useState } from "react";
import { RenewalJobForm } from "../components/renewal-job-form";

export function ResumeJob() {
    const [responseDisplay, setResponseDisplay] = useState({});

    const onReceiveSubmitResponse = (res: any) => {
        setResponseDisplay(res);
    }

    return <div>
        {Object.keys(responseDisplay).length !== 0 && <div>
            {JSON.stringify(responseDisplay, null, 4)}
        </div>}
        <h1>Create a New or Renewal Job</h1>
        <RenewalJobForm onReceiveResponse={onReceiveSubmitResponse} />

    </div>;
}
