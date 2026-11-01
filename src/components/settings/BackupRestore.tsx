import * as React from "react";
import { toast } from "sonner";
import { DownloadCloud, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { downloadJson } from "@/lib/utils";
import { APP_NAME, APP_VERSION } from "@/constants/app";
import type { BackupPayload } from "@/types/settings";

export function BackupRestore() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [restoring, setRestoring] = React.useState(false);

  const handleBackup = async () => {
    const [users, expenses, dailySales, financeSettings, appSettings] = await Promise.all([
      db.users.toArray(),
      db.expenses.toArray(),
      db.dailySales.toArray(),
      db.financeSettings.toArray(),
      db.appSettings.toArray(),
    ]);

    const payload: BackupPayload = {
      exportedAt: new Date().toISOString(),
      version: APP_VERSION,
      users,
      expenses,
      dailySales,
      financeSettings,
      appSettings,
    };

    downloadJson(`${APP_NAME}_Backup_${new Date().toISOString().slice(0, 10)}.json`, payload);
    toast.success("Backup downloaded");
  };

  const handleRestoreClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoring(true);
    try {
      const text = await file.text();
      const payload = JSON.parse(text) as Partial<BackupPayload>;

      if (!Array.isArray(payload.expenses)) {
        throw new Error("This file doesn't look like a valid BizPilot backup.");
      }

      await db.transaction(
        "rw",
        [db.users, db.expenses, db.dailySales, db.financeSettings, db.appSettings],
        async () => {
          if (payload.users) await db.users.bulkPut(payload.users as never[]);
          if (payload.expenses) await db.expenses.bulkPut(payload.expenses as never[]);
          if (payload.dailySales) await db.dailySales.bulkPut(payload.dailySales as never[]);
          if (payload.financeSettings) await db.financeSettings.bulkPut(payload.financeSettings as never[]);
          if (payload.appSettings) await db.appSettings.bulkPut(payload.appSettings as never[]);
        }
      );

      toast.success("Backup restored successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not restore this file.");
    } finally {
      setRestoring(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" size="sm" onClick={handleBackup}>
        <DownloadCloud className="h-3.5 w-3.5" /> Backup Data
      </Button>
      <Button variant="outline" size="sm" onClick={handleRestoreClick} disabled={restoring}>
        <UploadCloud className="h-3.5 w-3.5" /> {restoring ? "Restoring…" : "Restore Data"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
