# jordandurst.com

A small personal landing page for Jordan Durst, built with Next.js.

Run `npm ci`, `npm run lint`, and `npm run build` to check the site. Use
`npm run dev` for local development or `npm start` after building.

The public homepage and `/solar` project page need no credentials. Previous
business pages and APIs remain removed. The staged private solar job interface
is locked by `SOLAR_RELEASE_READY=false` in `lib/solar-release.ts`, independently
of environment settings. All solar APIs return 503 before contacting Supabase.
Read `docs/SOLAR_DEPLOYMENT.md` before any future activation. Never publish the
private Helioforge application or run a desktop worker before OS verification.
