"use client";

import { useEffect, useState } from "react";

export type LocationStatus = "idle" | "loading" | "granted" | "denied";

export interface LocationState {
  lat: string | null;
  long: string | null;
  status: LocationStatus;
}

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return { lat: null, long: null, status: "denied" };
    }
    return { lat: null, long: null, status: "loading" };
  });

  useEffect(() => {
    if (state.status !== "loading") return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: String(position.coords.latitude),
          long: String(position.coords.longitude),
          status: "granted",
        });
      },
      () => {
        setState({ lat: null, long: null, status: "denied" });
      },
    );
  }, [state.status]);

  return state;
}
