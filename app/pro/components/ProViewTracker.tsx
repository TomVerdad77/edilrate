"use client";

import { useEffect } from "react";

type UmamiWindow = typeof window & {
  umami?: {
    track: (
      event: string,
      data?: Record<string, string | number | boolean>
    ) => void;
  };
};

export default function ProViewTracker() {
  useEffect(() => {
    let attempts = 0;

    const interval = window.setInterval(() => {
      const umami = (window as UmamiWindow).umami;

      if (umami) {
        umami.track("pro_view");
        window.clearInterval(interval);
        return;
      }

      attempts += 1;

      if (attempts >= 20) {
        window.clearInterval(interval);
      }
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return null;
}