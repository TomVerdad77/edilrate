"use client";

import { useEffect } from "react";

export default function ProViewTracker() {
  useEffect(() => {
    const umami = (
      window as typeof window & {
        umami?: {
          track: (
            event: string,
            data?: Record<string, string | number | boolean>
          ) => void;
        };
      }
    ).umami;

    umami?.track("pro_view");
  }, []);

  return null;
}