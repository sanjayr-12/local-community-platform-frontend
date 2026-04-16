"use client";

import { useCallback, useEffect, useState } from "react";

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
  status: LocationStatus;
  error: string | null;
  reason: LocationErrorReason | null;
  requestLocation: () => void;
}

const LOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

const INSECURE_CONTEXT_MESSAGE =
  "Location only works on HTTPS or localhost. If you are opening the app on your phone through a local network HTTP URL, the browser will block the location prompt.";

function getGeoErrorState(error: GeolocationPositionError): Omit<LocationState, "requestLocation"> {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return {
        lat: null,
        long: null,
        status: "denied",
        error:
          "Location access is blocked for this site. Allow it in your browser or device settings and try again.",
        reason: "permission-denied",
      };
    case error.POSITION_UNAVAILABLE:
      return {
        lat: null,
        long: null,
        status: "denied",
        error:
          "Your device could not determine its location. Turn on location services and try again.",
        reason: "position-unavailable",
      };
    case error.TIMEOUT:
      return {
        lat: null,
        long: null,
        status: "denied",
        error:
          "Location detection timed out. Move to an area with a better signal and try again.",
        reason: "timeout",
      };
    default:
      return {
        lat: null,
        long: null,
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
    status: "unsupported",
    error: "This browser does not support location access.",
    reason: "unsupported",
  };
}

function getInsecureContextState(): Omit<LocationState, "requestLocation"> {
  return {
    lat: null,
    long: null,
    status: "denied",
    error: INSECURE_CONTEXT_MESSAGE,
    reason: "insecure-context",
  };
}

export function useLocation(): LocationState {
  const [state, setState] = useState<Omit<LocationState, "requestLocation">>(() => {
    if (typeof window === "undefined") {
      return {
        lat: null,
        long: null,
        status: "idle",
        error: null,
        reason: null,
      };
    }

    if (!navigator.geolocation) {
      return getUnsupportedState();
    }

    if (!window.isSecureContext) {
      return getInsecureContextState();
    }

    return {
      lat: null,
      long: null,
      status: "loading",
      error: null,
      reason: null,
    };
  });

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!navigator.geolocation) {
      setState(getUnsupportedState());
      return;
    }

    if (!window.isSecureContext) {
      setState(getInsecureContextState());
      return;
    }

    setState((previous) => ({
      ...previous,
      status: "loading",
      error: null,
      reason: null,
    }));
  }, []);

  useEffect(() => {
    if (state.status !== "loading") return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: String(position.coords.latitude),
          long: String(position.coords.longitude),
          status: "granted",
          error: null,
          reason: null,
        });
      },
      (error) => {
        setState(getGeoErrorState(error));
      },
      LOCATION_OPTIONS,
    );
  }, [state.status]);

  return {
    ...state,
    requestLocation,
  };
}
