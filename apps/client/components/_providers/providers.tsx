"use client";
import React from "react";
import WagmiProvider from "./WagmiProvider";

interface ProviderType {
  children: React.ReactNode;
}

function Providers({ children }: ProviderType) {
  return <WagmiProvider>{children}</WagmiProvider>;
}

export default Providers;
