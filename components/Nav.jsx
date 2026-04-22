import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const path = router.pathname;
  function isActive(href) {
    if (href === '/') return path === '/';
    return path === href || path === href + '.html';
  }

  return (
    <>
      <nav className="u-nav">
        <Link href="/" className="u-logo">
          <div className="u-logo-mark">🎓</div>
          <span>AusbildungInGermany</span>
        </Link>
        <div className="u-links">
          <Link href="/jobs" className={`u-link${isActive('/jobs') ? ' active' : ''}`}>Job Finder</Link>
          <Link href="/sectors" className={`u-link${isActive('/sectors') ? ' active' : ''}`}>Sectors</Link>
          <Link href="/eligibility" className={`u-link${isActive('/eligibility') ? ' active' : ''}`}>Eligibility</Link>
          <Link href="/timeline" className={`u-link${isActive('/timeline') ? ' active' : ''}`}>Timeline</Link>
          <Link href="/embassy" className={`u-link${isActive('/embassy') ? ' active' : ''}`}>Embassy</Link>
          <Link href="/generator" className={`u-link${isActive('/generator') ? ' active' : ''}`}>Documents</Link>
          <Link href="/chat" className={`u-link${isActive('/chat') ? ' active' : ''}`}>AI Chat</Link>
        </div>
        <div className="u-spacer" />
        <Link href="/myapplication" className="u-myapp">🗂️ My Application</Link>
        <button
          className={`u-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`u-mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="u-mob-section">Tools</div>
        <Link href="/jobs" className={`u-mob-link${isActive('/jobs') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🔍</span><span>Job Finder</span></Link>
        <Link href="/generator" className={`u-mob-link${isActive('/generator') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📄</span><span>Documents</span></Link>
        <Link href="/embassy" className={`u-mob-link${isActive('/embassy') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🗺️</span><span>Embassy</span></Link>
        <Link href="/checklist" className={`u-mob-link${isActive('/checklist') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📋</span><span>Checklist</span></Link>
        <Link href="/chat" className={`u-mob-link${isActive('/chat') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🤖</span><span>AI Chat</span></Link>
        <div className="u-mob-section">Resources</div>
        <Link href="/eligibility" className={`u-mob-link${isActive('/eligibility') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🎯</span><span>Eligibility</span></Link>
        <Link href="/sectors" className={`u-mob-link${isActive('/sectors') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🏭</span><span>Sectors</span></Link>
        <Link href="/timeline" className={`u-mob-link${isActive('/timeline') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📅</span><span>Timeline</span></Link>
        <Link href="/salary" className={`u-mob-link${isActive('/salary') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">💰</span><span>Salary Calculator</span></Link>
        <Link href="/sperrkonto" className={`u-mob-link${isActive('/sperrkonto') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🏦</span><span>Sperrkonto Calculator</span></Link>
        <Link href="/recognition" className={`u-mob-link${isActive('/recognition') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🎓</span><span>Qualification Recognition</span></Link>
        <Link href="/phrases" className={`u-mob-link${isActive('/phrases') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">💬</span><span>German Phrases</span></Link>
        <Link href="/templates" className={`u-mob-link${isActive('/templates') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📧</span><span>Email Templates</span></Link>
        <Link href="/housing" className={`u-mob-link${isActive('/housing') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🏠</span><span>Housing Guide</span></Link>
        <Link href="/myapplication" className="u-mob-myapp" onClick={() => setMenuOpen(false)}>🗂️ My Application</Link>
      </div>
    </>
  );
}
