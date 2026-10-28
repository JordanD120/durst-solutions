import Link from "next/link";

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="identity">
          <span className="monogram" aria-hidden="true">jd.</span>
          <span>Jordan Durst</span>
        </div>
        <span className="header-note">A personal website</span>
      </header>

      <main id="main-content">
        <div className="welcome">
          <p className="eyebrow">Hello, and welcome.</p>
          <h1>A little space<br />for what’s next<span className="accent">.</span></h1>
          <p className="intro">You’ve found Jordan’s corner of the internet.<br className="desktop-break" /> Something new is taking shape. More to come.</p>
          <div className="status"><span aria-hidden="true" />A fresh start</div>
          <p className="project-link"><Link href="/solar">Explore the Helioforge solar project <span aria-hidden="true">↗</span></Link></p>
        </div>

        <div className="artwork" aria-hidden="true">
          <div className="art-grid">
            <div className="art-tile arch" />
            <div className="art-tile disc"><span /></div>
            <div className="art-tile rings"><span /><span /><span /></div>
            <div className="art-tile steps"><span /><span /><span /></div>
          </div>
          <span className="art-caption">Always a work in progress.</span>
        </div>
      </main>

      <footer className="site-footer">
        <span>jordandurst.com</span>
        <span>Glad you stopped by.</span>
      </footer>
    </div>
  );
}
