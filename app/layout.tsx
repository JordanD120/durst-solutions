import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jordandurst.com"),
  title: "Jordan Durst",
  description: "Jordan’s personal corner of the internet. Something new is taking shape.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Jordan Durst",
    description: "A little space for what’s next.",
    url: "https://jordandurst.com",
    siteName: "Jordan Durst",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;
}
