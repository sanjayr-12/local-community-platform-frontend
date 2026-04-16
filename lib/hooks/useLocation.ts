"use client";

import { useEffect } from "react";
import { create } from "zustand";

export type LocationStatus =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "unsupported";

export type LocationErrorReason =
  | "insecure-context"
  | "permission-denied"
  | "position-unavailable"
  | "timeout"
  | "unsupported"
  | "unknown";

export interface LocationState {
  lat: string | null;
  long: string | null;
  accuracy: number | null;
  status: LocationStatus;
  error: string | null;
  reason: LocationErrorReason | null;
  requestLocation: (force?: boolean) => void;
}

const DESIRED_ACCURACY_METERS = 5000;
const LOCATION_SETTLE_TIMEOUT_MS = 12000;
const LOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: LOCATION_SETTLE_TIMEOUT_MS,
  maximumAge: 0,
};

const INSECURE_CONTEXT_MESSAGE =
  "Location only works on HTTPS or localhost. If you are opening the app on your phone through a local network HTTP URL, the browser will block the location prompt.";

let activeWatchId: number | null = null;
let activeTimerId: number | null = null;
let bestPosition: GeolocationPosition | null = null;
let activeRequestToken = 0;

function clearActiveTracking() {
  if (typeof window !== "undefined" && activeWatchId !== null) {
    navigator.geolocation.clearWatch(activeWatchId);
  }
  if (typeof window !== "undefined" && activeTimerId !== null) {
    window.clearTimeout(activeTimerId);
  }
  activeWatchId = null;
  activeTimerId = null;
  bestPosition = null;
}

function getGeoErrorState(
  error: GeolocationPositionError,
): Omit<LocationState, "requestLocation"> {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return {
        lat: null,
        long: null,
        accuracy: null,
        status: "denied",
        error:
          "Location access is blocked for this site. Allow it in your browser or device settings and try again.",
        reason: "permission-denied",
      };
    case error.POSITION_UNAVAILABLE:
      return {
        lat: null,
        long: null,
        accuracy: null,
        status: "denied",
        error:
          "Your device could not determine its location. Turn on location services and try again.",
        reason: "position-unavailable",
      };
    case error.TIMEOUT:
      return {
        lat: null,
        long: null,
        accuracy: null,
        status: "denied",
        error:
          "Location detection timed out. Move to an area with a better signal and try again.",
        reason: "timeout",
      };
    default:
      return {
        lat: null,
        long: null,
        accuracy: null,
        status: "denied",
        error: "Location could not be detected. Please try again.",
        reason: "unknown",
      };
  }
}

function getUnsupportedState(): Omit<LocationState, "requestLocation"> {
  return {
    lat: null,
    long: null,
    accuracy: null,
    status: "unsupported",
    error: "This browser does not support location access.",
    reason: "unsupported",
  };
}

function getInsecureContextState(): Omit<LocationState, "requestLocation"> {
  return {
    lat: null,
    long: null,
    accuracy: null,
    status: "denied",
    error: INSECURE_CONTEXT_MESSAGE,
    reason: "insecure-context",
  };
}

function getGrantedState(
  position: GeolocationPosition,
): Omit<LocationState, "requestLocation"> {
  return {
    lat: String(position.coords.latitude),
    long: String(position.coords.longitude),
    accuracy: Math.round(position.coords.accuracy),
    status: "granted",
    error: null,
    reason: null,
  };
}

const useLocationStore = create<LocationState>((set, get) => ({
  lat: null,
  long: null,
  accuracy: null,
  status: "idle",
  error: null,
  reason: null,
  requestLocation: (force = true) => {
    if (typeof window === "undefined") return;

    if (!navigator.geolocation) {
      set(getUnsupportedState());
      return;
    }

    if (!window.isSecureContext) {
      set(getInsecureContextState());
      return;
    }

    const currentStatus = get().status;
    if (currentStatus === "loading" && !force) {
      return;
    }

    activeRequestToken += 1;
    const requestToken = activeRequestToken;
    clearActiveTracking();

    set({
      lat: null,
      long: null,
      accuracy: null,
      status: "loading",
      error: null,
      reason: null,
    });

    const finalizeWithBestPosition = () => {
      if (requestToken !== activeRequestToken) return;

      const fallbackPosition = bestPosition;
      clearActiveTracking();

      if (fallbackPosition) {
        set(getGrantedState(fallbackPosition));
        return;
      }

      set({
        lat: null,
        long: null,
        accuracy: null,
        status: "denied",
        error:
          "Location detection timed out. Move to an area with a better signal and try again.",
        reason: "timeout",
      });
    };

    activeWatchId = navigator.geolocation.watchPosition(
      (position) => {
        if (requestToken !== activeRequestToken) return;

        if (
          !bestPosition ||
          position.coords.accuracy < bestPosition.coords.accuracy
        ) {
          bestPosition = position;
          set({ accuracy: Math.round(position.coords.accuracy) });
        }

        if (bestPosition.coords.accuracy <= DESIRED_ACCURACY_METERS) {
          const acceptedPosition = bestPosition;
          clearActiveTracking();
          set(getGrantedState(acceptedPosition));
        }
      },
      (error) => {
        if (requestToken !== activeRequestToken) return;

        const fallbackPosition = bestPosition;
        clearActiveTracking();

        if (fallbackPosition && error.code !== error.PERMISSION_DENIED) {
          set(getGrantedState(fallbackPosition));
          return;
        }

        set(getGeoErrorState(error));
      },
      LOCATION_OPTIONS,
    );

    activeTimerId = window.setTimeout(
      finalizeWithBestPosition,
      LOCATION_SETTLE_TIMEOUT_MS,
    );
  },
}));

export function useLocation(): LocationState {
  const location = useLocationStore();
  const status = location.status;
  const requestLocation = location.requestLocation;

  useEffect(() => {
    if (status === "idle") {
      requestLocation(false);
    }
  }, [status, requestLocation]);

  return location;
}
