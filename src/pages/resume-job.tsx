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
        <RenewalJobForm onReceiveResponse={onReceiveSubmitResponse} />
    </div>;
}
