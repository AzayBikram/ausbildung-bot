import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const TRANSLATIONS = {
  en: { nav_jobs: 'Job Finder', nav_sectors: 'Sectors', nav_eligibility: 'Eligibility', nav_timeline: 'Timeline', nav_embassy: 'Embassy', nav_generator: 'Documents', nav_chat: 'AI Chat', nav_myapp: '🗂️ My Application', nav_tools: 'Tools', nav_resources: 'Resources', nav_checklist: 'Checklist' },
  de: { nav_jobs: 'Jobs finden', nav_sectors: 'Branchen', nav_eligibility: 'Eignung prüfen', nav_timeline: 'Zeitplan', nav_embassy: 'Botschaft', nav_generator: 'Dokumente', nav_chat: 'KI-Chat', nav_myapp: '🗂️ Meine Bewerbung', nav_tools: 'Tools', nav_resources: 'Ressourcen', nav_checklist: 'Checkliste' },
  ar: { nav_jobs: 'البحث عن وظيفة', nav_sectors: 'القطاعات', nav_eligibility: 'التأهل', nav_timeline: 'الجدول الزمني', nav_embassy: 'السفارة', nav_generator: 'المستندات', nav_chat: 'الدردشة', nav_myapp: '🗂️ طلبي', nav_tools: 'الأدوات', nav_resources: 'الموارد', nav_checklist: 'قائمة التحقق' },
  tr: { nav_jobs: 'İş Bul', nav_sectors: 'Sektörler', nav_eligibility: 'Uygunluk', nav_timeline: 'Zaman Çizelgesi', nav_embassy: 'Büyükelçilik', nav_generator: 'Belgeler', nav_chat: 'Yapay Zeka', nav_myapp: '🗂️ Başvurum', nav_tools: 'Araçlar', nav_resources: 'Kaynaklar', nav_checklist: 'Kontrol Listesi' },
  fr: { nav_jobs: 'Chercher emploi', nav_sectors: 'Secteurs', nav_eligibility: 'Éligibilité', nav_timeline: 'Calendrier', nav_embassy: 'Ambassade', nav_generator: 'Documents', nav_chat: 'IA Chat', nav_myapp: '🗂️ Ma Candidature', nav_tools: 'Outils', nav_resources: 'Ressources', nav_checklist: 'Liste de contrôle' },
  hi: { nav_jobs: 'नौकरी खोजें', nav_sectors: 'क्षेत्र', nav_eligibility: 'पात्रता', nav_timeline: 'समयरेखा', nav_embassy: 'दूतावास', nav_generator: 'दस्तावेज़', nav_chat: 'AI चैट', nav_myapp: '🗂️ मेरा आवेदन', nav_tools: 'टूल्स', nav_resources: 'संसाधन', nav_checklist: 'चेकलिस्ट' },
  ur: { nav_jobs: 'ملازمت تلاش کریں', nav_sectors: 'شعبہ جات', nav_eligibility: 'اہلیت', nav_timeline: 'ٹائم لائن', nav_embassy: 'سفارت خانہ', nav_generator: 'دستاویزات', nav_chat: 'AI چیٹ', nav_myapp: '🗂️ میری درخواست', nav_tools: 'ٹولز', nav_resources: 'وسائل', nav_checklist: 'چیک لسٹ' },
  sw: { nav_jobs: 'Tafuta Kazi', nav_sectors: 'Sekta', nav_eligibility: 'Ustahili', nav_timeline: 'Ratiba', nav_embassy: 'Ubalozi', nav_generator: 'Nyaraka', nav_chat: 'Mazungumzo ya AI', nav_myapp: '🗂️ Maombi Yangu', nav_tools: 'Zana', nav_resources: 'Rasilimali', nav_checklist: 'Orodha ya Ukaguzi' },
  bn: { nav_jobs: 'চাকরি খুঁজুন', nav_sectors: 'সেক্টর', nav_eligibility: 'যোগ্যতা', nav_timeline: 'সময়রেখা', nav_embassy: 'দূতাবাস', nav_generator: 'নথিপত্র', nav_chat: 'AI চ্যাট', nav_myapp: '🗂️ আমার আবেদন', nav_tools: 'টুলস', nav_resources: 'রিসোর্স', nav_checklist: 'চেকলিস্ট' },
  tl: { nav_jobs: 'Maghanap ng Trabaho', nav_sectors: 'Sektor', nav_eligibility: 'Kwalipikasyon', nav_timeline: 'Timeline', nav_embassy: 'Embahada', nav_generator: 'Mga Dokumento', nav_chat: 'AI Chat', nav_myapp: '🗂️ Aking Aplikasyon', nav_tools: 'Mga Tool', nav_resources: 'Mga Mapagkukunan', nav_checklist: 'Checklist' },
  es: { nav_jobs: 'Buscar empleo', nav_sectors: 'Sectores', nav_eligibility: 'Elegibilidad', nav_timeline: 'Cronograma', nav_embassy: 'Embajada', nav_generator: 'Documentos', nav_chat: 'Chat IA', nav_myapp: '🗂️ Mi Solicitud', nav_tools: 'Herramientas', nav_resources: 'Recursos', nav_checklist: 'Lista de verificación' },
};

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLangState] = useState('en');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('aig_lang') || 'en';
    setLangState(saved);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function setLang(newLang) {
    localStorage.setItem('aig_lang', newLang);
    setLangState(newLang);
    setLangOpen(false);
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent('aig:langchange', { detail: { lang: newLang } }));
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
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
          <Link href="/jobs" className={`u-link${isActive('/jobs') ? ' active' : ''}`}>{t.nav_jobs}</Link>
          <Link href="/sectors" className={`u-link${isActive('/sectors') ? ' active' : ''}`}>{t.nav_sectors}</Link>
          <Link href="/eligibility" className={`u-link${isActive('/eligibility') ? ' active' : ''}`}>{t.nav_eligibility}</Link>
          <Link href="/timeline" className={`u-link${isActive('/timeline') ? ' active' : ''}`}>{t.nav_timeline}</Link>
          <Link href="/embassy" className={`u-link${isActive('/embassy') ? ' active' : ''}`}>{t.nav_embassy}</Link>
          <Link href="/generator" className={`u-link${isActive('/generator') ? ' active' : ''}`}>{t.nav_generator}</Link>
          <Link href="/chat" className={`u-link${isActive('/chat') ? ' active' : ''}`}>{t.nav_chat}</Link>
        </div>
        <div className="u-spacer" />
        <div className={`u-lang${langOpen ? ' open' : ''}`}>
          <button className="u-lang-btn" onClick={e => { e.stopPropagation(); setLangOpen(o => !o); }}>
            🌐 <span>{lang.toUpperCase()}</span> ▾
          </button>
          <div className="u-lang-drop">
            {[['en','🇬🇧 English'],['de','🇩🇪 Deutsch'],['ar','🇸🇦 العربية'],['tr','🇹🇷 Türkçe'],['fr','🇫🇷 Français'],['es','🇪🇸 Español'],['hi','🇮🇳 हिंदी'],['ur','🇵🇰 اردو'],['sw','🌍 Swahili'],['bn','🇧🇩 বাংলা'],['tl','🇵🇭 Filipino']].map(([code, label]) => (
              <button key={code} className="u-lang-opt" onClick={() => setLang(code)}>{label}</button>
            ))}
          </div>
        </div>
        <Link href="/myapplication" className="u-myapp">{t.nav_myapp}</Link>
        <button
          className={`u-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`u-mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="u-mob-section">{t.nav_tools}</div>
        <Link href="/jobs" className={`u-mob-link${isActive('/jobs') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🔍</span><span>{t.nav_jobs}</span></Link>
        <Link href="/generator" className={`u-mob-link${isActive('/generator') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📄</span><span>{t.nav_generator}</span></Link>
        <Link href="/embassy" className={`u-mob-link${isActive('/embassy') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🗺️</span><span>{t.nav_embassy}</span></Link>
        <Link href="/checklist" className={`u-mob-link${isActive('/checklist') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📋</span><span>{t.nav_checklist}</span></Link>
        <Link href="/chat" className={`u-mob-link${isActive('/chat') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🤖</span><span>{t.nav_chat}</span></Link>
        <div className="u-mob-section">{t.nav_resources}</div>
        <Link href="/eligibility" className={`u-mob-link${isActive('/eligibility') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🎯</span><span>{t.nav_eligibility}</span></Link>
        <Link href="/sectors" className={`u-mob-link${isActive('/sectors') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🏭</span><span>{t.nav_sectors}</span></Link>
        <Link href="/timeline" className={`u-mob-link${isActive('/timeline') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📅</span><span>{t.nav_timeline}</span></Link>
        <Link href="/salary" className={`u-mob-link${isActive('/salary') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">💰</span><span>Salary Calculator</span></Link>
        <Link href="/sperrkonto" className={`u-mob-link${isActive('/sperrkonto') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🏦</span><span>Sperrkonto Calculator</span></Link>
        <Link href="/recognition" className={`u-mob-link${isActive('/recognition') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🎓</span><span>Qualification Recognition</span></Link>
        <Link href="/phrases" className={`u-mob-link${isActive('/phrases') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">💬</span><span>German Phrases</span></Link>
        <Link href="/templates" className={`u-mob-link${isActive('/templates') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">📧</span><span>Email Templates</span></Link>
        <Link href="/housing" className={`u-mob-link${isActive('/housing') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="mob-icon">🏠</span><span>Housing Guide</span></Link>
        <div className="u-mob-section">Language / Sprache</div>
        <div className="u-mob-langs">
          {[['en','🇬🇧 EN'],['de','🇩🇪 DE'],['ar','🇸🇦 AR'],['tr','🇹🇷 TR'],['fr','🇫🇷 FR'],['es','🇪🇸 ES']].map(([code, label]) => (
            <button key={code} className={`u-mob-lang${lang === code ? ' active-lang' : ''}`} onClick={() => setLang(code)}>{label}</button>
          ))}
        </div>
        <Link href="/myapplication" className="u-mob-myapp" onClick={() => setMenuOpen(false)}>{t.nav_myapp}</Link>
      </div>
    </>
  );
}
