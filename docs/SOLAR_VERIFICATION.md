# Local verification — October 28, 2026

## Current personal-site solar release

The staged integration was reapplied to the generic personal homepage, without
restoring business pages or APIs. Repository lint and the default Next.js 16.4.3
production build pass, including TypeScript. Fourteen PostgreSQL queue and input
policy tests pass. All solar APIs are locked off by SOLAR_RELEASE_READY=false,
independently of SOLAR_ENABLED. Supabase remains inactive and live computations
remain unverified. The following older notes are retained as preparation history.

Deployment status: **not deployed; solar disabled by default**. No DNS, live
deployment, Supabase schema, account, router, firewall or desktop-service change
was made. Changes are local in `solar-desktop-integration` branches.

## Checks executed

| Check | Result |
|---|---|
| PostgreSQL queue/security and request-policy tests | 13 passed |
| Windows bridge tests | 9 passed |
| Existing Helioforge real-PySAM adapter tests | 5 passed |
| Next.js 16.4.3 Webpack production build | Passed; all original and new routes generated |
| TypeScript validation | Passed as part of final production build |
| Lint on changed source and new TypeScript tests | Passed |
| Local production HTTP checks | Passed |
| Built browser JavaScript scan | Passed; 36 JS files scanned |
| Full dependency audit (production and development) | 0 known vulnerabilities after targeted security updates |
| Repo-wide lint | 9 pre-existing errors in AdminPreview.tsx and Hero.tsx; neither changed |
| Interactive browser visual check | Not completed; connected browser navigation failed |
| Live Supabase/Auth/worker end-to-end run | Not run; project inactive, live changes await approval |
| Dedicated account ACL/firewall/separate-runtime test | Pending approved Windows setup |

The database tests use real local PostgreSQL execution through PGlite with
Supabase-equivalent client/service roles and an isolated test Auth user table.
They verify no anon/authenticated RPC/table access, denied nonmember/offline
submissions, exactly one running and at most two queued jobs, one unfinished
job/member, owner-only list/read/cancel, failed worker takeover, cancellation,
idempotent acknowledgement, revoked-member/stale-job rejection, submission/login
limits, and preservation of the running slot after deleting an Auth user.

Windows tests start real OS-limited processes. A second process is denied,
memory allocation is denied at the configured test cap, private-file/socket
access is blocked by the audit guard, timeouts/cancellation terminate work, and
temporary files are removed. Existing desktop bundles and source resources are
read into the adapter; tests never open the owner's Helioforge database.

The five existing adapter checks execute actual pinned PySAM/SSC, including
production and uploaded-load finance. They validate executable integration,
not independent engineering equivalence or manufacturer equipment approval.

HTTP checks start a temporary loopback-only production server using synthetic
test settings. Original pages and `/solar` return 200; job/session endpoints
without cookies return 401 with no-store; cross-origin POST/DELETE return 403;
worker calls without its separate token return 401; cross-origin preflight has
no Access-Control-Allow-Origin. No live credentials or database calls are used.

The bundle scan checks built browser JS for service-key/worker-token names,
test canaries, desktop profile paths and local engine URLs. It found none.
Actual production values were never pulled or used; repeat the scan against the
approved production build and verify sensitive values stay server-only.

## Build environment notes

The existing repository used Next.js 16.2.9. Its production audit reported
critical advisories. Next.js and its ESLint configuration were pinned to 16.4.3;
compatible fixes were applied to the flagged production/build/lint transitive
packages, including nanoid, source-map-js, baseline-browser-mapping, PostCSS,
Browserslist, brace-expansion, js-yaml and zod. React and Supabase versions
were not upgraded.

This Windows environment's initial Turbopack build could not connect to its
local build worker; a later Webpack build hit a restricted filesystem operation.
The successful local build used Webpack with the required Windows execution
permissions, telemetry disabled, and dummy values for existing top-level
Supabase/Resend clients. No real credentials were read and nothing was deployed.
The default Vercel build must still pass before production release.

The browser connection initialized, but navigation repeatedly failed with an
internal connection error. No screenshot or interactive visual result is claimed.
Use the release checks in `SOLAR_DEPLOYMENT.md` for approved staging verification.

## Reproduce

```text
npm ci
npm run test:solar
npm run build
npm run test:solar-http
npm run check:browser-bundle
npm audit --omit=dev
```

For the Windows bridge, use `desktop_bridge/README.md` in the private solar
repository. For lint, run the repository command and compare the two unchanged
components above; all changed files have passed a focused ESLint check.
