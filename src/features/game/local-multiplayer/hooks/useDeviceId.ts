import { useEffect, useState } from "react";

const STORAGE_KEY = "taboo_device_id";

function createRandomId() {
  return `dev_${Math.random().toString(36).slice(2, 11)}_${Date.now().toString(36)}`;
}

export function useDeviceId(): string | null {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      setDeviceId(existing);
      return;
    }

    const next = createRandomId();
    window.localStorage.setItem(STORAGE_KEY, next);
    setDeviceId(next);
  }, []);

  return deviceId;
}

