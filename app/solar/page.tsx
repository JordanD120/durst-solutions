import Link from "next/link";
import SolarWorkbench from "./workbench";
import { connection } from "next/server";
import { SOLAR_RELEASE_READY } from "@/lib/solar-release";

export const metadata = { title: "Helioforge Solar Workbench", robots: { index: false, follow: false } };
export default async function SolarPage() {
  await connection();
  return <main className="solar-page mx-auto max-w-4xl px-6 py-12">
    <Link href="/" className="text-cyan-300">← Jordan Durst</Link>
    <p className="mt-10 text-sm uppercase tracking-widest text-cyan-300">MEEN 439 · Helioforge</p>
    <h1 className="mt-3 text-4xl font-bold">Solar PV & battery workbench</h1>
    <p className="mt-5 text-slate-300">Compare physically screened PV and battery designs using the existing Helioforge engineering application and NREL SAM. Simulation access is by invitation.</p>
    <p className="mt-3 text-sm text-slate-400">This engineering release has unresolved validation and equipment review gaps. Results may be unavailable when required evidence is missing. No illustrative values are presented as calculated results.</p>
    {SOLAR_RELEASE_READY && process.env.SOLAR_ENABLED === "true" ? <SolarWorkbench /> : <section className="mt-8 rounded-2xl border border-white/15 p-6"><h2 className="text-xl font-semibold">Simulation access is paused</h2><p className="mt-3 text-slate-300">Private simulations will be available by invitation after setup and verification are complete.</p></section>}
  </main>;
}
