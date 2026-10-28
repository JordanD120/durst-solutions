"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Job = { id: string; state: string; result?: unknown; error?: string };
async function api(path: string, init?: RequestInit) {
  const response = await fetch("/api/solar" + path, { ...init, cache: "no-store", headers: { "Content-Type": "application/json", ...init?.headers } });
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || "Service unavailable."); return value;
}
export default function SolarWorkbench() {
  const [signedIn, setSignedIn] = useState(false), [online, setOnline] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]), [selected, setSelected] = useState<Job | null>(null);
  const [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const refresh = useCallback(async () => {
    const data = await api("/jobs"); setOnline(data.online); setJobs(data.jobs);
  }, []);
  useEffect(() => { let active = true; api("/session").then(() => { if (active) setSignedIn(true); }).catch(() => {}); return () => { active = false; }; }, []);
  useEffect(() => {
    if (!signedIn) return;
    const update = () => refresh().catch(e => setMessage(e.message)); update();
    const timer = setInterval(update, 10000); return () => clearInterval(timer);
  }, [signedIn, refresh]);
  useEffect(() => {
    if (!selected || !["queued", "running"].includes(selected.state)) return;
    const timer = setInterval(() => api("/jobs/" + selected.id).then(setSelected).catch(e => setMessage(e.message)), 5000);
    return () => clearInterval(timer);
  }, [selected]);
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget, data = new FormData(form); setBusy(true); setMessage("");
    try { await api("/session", { method: "POST", body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) }); form.reset(); setSignedIn(true); }
    catch (e) { setMessage((e as Error).message); } finally { setBusy(false); }
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); if (!file) return; setBusy(true); setMessage("");
    try {
      if (file.size > 3 * 1024 * 1024) throw new Error("Export must be at most 3 MiB. Remove historical runs in a copy before exporting.");
      const text = await file.text(); JSON.parse(text);
      setSelected(await api("/jobs", { method: "POST", body: text })); await refresh();
    } catch (e) { setMessage((e as Error).message); } finally { setBusy(false); }
  }
  const input = "block w-full rounded-lg border border-white/20 bg-slate-900 p-3 mt-2";
  return <section className="mt-8 rounded-2xl border border-white/15 p-6">
    <p role="status" aria-live="polite" className="mb-4 text-amber-200">{message}</p>
    {!signedIn ? <form onSubmit={signIn} className="grid max-w-md gap-4">
      <h2 className="text-xl font-semibold">Private simulation access</h2>
      <label>Email<input className={input} name="email" type="email" autoComplete="username" maxLength={254} required /></label>
      <label>Password<input className={input} name="password" type="password" autoComplete="current-password" maxLength={256} required /></label>
      <button disabled={busy} className="rounded-lg bg-cyan-300 p-3 font-bold text-slate-950 disabled:opacity-40">Sign in</button>
      <p className="text-sm text-slate-400">Use your invited account. Contact Jordan to request access.</p>
    </form> : <>
      <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{online ? "Desktop available" : "Desktop offline — runs paused"}</h2>
        <button className="underline" onClick={async () => { try { await api("/session", { method: "DELETE" }); setSignedIn(false); setSelected(null); setJobs([]); setFile(null); } catch (e) { setMessage((e as Error).message); } }}>Sign out</button></div>
      <p className="my-4 text-slate-300">Edit and confirm your design in Helioforge, then choose Export JSON. Upload that bundle here to run the same engineering pipeline. Your project resources are transferred for computation; only your account can retrieve its results.</p>
      <form onSubmit={submit} className="grid gap-4">
        <label>Helioforge project bundle · JSON, up to 3 MiB<input className={input} type="file" accept=".json,application/json" required onChange={e => setFile(e.target.files?.[0] || null)} /></label>
        <p className="text-sm text-slate-400">One active simulation, two waiting jobs. Each account may have one unfinished job and three submissions per hour. Web runs allow six SAM evaluations and 60 candidates; a run stops after five minutes. Results are retained for approximately 24 hours when scheduled cleanup is enabled.</p>
        <button disabled={busy || !online || jobs.some(j => ["queued", "running"].includes(j.state))} className="rounded-lg bg-cyan-300 p-3 font-bold text-slate-950 disabled:opacity-40">Run project</button>
      </form>
      <ul className="my-6 space-y-2">{jobs.map(j => <li key={j.id}><button className="underline" onClick={() => api("/jobs/" + j.id).then(setSelected).catch(e => setMessage(e.message))}>{j.id.slice(0, 8)} · {j.state}</button></li>)}</ul>
      {selected && <div><p className="font-semibold">Job {selected.id.slice(0, 8)} · {selected.state}</p>
        {["queued", "running"].includes(selected.state) && <button className="my-3 underline" onClick={() => api("/jobs/" + selected.id, { method: "DELETE" }).then(() => setMessage("Cancellation requested.")).catch(e => setMessage(e.message))}>Cancel run</button>}
        {selected.error && <p>{selected.error}</p>}
        {selected.result != null && <><button className="my-3 underline" onClick={() => { const url = URL.createObjectURL(new Blob([JSON.stringify(selected.result, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = "helioforge-result.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }}>Download result</button><pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-4 text-xs">{JSON.stringify(selected.result, null, 2)}</pre></>}
      </div>}
    </>}
  </section>;
}
