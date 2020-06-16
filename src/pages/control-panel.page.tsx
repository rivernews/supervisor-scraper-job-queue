import React, { useState } from "react";
import { Button } from "@rmwc/button";
import '@rmwc/button/styles';

import { apiService } from "../services/apiService";
import styles from "./control-panel.module.css";


export function ControlPanelPage() {
    const [submitting, setSubmitting] = useState(false);
    return <div className={styles.ControlPanelPage}>
        <h2>Control Panel</h2>

        <Button danger unelevated disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            try {
                const res = await apiService.asyncTerminateAllJobs();
                alert(JSON.stringify(res));
            } catch (error) {
                alert(JSON.stringify(error));
            }
            setSubmitting(false);
        }}>Terminate All Jobs</Button>

        <Button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            try {
                const res = await apiService.asyncResumeAllQueues();
                alert(JSON.stringify(res));
            } catch (error) {
                alert(JSON.stringify(error));
            }
            setSubmitting(false);
        }}>Resume All Jobs</Button>

        <Button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            try {
                const res = await apiService.asyncPauseAllQueues();
                alert(JSON.stringify(res));
            } catch (error) {
                alert(JSON.stringify(error));
            }
            setSubmitting(false);
        }}>Pause All Jobs</Button>

        <Button unelevated disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            try {
                const res = await apiService.asyncStartS3Job();
                alert(JSON.stringify(res));
            } catch (error) {
                alert('Error: ' + JSON.stringify(error));
            }
            setSubmitting(false);
        }}>Start S3 Job</Button>

    </div>
}
