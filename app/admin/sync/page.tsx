"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

type SyncSource = "bright-bear" | "dcbp";

interface SyncResult {
  source: SyncSource;
  message: string;
  isError: boolean;
}

export default function SyncPage() {
  const [loading, setLoading] = useState<SyncSource | null>(null);
  const [results, setResults] = useState<SyncResult[]>([]);

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
          ? data.message || "Sync completed successfully"
          : `Error: ${data.error || "Sync failed"}`,
        isError: !data.success,
      };

      setResults((prev) => {
        const filtered = prev.filter((r) => r.source !== source);
        return [...filtered, result];
      });
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Event Sync</h1>
      <div className="max-w-2xl space-y-4">
        {/* Bright Bear Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Bright Bear Yoga Classes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sync Aaron Curtis&apos;s classes from Bright Bear Yoga DC. This will
            fetch the latest schedule from their Momence booking system and
            update the events database.
          </p>
          <Button
            color="primary"
            onPress={() => handleSync("bright-bear")}
            isLoading={loading === "bright-bear"}
            size="lg"
          >
            {loading === "bright-bear"
              ? "Syncing..."
              : "Sync Bright Bear Classes"}
          </Button>

          {getResult("bright-bear") && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                getResult("bright-bear")?.isError
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              }`}
            >
              {getResult("bright-bear")?.message}
            </div>
          )}
        </div>

        {/* DCBP Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            DC Bouldering Project Classes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sync Aaron Curtis&apos;s yoga classes from DC Bouldering Project.
            This will fetch the latest schedule from their ZoomShift system and
            update the events database.
          </p>
          <Button
            color="primary"
            onPress={() => handleSync("dcbp")}
            isLoading={loading === "dcbp"}
            size="lg"
          >
            {loading === "dcbp" ? "Syncing..." : "Sync DCBP Classes"}
          </Button>

          {getResult("dcbp") && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                getResult("dcbp")?.isError
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              }`}
            >
              {getResult("dcbp")?.message}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Automatic Sync</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Classes from both venues are automatically synced daily via Vercel
            Cron. External events will show a &ldquo;Register&rdquo; button that
            links directly to each venue&apos;s booking system.
          </p>
        </div>
      </div>
    </div>
  );
}
