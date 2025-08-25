"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

export default function SyncPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleSync = async () => {
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/sync/bright-bear", { method: "POST" });
      const data = await response.json();

      if (data.success) {
        setResult(data.message || "Sync completed successfully");
      } else {
        setResult(`Error: ${data.error || "Sync failed"}`);
      }
    } catch (error: any) {
      setResult("Sync failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Event Sync</h1>
      <div className="max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
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
            onPress={handleSync}
            isLoading={loading}
            size="lg"
          >
            {loading ? "Syncing..." : "Sync Bright Bear Classes"}
          </Button>
        </div>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              result.includes("Error")
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            }`}
          >
            {result}
          </div>
        )}

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-2">Automatic Sync</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Classes are automatically synced daily at 8:00 AM via Vercel Cron.
            External events will show &ldquo;Register at Bright Bear&rdquo;
            button that links directly to their booking system.
          </p>
        </div>
      </div>
    </div>
  );
}
