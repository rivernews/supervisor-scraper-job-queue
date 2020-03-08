import React, { useState } from "react";
import { apiService } from "../services/apiService";

export function ControlPanelPage() {
    const [submitting, setSubmitting] = useState(false);
    return <>
        <h2>Control Panel</h2>
        <button disabled={submitting} type="button" onClick={async () => {
            setSubmitting(true);
            await apiService.asyncTerminateAllJob();
            setSubmitting(false);
        }}>Terminate All Jobs</button>
    </>
}