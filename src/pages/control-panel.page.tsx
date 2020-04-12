import React, { useState } from "react";
import { apiService } from "../services/apiService";

export function ControlPanelPage() {
    const [submitting, setSubmitting] = useState(false);
    return <>
        <h2>Control Panel</h2>

        <button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            try {
                const res = await apiService.asyncTerminateAllJobs();
                alert(JSON.stringify(res));
            } catch (error) {
                alert(JSON.stringify(error));
            }
            setSubmitting(false);
        }}>Terminate All Jobs</button>

        <button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            try {
                const res = await apiService.asyncResumeAllQueues();
                alert(JSON.stringify(res));
            } catch (error) {
                alert(JSON.stringify(error));
            }
            setSubmitting(false);
        }}>Resume All Jobs</button>

        <button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            try {
                const res = await apiService.asyncPauseAllQueues();
                alert(JSON.stringify(res));
            } catch (error) {
                alert(JSON.stringify(error));
            }
            setSubmitting(false);
        }}>Pause All Jobs</button>

        <button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            try {
                const res = await apiService.asyncStartS3Job();
                alert(JSON.stringify(res));
            } catch (error) {
                alert('Error: ' + JSON.stringify(error));
            }
            setSubmitting(false);
        }}>Start S3 Job</button>

    </>
}
