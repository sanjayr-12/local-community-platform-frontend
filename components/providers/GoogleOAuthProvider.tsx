"use client";

import { GoogleOAuthProvider as Provider } from "@react-oauth/google";
import React from "react";

interface GoogleOAuthProviderProps {
  children: React.ReactNode;
}

export default function GoogleOAuthProvider({
  children,
}: GoogleOAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return <Provider clientId={clientId}>{children}</Provider>;
}
