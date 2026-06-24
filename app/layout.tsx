import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Durst Solutions | Websites, Automation & AI Solutions",
    template: "%s | Durst Solutions",
  },
  description: site.description,
  openGraph: {
    title: "Durst Solutions",
    description: site.description,
    url: site.url,
    siteName: "Durst Solutions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}