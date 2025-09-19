import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientWrapper from "@/app/components/utils/ClientWrapper";
import EnvProvider from "@/app/components/utils/EnvProvider";
import StoreProvider from "@/app/redux/provider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/assets/fonts/icomoon/styles/style.css";
import { PublicEnvProvider } from "next-runtime-env";

config.autoAddCss = false;

const IBM_PLEX_FONT = localFont({
  src: [
    {
      path: "../assets/fonts/IBMPlexSansThai-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansThai-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansThai-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansThai-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "PEA-WOM",
  description: "Work Order Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head title="PEA-WOM">
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-wom-192x192.png" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icon-wom-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${IBM_PLEX_FONT.className} ${IBM_PLEX_FONT.className} antialiased`}
      >
        <PublicEnvProvider>
          <StoreProvider>
            <EnvProvider />
            <ClientWrapper />
            {children}
          </StoreProvider>
        </PublicEnvProvider>
      </body>
    </html>
  );
}
