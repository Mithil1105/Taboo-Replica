import { useEffect } from "react";
import { toast } from "sonner";

type UpdateSW = () => void;

declare global {
  interface CustomEventMap {
    "pwa-update-available": CustomEvent<{ updateSW: UpdateSW }>;
  }
}

export function PWAUpdatePrompt() {
  useEffect(() => {
    const handleUpdate = (e: CustomEvent<{ updateSW: UpdateSW }>) => {
      const updateSW = e.detail?.updateSW;
      if (typeof updateSW !== "function") return;

      toast("Update available", {
        description: "Tap to refresh.",
        action: {
          label: "Refresh",
          onClick: () => updateSW(),
        },
        duration: 8000,
      });
    };

    window.addEventListener("pwa-update-available", handleUpdate as EventListener);
    return () => window.removeEventListener("pwa-update-available", handleUpdate as EventListener);
  }, []);

  return null;
}
