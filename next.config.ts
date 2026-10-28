import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
    ] }, { source: "/solar", headers: [
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'" },
    ] }, { source: "/api/solar/:path*", headers: [
      { key: "Cache-Control", value: "no-store, private" },
      { key: "Referrer-Policy", value: "no-referrer" },
    ] }];
  },
};
export default nextConfig;
