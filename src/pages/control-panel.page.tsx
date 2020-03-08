import React, { useState } from "react";
import { apiService } from "../services/apiService";

export function ControlPanelPage() {
    const [submitting, setSubmitting] = useState(false);
    return <>
        <h2>Control Panel</h2>

        <button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            const res = await apiService.asyncTerminateAllJobs();
            alert(JSON.stringify(res));
            setSubmitting(false);
        }}>Terminate All Jobs</button>

        <button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            const res = await apiService.asyncResumeAllQueues();
            alert(JSON.stringify(res));
            setSubmitting(false);
        }}>Resume All Jobs</button>

        <button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            const res = await apiService.asyncPauseAllQueues();
            alert(JSON.stringify(res));
            setSubmitting(false);
        }}>Pause All Jobs</button>

    </>
}
