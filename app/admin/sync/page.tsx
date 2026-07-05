"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AdminPage from "@/app/admin/_components/AdminPage";
import { Loader2 } from "lucide-react";

type SyncSource = "bright-bear" | "dcbp";

interface SyncResult {
  source: SyncSource;
  message: string;
  isError: boolean;
}

interface SyncStatus {
  brightBear: string | null;
  dcbp: string | null;
}

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export default function SyncPage() {
  const [loading, setLoading] = useState<SyncSource | null>(null);
  const [results, setResults] = useState<SyncResult[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  const fetchSyncStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/sync/status");
      if (response.ok) {
        const data = await response.json();
        setSyncStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch sync status:", error);
    }
  }, []);

  useEffect(() => {
    fetchSyncStatus();
  }, [fetchSyncStatus]);

  const handleSync = async (source: SyncSource) => {
    setLoading(source);
    try {
      const response = await fetch(`/api/admin/sync/${source}`, {
        method: "POST",
      });
      const data = await response.json();

      const result: SyncResult = {
        source,
        message: data.success
          ? data.message || "Sync started"
          : `Error: ${data.error || "Sync failed"}`,
        isError: !data.success,
      };

      setResults((prev) => {
        const filtered = prev.filter((r) => r.source !== source);
        return [...filtered, result];
      });

      // Refresh sync status after a delay to show updated "last synced" time
      if (data.success) {
        setTimeout(() => {
          fetchSyncStatus();
        }, 45000); // Check after 45 seconds (typical sync time)
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setResults((prev) => {
        const filtered = prev.filter((r) => r.source !== source);
        return [
          ...filtered,
          {
            source,
            message: `Sync failed: ${errorMessage}`,
            isError: true,
          },
        ];
      });
    } finally {
      setLoading(null);
    }
  };

  const getResult = (source: SyncSource) =>
    results.find((r) => r.source === source);

  return (
    <AdminPage
      title="Event Sync"
      description="Pull the latest external class schedules into your events."
    >
      <div className="max-w-2xl space-y-4">
        {/* Bright Bear Section */}
        <Card className="p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 className="font-display text-xl uppercase tracking-[0.03em] text-foreground">
              Bright Bear Yoga Classes
            </h2>
            {syncStatus && (
              <span className="shrink-0 text-sm text-muted-foreground">
                Last synced: {formatTimeAgo(syncStatus.brightBear)}
              </span>
            )}
          </div>
          <p className="mb-4 text-muted-foreground">
            Sync Aaron Curtis&apos;s classes from Bright Bear Yoga DC. This will
            fetch the latest schedule from their Momence booking system and
            update the events database.
          </p>
          <Button
            onClick={() => handleSync("bright-bear")}
            disabled={loading === "bright-bear"}
            size="lg"
          >
            {loading === "bright-bear" && <Loader2 className="animate-spin" />}
            {loading === "bright-bear"
              ? "Starting..."
              : "Sync Bright Bear Classes"}
          </Button>

          {getResult("bright-bear") && (
            <div
              className={`mt-4 rounded-lg p-4 ${
                getResult("bright-bear")?.isError
                  ? "bg-destructive/10 text-destructive"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {getResult("bright-bear")?.message}
            </div>
          )}
        </Card>

        {/* DCBP Section */}
        <Card className="p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 className="font-display text-xl uppercase tracking-[0.03em] text-foreground">
              DC Bouldering Project Classes
            </h2>
            {syncStatus && (
              <span className="shrink-0 text-sm text-muted-foreground">
                Last synced: {formatTimeAgo(syncStatus.dcbp)}
              </span>
            )}
          </div>
          <p className="mb-4 text-muted-foreground">
            Sync Aaron Curtis&apos;s yoga classes from DC Bouldering Project.
            This will fetch the latest schedule from their ZoomShift system and
            update the events database.
          </p>
          <Button
            onClick={() => handleSync("dcbp")}
            disabled={loading === "dcbp"}
            size="lg"
          >
            {loading === "dcbp" && <Loader2 className="animate-spin" />}
            {loading === "dcbp" ? "Starting..." : "Sync DCBP Classes"}
          </Button>

          {getResult("dcbp") && (
            <div
              className={`mt-4 rounded-lg p-4 ${
                getResult("dcbp")?.isError
                  ? "bg-destructive/10 text-destructive"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {getResult("dcbp")?.message}
            </div>
          )}
        </Card>

        {/* Info Section */}
        <div className="rounded-lg bg-muted p-4">
          <h3 className="mb-2 font-semibold">Automatic Sync</h3>
          <p className="text-sm text-muted-foreground">
            Classes from both venues are automatically synced daily via Vercel
            Cron. External events will show a &ldquo;Register&rdquo; button that
            links directly to each venue&apos;s booking system.
          </p>
        </div>
      </div>
    </AdminPage>
  );
}
