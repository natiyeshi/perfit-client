import axios from "axios";
import { spawn } from "child_process";

export const getLists = async (token, length = 1) => {
    const form = new URLSearchParams();
    form.append("start", "0");
    form.append("length", length.toString());
    form.append("search[value]", "");
    form.append("draw", "0");
    form.append("submoduleTypeCode", "MDCN");
    form.append("userId", "14448");

    const columns = [
        "id", "importPermitNumber", "applicationId", "importPermitStatusCode",
        "requestedDate", "importPermitStatusDisplayName", "performaInvoiceNumber",
        "assignedUser", "portOfEntrySH", "supplierName", "agentName",
        "submissionDate", "decisionDate", "amount"
    ];

    columns.forEach((col, i) => {
        form.append(`columns[${i}][data]`, col);
        form.append(`columns[${i}][orderable]`, "true");
        form.append(`columns[${i}][searchable]`, "true");
    });

    try {
        const response = await axios.post(
            "https://api.eris.efda.gov.et/api/ImportPermit/List",
            form,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        console.log("✅ EFDA API Response:");
        const data = response.data;
        return data;
    } catch (error) {
        const status = error.response?.status
        if (status == 401) {
            throw Error("Token Expired")
        }
        if (error.response) {
            console.error("❌ EFDA API Error:", error.response.data);
        } else {
            console.error("❌ Request Error:", error.message);
        }
    }
    return null;
}

// Copy text to Windows clipboard using clip.exe
const copyToClipboard = (text) => {
    return new Promise((resolve, reject) => {
        const proc = spawn("clip");
        proc.on("error", reject);
        proc.stdin.write(text);
        proc.stdin.end();
        proc.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`clip exited with code ${code}`));
        });
    });
};

;(async () => {
    const d = await getLists("eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE3NjEyMjM2ODMsImV4cCI6MTc2MTMxMDA4MywiaXNzIjoiaHR0cHM6Ly9pZC5lcmlzLmVmZGEuZ292LmV0IiwiYXVkIjoiaHR0cHM6Ly9pZC5lcmlzLmVmZGEuZ292LmV0L3Jlc291cmNlcyIsImNsaWVudF9pZCI6ImVyaXMtcG9ydGFsLXNwYSIsInN1YiI6IjA5NzA0MTM5NDYiLCJhdXRoX3RpbWUiOjE3NjEyMjM2ODEsImlkcCI6ImxvY2FsIiwicGhvbmVfbnVtYmVyIjoiOTcwNDEzOTQ2IiwiZW1haWwiOiJhdHR0MjAwN0BnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiQW50ZW5laCBUYXllIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9wcmltYXJ5c2lkIjoiMTQ0NDgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDk3MDQxMzk0NiIsInVzZXJJZCI6IjE0NDQ4IiwiYnJhbmNoSWQiOiIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJJUCBBcHBsaWNhbnQiLCJyb2xlQ29kZXMiOiJJUEEiLCJqdGkiOiJFNzMzQjk4QjlFQzM0ODgwMzdCNjIzMUIyREFENEQxRCIsInNpZCI6IjBCRkVGNkMwMDM0NEY5OUM2M0JEMjExQ0MxOEUyREYxIiwiaWF0IjoxNzYxMjIzNjgzLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIl0sImFtciI6WyJwd2QiXX0.VG57gdvdP99OsVqzL9-G80Thtzh9PB07mCbgsfo6-Eml8yMIjvyvyXrrTa4i-f4tKeGFyl6PP54hyPciCmeOEVlbLxJU0Zlh6HRmyQO0g4xtLucdSO9ppQ_mHJp0wz93excn68Qio9WSOa2Ic6e3xZhjGRETG1BKKh1HV-ga5GrtjRO0GwPiMmLMfgbHJ-hGHI6IZ0mvx-0blpAW8T7HT4Gfjjzq3ClbpNMtHHAe3sWgOK3-5TxllR0upOE--NeKd5AKXAtqxDrPZkoIfKRtUoYVn_RKevVmG2kOqEFxbOCh8liuAu6kluzEvYWJXOHrI9SZpwe8tWtoLXJ00VPmrQ");
    if (d) {
        await copyToClipboard(typeof d === "string" ? d : JSON.stringify(d, null, 2));
    }
})().catch(err => console.error(err));