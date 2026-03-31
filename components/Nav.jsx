import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang } = useLang();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const dir = (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
  }, [lang]);

  function handleSetLang(code) {
    setLang(code);
    setLangOpen(false);
    setMenuOpen(false);
  }

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
          <Link href="/jobs" className={`u-link${isActive('/jobs') ? ' active' : ''}`}>{t(lang,'nav.jobs')}</Link>
          <Link href="/sectors" className={`u-link${isActive('/sectors') ? ' active' : ''}`}>{t(lang,'nav.sectors')}</Link>
          <Link href="/eligibility" className={`u-link${isActive('/eligibility') ? ' active' : ''}`}>{t(lang,'nav.eligibility')}</Link>
          <Link href="/timeline" className={`u-link${isActive('/timeline') ? ' active' : ''}`}>{t(lang,'nav.timeline')}</Link>
          <Link href="/embassy" className={`u-link${isActive('/embassy') ? ' active' : ''}`}>{t(lang,'nav.embassy')}</Link>
          <Link href="/generator" className={`u-link${isActive('/generator') ? ' active' : ''}`}>{t(lang,'nav.generator')}</Link>
          <Link href="/chat" className={`u-link${isActive('/chat') ? ' active' : ''}`}>{t(lang,'nav.chat')}</Link>
        </div>
        <div className="u-spacer" />
        <div className={`u-lang${langOpen ? ' open' : ''}`}>
          <button className="u-lang-btn" onClick={e => { e.stopPropagation(); setLangOpen(o => !o); }}>
            🌐 <span>{lang.toUpperCase()}</span> ▾
          </button>
          <div className="u-lang-drop">
            {[['en','🇬🇧 English'],['de','🇩🇪 Deutsch'],['ar','🇸🇦 العربية'],['tr','🇹🇷 Türkçe'],['fr','🇫🇷 Français'],['es','🇪🇸 Español'],['hi','🇮🇳 हिंदी'],['ur','🇵🇰 اردو'],['sw','🌍 Swahili'],['bn','🇧🇩 বাংলা'],['tl','🇵🇭 Filipino']].map(([code, label]) => (
              <button key={code} className="u-lang-opt" onClick={() => handleSetLang(code)}>{label}</button>
            ))}
          </div>
        </div>
        <Link href="/myapplication" className="u-myapp">{t(lang,'nav.myapp')}</Link>
        <button
          className={`u-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`u-mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="u-mob-section">{t(lang,'nav.tools')}</div>
        <Link href="/jobs" className={`u-mob-link${isActive('/jobs') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🔍</span><span>{t(lang,'nav.jobs')}</span></Link>
        <Link href="/generator" className={`u-mob-link${isActive('/generator') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📄</span><span>{t(lang,'nav.generator')}</span></Link>
        <Link href="/embassy" className={`u-mob-link${isActive('/embassy') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🗺️</span><span>{t(lang,'nav.embassy')}</span></Link>
        <Link href="/checklist" className={`u-mob-link${isActive('/checklist') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📋</span><span>{t(lang,'nav.checklist')}</span></Link>
        <Link href="/chat" className={`u-mob-link${isActive('/chat') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🤖</span><span>{t(lang,'nav.chat')}</span></Link>
        <div className="u-mob-section">{t(lang,'nav.resources')}</div>
        <Link href="/eligibility" className={`u-mob-link${isActive('/eligibility') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🎯</span><span>{t(lang,'nav.eligibility')}</span></Link>
        <Link href="/sectors" className={`u-mob-link${isActive('/sectors') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🏭</span><span>{t(lang,'nav.sectors')}</span></Link>
        <Link href="/timeline" className={`u-mob-link${isActive('/timeline') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📅</span><span>{t(lang,'nav.timeline')}</span></Link>
        <Link href="/salary" className={`u-mob-link${isActive('/salary') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">💰</span><span>Salary Calculator</span></Link>
        <Link href="/sperrkonto" className={`u-mob-link${isActive('/sperrkonto') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🏦</span><span>Sperrkonto Calculator</span></Link>
        <Link href="/recognition" className={`u-mob-link${isActive('/recognition') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🎓</span><span>Qualification Recognition</span></Link>
        <Link href="/phrases" className={`u-mob-link${isActive('/phrases') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">💬</span><span>German Phrases</span></Link>
        <Link href="/templates" className={`u-mob-link${isActive('/templates') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📧</span><span>Email Templates</span></Link>
        <Link href="/housing" className={`u-mob-link${isActive('/housing') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🏠</span><span>Housing Guide</span></Link>
        <div className="u-mob-section">Language / Sprache</div>
        <div className="u-mob-langs">
          {[['en','🇬🇧 EN'],['de','🇩🇪 DE'],['ar','🇸🇦 AR'],['tr','🇹🇷 TR'],['fr','🇫🇷 FR'],['es','🇪🇸 ES']].map(([code, label]) => (
            <button key={code} className={`u-mob-lang${lang === code ? ' active-lang' : ''}`} onClick={() => handleSetLang(code)}>{label}</button>
          ))}
        </div>
        <Link href="/myapplication" className="u-mob-myapp" onClick={() => setMenuOpen(false)}>{t(lang,'nav.myapp')}</Link>
      </div>
    </>
  );
}
