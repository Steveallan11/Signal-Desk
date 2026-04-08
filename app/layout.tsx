import type { ReactNode } from "react";
import "./globals.css";
import { dmMono, syne, ibmPlexMono, ibmPlexSerif, playfair } from "@/lib/fonts";

export const metadata = {
  title: "Signal Desk Mission Control",
  description: "Lawful, evidence-backed case operations for Signal Desk",
  metadataBase: new URL("https://signaldesk.co.uk"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0c10",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={[
        dmMono.variable,
        syne.variable,
        ibmPlexMono.variable,
        ibmPlexSerif.variable,
        playfair.variable,
      ].join(" ")}
    >
      <body>{children}</body>
    </html>
  );
}
