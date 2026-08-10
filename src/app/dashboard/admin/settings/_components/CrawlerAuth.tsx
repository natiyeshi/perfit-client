"use client";

import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ExternalLink, KeyRound, RefreshCw, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type CrawlerStatus = {
  authenticated: boolean;
  expiresAt: string | null;
  updatedAt: string | null;
  needsRefresh: boolean;
};

const ERIS_LOGIN_URL = "https://id.eris.efda.gov.et/account/login";
const TOKEN_SNIPPET = `(() => {
  const stores = [localStorage, sessionStorage];
  for (const store of stores) {
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      if (!key || !key.startsWith("oidc.user:")) continue;
      const raw = store.getItem(key);
      if (!raw) continue;
      const token = JSON.parse(raw).access_token;
      if (token) {
        copy(token);
        return "ERIS token copied";
      }
    }
  }
  throw new Error("ERIS token not found");
})()`;

const formatDate = (value: string | null) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

const CrawlerAuth = () => {
  const [status, setStatus] = useState<CrawlerStatus | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const statusLabel = useMemo(() => {
    if (!status) return "Checking";
    if (status.authenticated) return "Authenticated";
    return "Needs token";
  }, [status]);

  const loadStatus = async () => {
    const res = await axios.get<CrawlerStatus>("/import-sync/auth/status");
    setStatus(res.data);
  };

  useEffect(() => {
    loadStatus().catch(() => toast.error("Could not load crawler auth status"));
  }, []);

  useEffect(() => {
    if (!status?.needsRefresh) return;

    const autoOpenKey = "eris-crawler-auth-auto-opened";
    if (sessionStorage.getItem(autoOpenKey)) return;

    sessionStorage.setItem(autoOpenKey, "true");
    window.open(ERIS_LOGIN_URL, "_blank", "noopener,noreferrer");
  }, [status?.needsRefresh]);

  const openEris = () => {
    window.open(ERIS_LOGIN_URL, "_blank", "noopener,noreferrer");
  };

  const copySnippet = async () => {
    await navigator.clipboard.writeText(TOKEN_SNIPPET);
    toast.success("Token helper copied");
  };

  const saveToken = async () => {
    if (!token.trim()) {
      toast.error("Paste the ERIS token first");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<CrawlerStatus & { message: string }>(
        "/import-sync/auth/token",
        { token }
      );
      setStatus(res.data);
      setToken("");
      toast.success("Crawler token saved");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Could not save token");
    } finally {
      setLoading(false);
    }
  };

  const clearToken = async () => {
    setLoading(true);
    try {
      const res = await axios.delete<CrawlerStatus>("/import-sync/auth/token");
      setStatus(res.data);
      toast.success("Crawler token cleared");
    } catch {
      toast.error("Could not clear token");
    } finally {
      setLoading(false);
    }
  };

  const syncNow = async () => {
    setSyncing(true);
    try {
      const res = await axios.get("/import-sync?len=40");
      toast.success(
        `Synced ${res.data.syncedCount || 0}, skipped ${res.data.skippedCount || 0}`
      );
      await loadStatus();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Import sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="mx-6 mt-6 border border-gray-200 bg-white p-4 text-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">ERIS crawler auth</div>
          <div className="mt-1 text-xs text-gray-500">
            {statusLabel} · Expires {formatDate(status?.expiresAt || null)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={openEris}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open ERIS
          </Button>
          <Button type="button" variant="outline" onClick={copySnippet}>
            <KeyRound className="mr-2 h-4 w-4" />
            Copy helper
          </Button>
          <Button type="button" variant="outline" onClick={syncNow} disabled={syncing}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {syncing ? "Syncing" : "Sync now"}
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <textarea
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste ERIS access token"
          className="min-h-24 w-full resize-y border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
        />
        <Button type="button" onClick={saveToken} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          Save token
        </Button>
        <Button type="button" variant="outline" onClick={clearToken} disabled={loading}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Updated {formatDate(status?.updatedAt || null)}
      </div>
    </div>
  );
};

export default CrawlerAuth;
