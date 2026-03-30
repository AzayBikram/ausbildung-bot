import Head from 'next/head';
import { useEffect } from 'react';
import Nav from '../components/Nav';

export default function Home() {
  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // FAQ toggle
    window.toggleFaq = function(el) { el.classList.toggle('open'); };

    // Share bar
    window.shareWhatsApp = function() { window.open('https://wa.me/?text=' + encodeURIComponent('Check out AusbildungInGermany.org — the free platform to find Ausbildung in Germany! ' + window.location.href), '_blank'); };
    window.shareFacebook = function() { window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank'); };
    window.copyLink = function() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const b = document.querySelector('[title="Copy link"]');
        const orig = b.textContent; b.textContent = '✅'; b.style.background = '#00c48c';
        setTimeout(() => { b.textContent = orig; b.style.background = '#0a1628'; }, 2000);
      });
    };
    window.toggleFeedback = function() {
      const p = document.getElementById('feedbackPanel');
      p.style.display = p.style.display === 'none' ? 'block' : 'none';
    };
    window.submitFeedback = function() {
      const type = document.getElementById('fbType').value;
      const text = document.getElementById('fbText').value.trim();
      if (!text) { alert('Please write your feedback!'); return; }
      console.log('Feedback:', type, text);
      document.getElementById('feedbackPanel').innerHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:32px;margin-bottom:10px;">🙏</div><strong style="font-family:Outfit,sans-serif;font-size:16px;color:#0a1628;">Thank you!</strong><p style="font-size:13px;color:#718096;margin-top:8px;">Your feedback helps us improve AusbildungInGermany for everyone.</p></div>';
      setTimeout(() => { document.getElementById('feedbackPanel').style.display = 'none'; }, 3000);
    };

    // Page translations
    const PAGE_TRANSLATIONS = {
      en: { hero_badge: '100% Free · No Agents · No Middlemen', hero_sub: 'The complete free platform for people from anywhere in the world to find, apply for, and succeed in German vocational training — powered by AI.', hero_cta1: '🎯 Check My Eligibility →', hero_cta2: '🔍 Search Jobs', hero_cta3: '💬 Ask AI', features_label: 'Everything You Need', trust1: 'No registration required', trust2: 'Your data stays on your device', trust3: 'Available in 6 languages', trust4: 'AI-powered document generation', trust5: 'Official embassy appointment guidance' },
      de: { hero_badge: '100% Kostenlos · Keine Agenten · Keine Vermittler', hero_sub: 'Die komplette kostenlose Plattform für Menschen aus aller Welt, um eine Ausbildung in Deutschland zu finden und zu bewerben — KI-gestützt.', hero_cta1: '🎯 Eignung prüfen →', hero_cta2: '🔍 Jobs suchen', hero_cta3: '💬 KI fragen', features_label: 'Alles was du brauchst', trust1: 'Keine Registrierung erforderlich', trust2: 'Deine Daten bleiben auf deinem Gerät', trust3: 'In 6 Sprachen verfügbar', trust4: 'KI-gestützte Dokumentenerstellung', trust5: 'Offizielle Botschaftsberatung' },
      ar: { hero_badge: 'مجاني 100٪ · بدون وكلاء · بدون وسطاء', hero_sub: 'المنصة المجانية الشاملة للناس من جميع أنحاء العالم للعثور على تدريب مهني في ألمانيا والتقدم إليه.', hero_cta1: '🎯 تحقق من أهليتي →', hero_cta2: '🔍 ابحث عن وظائف', hero_cta3: '💬 اسأل الذكاء الاصطناعي', features_label: 'كل ما تحتاجه', trust1: 'لا يلزم التسجيل', trust2: 'بياناتك تبقى على جهازك', trust3: 'متاح بـ 6 لغات', trust4: 'إنشاء وثائق بالذكاء الاصطناعي', trust5: 'إرشادات رسمية لموعد السفارة' },
      tr: { hero_badge: '%100 Ücretsiz · Acente Yok · Aracı Yok', hero_sub: "Dünyanın her yerinden insanların Almanya'da mesleki eğitim bulmasına ve başvurmasına yardımcı olan ücretsiz platform.", hero_cta1: '🎯 Uygunluğumu Kontrol Et →', hero_cta2: '🔍 İş Ara', hero_cta3: "💬 Yapay Zeka'ya Sor", features_label: 'İhtiyacınız Olan Her Şey', trust1: 'Kayıt gerekmez', trust2: 'Verileriniz cihazınızda kalır', trust3: '6 dilde mevcut', trust4: 'Yapay zeka destekli belge oluşturma', trust5: 'Resmi büyükelçilik randevu rehberliği' },
      fr: { hero_badge: '100% Gratuit · Sans agents · Sans intermédiaires', hero_sub: "La plateforme gratuite complète pour les personnes du monde entier pour trouver et postuler à une formation professionnelle en Allemagne.", hero_cta1: '🎯 Vérifier mon éligibilité →', hero_cta2: '🔍 Chercher des emplois', hero_cta3: "💬 Demander à l'IA", features_label: 'Tout ce dont vous avez besoin', trust1: 'Aucune inscription requise', trust2: 'Vos données restent sur votre appareil', trust3: 'Disponible en 6 langues', trust4: 'Génération de documents par IA', trust5: "Guide officiel pour rendez-vous ambassade" },
      es: { hero_badge: '100% Gratis · Sin agentes · Sin intermediarios', hero_sub: 'La plataforma gratuita completa para personas de todo el mundo para encontrar y solicitar formación profesional en Alemania.', hero_cta1: '🎯 Verificar mi elegibilidad →', hero_cta2: '🔍 Buscar empleos', hero_cta3: '💬 Preguntar a la IA', features_label: 'Todo lo que necesitas', trust1: 'Sin registro requerido', trust2: 'Tus datos permanecen en tu dispositivo', trust3: 'Disponible en 6 idiomas', trust4: 'Generación de documentos con IA', trust5: 'Guía oficial para cita en embajada' },
    };

    window.applyPageTranslations = function(lang) {
      const t = PAGE_TRANSLATIONS[lang] || PAGE_TRANSLATIONS.en;
      const badge = document.querySelector('.hero-badge');
      if (badge) badge.innerHTML = `<div class="dot"></div>${t.hero_badge}`;
      const heroP = document.querySelector('.hero p');
      if (heroP) heroP.textContent = t.hero_sub;
      const ctaBtns = document.querySelectorAll('.hero-actions a');
      if (ctaBtns[0]) ctaBtns[0].textContent = t.hero_cta1;
      if (ctaBtns[1]) ctaBtns[1].textContent = t.hero_cta2;
      if (ctaBtns[2]) ctaBtns[2].textContent = t.hero_cta3;
      const flabel = document.querySelector('.features-section .section-label');
      if (flabel) flabel.textContent = t.features_label;
      const trust = document.querySelectorAll('.trust-item');
      ['trust1','trust2','trust3','trust4','trust5'].forEach((k, i) => {
        if (trust[i]) trust[i].lastChild.textContent = t[k];
      });
      document.documentElement.dir = (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr';
    };

    // Listen for language changes from Nav
    const onLangChange = (e) => {
      if (window.applyPageTranslations) window.applyPageTranslations(e.detail.lang);
    };
    window.addEventListener('aig:langchange', onLangChange);

    // Apply saved lang
    const saved = typeof localStorage !== 'undefined' ? (localStorage.getItem('aig_lang') || 'en') : 'en';
    if (window.applyPageTranslations) window.applyPageTranslations(saved);

    return () => {
      observer.disconnect();
      window.removeEventListener('aig:langchange', onLangChange);
    };
  }, []);

  const jsonLd1 = `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AusbildungInGermany",
  "url": "https://ausbildungingermany.org",
  "description": "The complete free platform to find, apply and succeed in German Ausbildung vocational training — AI-powered, no agents, no fees.",
  "potentialAction": {"@type": "SearchAction","target": "https://ausbildungingermany.org/jobs?q={search_term_string}","query-input": "required name=search_term_string"},
  "publisher": {"@type": "Organization","name": "AusbildungInGermany.org","url": "https://ausbildungingermany.org","logo": {"@type": "ImageObject","url": "https://ausbildungingermany.org/icon-512.png"}}
}`;

  const jsonLd2 = `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question","name": "Can I really apply for Ausbildung from abroad?","acceptedAnswer": {"@type": "Answer","text": "Yes! Non-EU citizens can apply for Ausbildung in Germany. You need a valid passport, German language certificate (B1 minimum), school diploma, and an Ausbildungsvertrag from a German company."}},
    {"@type": "Question","name": "How much German do I need for Ausbildung?","acceptedAnswer": {"@type": "Answer","text": "Most Ausbildung programs require B1 German (CEFR intermediate). Healthcare and social work fields require B2. B1 is the official minimum for the Ausbildung visa (§16a AufenthG)."}},
    {"@type": "Question","name": "How much will I earn during Ausbildung?","acceptedAnswer": {"@type": "Answer","text": "The legal minimum for 2026 is €724/month in Year 1. Most trainees earn more — the national average is €1,133/month. You also receive full social benefits including health insurance."}},
    {"@type": "Question","name": "Do I need to pay an agent for Ausbildung?","acceptedAnswer": {"@type": "Answer","text": "No. Everything you need to apply for Ausbildung is free and public. Agents charge €200–€2,000 for services you can do yourself for free using our platform."}}
  ]
}`;

  const css = `
:root{--navy:#0a1628;--navy2:#0f2040;--blue:#1a56ff;--blue2:#4f7fff;--gold:#f5a623;--green:#00c48c;--red:#ff4757;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#ffffff;--border:#e2e8f0;--font-display:'Outfit',sans-serif;--font-body:'Outfit',sans-serif;--font-serif:'Lora',serif;}
body{padding-top:68px;background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:16px;line-height:1.6;overflow-x:hidden;}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 24px 80px;position:relative;overflow:hidden;}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(26,86,255,0.08) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 80% 80%,rgba(245,166,35,0.06) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 20% 60%,rgba(0,196,140,0.05) 0%,transparent 60%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(26,86,255,0.08);border:1px solid rgba(26,86,255,0.2);border-radius:100px;padding:6px 16px;font-size:13px;font-weight:600;color:var(--blue);margin-bottom:28px;animation:fadeDown 0.6s ease;}
.hero-badge .dot{width:6px;height:6px;background:var(--green);border-radius:50%;animation:pulse 2s ease infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes fadeDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.hero h1{font-family:var(--font-display);font-size:clamp(44px,7vw,88px);font-weight:900;line-height:1.0;letter-spacing:-2px;margin-bottom:28px;animation:fadeUp 0.7s ease 0.1s both;max-width:900px;}
.hero h1 .highlight{color:var(--blue);position:relative;display:inline-block;}
.hero h1 .highlight::after{content:'';position:absolute;bottom:4px;left:0;right:0;height:6px;background:rgba(26,86,255,0.15);border-radius:3px;}
.hero h1 .accent{color:var(--gold);}
.hero p{font-size:clamp(17px,2vw,21px);color:var(--text2);max-width:620px;margin-bottom:44px;line-height:1.6;font-weight:400;animation:fadeUp 0.7s ease 0.2s both;}
.hero-actions{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-bottom:64px;animation:fadeUp 0.7s ease 0.3s both;}
.btn-hero-primary{background:var(--navy);color:#fff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 32px;border-radius:14px;display:flex;align-items:center;gap:8px;transition:all 0.2s;box-shadow:0 4px 24px rgba(10,22,40,0.2);}
.btn-hero-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(10,22,40,0.25);}
.btn-hero-secondary{background:var(--surface);color:var(--text);text-decoration:none;font-size:16px;font-weight:600;padding:16px 32px;border-radius:14px;border:1.5px solid var(--border);display:flex;align-items:center;gap:8px;transition:all 0.2s;}
.btn-hero-secondary:hover{border-color:var(--blue);color:var(--blue);transform:translateY(-1px);}
.hero-stats{display:flex;gap:48px;flex-wrap:wrap;justify-content:center;animation:fadeUp 0.7s ease 0.4s both;}
.stat{text-align:center;}
.stat-num{font-family:var(--font-display);font-size:32px;font-weight:900;color:var(--navy);letter-spacing:-1px;line-height:1;}
.stat-label{font-size:13px;color:var(--text3);margin-top:4px;}
.trust-bar{background:var(--navy);padding:20px 40px;display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;}
.trust-item{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.7);font-size:14px;font-weight:500;}
.trust-item .ti-icon{color:var(--gold);font-size:16px;}
section{padding:100px 40px;}
.container{max-width:1200px;margin:0 auto;}
.section-label{display:inline-block;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--blue);margin-bottom:12px;}
.section-title{font-family:var(--font-display);font-size:clamp(32px,4vw,52px);font-weight:800;letter-spacing:-1px;line-height:1.1;margin-bottom:16px;color:var(--navy);}
.section-subtitle{font-size:18px;color:var(--text2);max-width:560px;line-height:1.6;}
.features-section{background:var(--surface);}
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:60px;}
.feature-card{background:var(--bg);border:1.5px solid var(--border);border-radius:20px;padding:28px;transition:all 0.2s;text-decoration:none;color:var(--text);display:block;}
.feature-card:hover{border-color:var(--blue);transform:translateY(-4px);box-shadow:0 12px 40px rgba(26,86,255,0.1);}
.feature-card .fc-icon{width:52px;height:52px;background:var(--navy);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:18px;}
.feature-card h3{font-size:18px;font-weight:700;margin-bottom:8px;letter-spacing:-0.3px;}
.feature-card p{font-size:14px;color:var(--text2);line-height:1.6;}
.feature-card .fc-link{display:inline-flex;align-items:center;gap:4px;margin-top:14px;font-size:13px;font-weight:600;color:var(--blue);}
.how-section{background:var(--bg);}
.steps-row{display:flex;gap:0;margin-top:60px;position:relative;}
.steps-row::before{content:'';position:absolute;top:32px;left:80px;right:80px;height:2px;background:linear-gradient(90deg,var(--blue),var(--green));z-index:0;}
.step-item{flex:1;text-align:center;padding:0 20px;position:relative;z-index:1;}
.step-circle{width:64px;height:64px;background:var(--navy);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 20px;border:4px solid var(--bg);box-shadow:0 0 0 2px var(--navy);}
.step-item h3{font-size:16px;font-weight:700;margin-bottom:8px;}
.step-item p{font-size:13px;color:var(--text3);line-height:1.5;}
.sectors-section{background:var(--navy);color:#fff;}
.sectors-section .section-title{color:#fff;}
.sectors-section .section-subtitle{color:rgba(255,255,255,0.6);}
.sectors-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:52px;}
.sector-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:22px;text-decoration:none;color:#fff;transition:all 0.2s;cursor:pointer;}
.sector-card:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.25);transform:translateY(-3px);}
.sector-card .sc-emoji{font-size:32px;margin-bottom:12px;display:block;}
.sector-card .sc-name{font-size:15px;font-weight:700;margin-bottom:4px;}
.sector-card .sc-salary{font-size:13px;color:var(--gold);font-weight:600;}
.sector-card .sc-demand{display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:11px;padding:3px 8px;border-radius:4px;background:rgba(0,196,140,0.2);color:var(--green);}
.elig-section{background:linear-gradient(135deg,#1a56ff 0%,#0a3db5 100%);color:#fff;text-align:center;padding:80px 40px;}
.elig-section .section-title{color:#fff;}
.elig-section p{color:rgba(255,255,255,0.8);font-size:18px;margin:16px auto 40px;max-width:540px;}
.elig-score-preview{display:inline-flex;align-items:center;gap:20px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:16px;padding:20px 32px;margin-bottom:36px;}
.elig-score-preview .score{font-family:var(--font-display);font-size:52px;font-weight:900;line-height:1;}
.elig-score-preview .score-label{font-size:13px;color:rgba(255,255,255,0.7);}
.elig-score-preview .score-bar{width:120px;height:8px;background:rgba(255,255,255,0.2);border-radius:4px;overflow:hidden;}
.elig-score-preview .score-fill{height:100%;width:75%;background:var(--gold);border-radius:4px;}
.compare-section{background:var(--surface);}
.compare-table{width:100%;border-collapse:collapse;margin-top:52px;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);}
.compare-table th{background:var(--navy);color:#fff;padding:16px 24px;text-align:left;font-size:14px;font-weight:600;}
.compare-table th.highlight-col{background:var(--blue);}
.compare-table td{padding:14px 24px;font-size:14px;border-bottom:1px solid var(--border);}
.compare-table tr:last-child td{border-bottom:none;}
.compare-table tr:nth-child(even) td{background:var(--bg);}
.compare-table td.highlight-col{background:rgba(26,86,255,0.04);font-weight:600;color:var(--blue);}
.compare-table tr:nth-child(even) td.highlight-col{background:rgba(26,86,255,0.08);}
.check{color:var(--green);font-size:18px;}
.cross{color:var(--red);font-size:18px;}
.testimonials-section{background:var(--bg);}
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:52px;}
.testimonial-card{background:var(--surface);border:1.5px solid var(--border);border-radius:20px;padding:28px;}
.tc-stars{color:var(--gold);font-size:16px;margin-bottom:14px;}
.tc-text{font-size:15px;color:var(--text2);line-height:1.7;margin-bottom:20px;font-style:italic;font-family:var(--font-serif);}
.tc-author{display:flex;align-items:center;gap:12px;}
.tc-avatar{width:42px;height:42px;border-radius:50%;background:var(--navy);display:flex;align-items:center;justify-content:center;font-size:18px;}
.tc-name{font-size:14px;font-weight:700;}
.tc-country{font-size:12px;color:var(--text3);}
.faq-section{background:var(--surface);}
.faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:52px;}
.faq-item{background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:22px;cursor:pointer;transition:all 0.15s;}
.faq-item:hover{border-color:var(--blue);}
.faq-item.open{border-color:var(--blue);background:rgba(26,86,255,0.02);}
.faq-q{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:15px;font-weight:600;}
.faq-icon{font-size:18px;transition:transform 0.2s;flex-shrink:0;color:var(--text3);}
.faq-item.open .faq-icon{transform:rotate(45deg);color:var(--blue);}
.faq-a{display:none;margin-top:12px;font-size:14px;color:var(--text2);line-height:1.7;}
.faq-item.open .faq-a{display:block;}
.final-cta{background:var(--navy);color:#fff;text-align:center;padding:100px 40px;}
.final-cta .section-title{color:#fff;font-size:clamp(36px,5vw,64px);}
.final-cta p{color:rgba(255,255,255,0.7);font-size:18px;margin:20px auto 44px;max-width:500px;}
.cta-buttons{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.btn-cta-white{background:#fff;color:var(--navy);text-decoration:none;font-size:16px;font-weight:700;padding:16px 32px;border-radius:14px;display:flex;align-items:center;gap:8px;transition:all 0.2s;}
.btn-cta-white:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2);}
.btn-cta-outline{background:transparent;color:#fff;text-decoration:none;font-size:16px;font-weight:600;padding:16px 32px;border-radius:14px;border:2px solid rgba(255,255,255,0.3);display:flex;align-items:center;gap:8px;transition:all 0.2s;}
.btn-cta-outline:hover{border-color:#fff;background:rgba(255,255,255,0.08);}
footer{background:#060d1a;color:rgba(255,255,255,0.5);padding:60px 40px 40px;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;max-width:1200px;margin:0 auto 48px;}
.footer-brand p{font-size:14px;line-height:1.7;margin-top:12px;max-width:280px;}
.footer-col h4{font-size:13px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;}
.footer-col a{display:block;color:rgba(255,255,255,0.5);text-decoration:none;font-size:14px;margin-bottom:10px;transition:color 0.15s;}
.footer-col a:hover{color:#fff;}
.footer-bottom{max-width:1200px;margin:0 auto;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;font-size:13px;flex-wrap:wrap;gap:12px;}
.footer-bottom a{color:rgba(255,255,255,0.5);text-decoration:none;}
.footer-bottom a:hover{color:#fff;}
.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.6s ease,transform 0.6s ease;}
.reveal.visible{opacity:1;transform:translateY(0);}
@media(max-width:900px){section{padding:70px 20px;}.features-grid{grid-template-columns:1fr;}.sectors-grid{grid-template-columns:repeat(2,1fr);}.testimonials-grid{grid-template-columns:1fr;}.faq-grid{grid-template-columns:1fr;}.steps-row{flex-direction:column;gap:32px;}.steps-row::before{display:none;}.footer-grid{grid-template-columns:1fr 1fr;}.compare-table{display:block;overflow-x:auto;}.trust-bar{gap:20px;padding:20px;}}
`;

  return (
    <>
      <Head>
        <title>AusbildungInGermany – Find Your Apprenticeship in Germany. Free. No Agents.</title>
        <meta name="description" content="The complete free platform to find, apply and succeed in German Ausbildung. AI-powered tools, job search, embassy finder, document generator — 100% free, no agents." />
        <meta name="keywords" content="Ausbildung Germany, apprenticeship Germany, vocational training Germany, Ausbildung for foreigners, Ausbildungsvisum, Germany training visa" />
        <meta property="og:title" content="AusbildungInGermany – Find Your Apprenticeship in Germany. Free. No Agents." />
        <meta property="og:description" content="The complete free platform to find, apply and succeed in German Ausbildung. AI-powered tools, job search, embassy finder, document generator — 100% free, no agents." />
        <meta property="og:url" content="https://ausbildungingermany.org/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AusbildungInGermany – Find Your Apprenticeship in Germany. Free. No Agents." />
        <meta name="twitter:description" content="The complete free platform to find, apply and succeed in German Ausbildung. AI-powered tools, job search, embassy finder, document generator — 100% free, no agents." />
        <link rel="canonical" href="https://ausbildungingermany.org/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd1 }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd2 }} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </Head>
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-badge">
          <div className="dot"></div>
          100% Free · No Agents · No Middlemen
        </div>
        <h1>Your <span className="highlight">Ausbildung</span> in<br /><span className="accent">Germany</span> starts here</h1>
        <p>The complete free platform for people from anywhere in the world to find, apply for, and succeed in German vocational training — powered by AI.</p>
        <div className="hero-actions">
          <a href="/eligibility" className="btn-hero-primary">🎯 Check My Eligibility →</a>
          <a href="/jobs" className="btn-hero-secondary">🔍 Search Jobs</a>
          <a href="/chat" className="btn-hero-secondary">💬 Ask AI</a>
        </div>
        <div className="hero-stats">
          <div className="stat"><div className="stat-num">350+</div><div className="stat-label">Ausbildung Fields</div></div>
          <div className="stat"><div className="stat-num">€900–€1,500</div><div className="stat-label">Monthly Salary</div></div>
          <div className="stat"><div className="stat-num">50+</div><div className="stat-label">Countries Supported</div></div>
          <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Free — No Agent Fees</div></div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-item"><span className="ti-icon">✅</span> No registration required</div>
        <div className="trust-item"><span className="ti-icon">🔒</span> Your data stays on your device</div>
        <div className="trust-item"><span className="ti-icon">🌍</span> Available in 6 languages</div>
        <div className="trust-item"><span className="ti-icon">🤖</span> AI-powered document generation</div>
        <div className="trust-item"><span className="ti-icon">🏛️</span> Official embassy appointment guidance</div>
      </div>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">Everything You Need</div>
            <div className="section-title">One platform.<br />Every tool you need.</div>
            <div className="section-subtitle">From finding the right Ausbildung to getting your visa — we guide you through every single step for free.</div>
          </div>
          <div className="features-grid reveal">
            <a href="/chat" className="feature-card"><div className="fc-icon">🤖</div><h3>AI Chatbot</h3><p>Ask anything about Ausbildung in your language. Get instant, accurate answers 24/7 — like having a personal advisor.</p><div className="fc-link">Start chatting →</div></a>
            <a href="/jobs" className="feature-card"><div className="fc-icon">🔍</div><h3>Job Finder</h3><p>Search real vacancies from Germany's official job database. Click "Apply with Help" and we guide you through the entire application.</p><div className="fc-link">Search jobs →</div></a>
            <a href="/generator" className="feature-card"><div className="fc-icon">📄</div><h3>Document Generator</h3><p>AI generates your German Lebenslauf, Bewerbungsschreiben, and interview prep — tailored to you and the specific job.</p><div className="fc-link">Generate documents →</div></a>
            <a href="/eligibility" className="feature-card"><div className="fc-icon">🎯</div><h3>Eligibility Checker</h3><p>Get your personal eligibility score in 2 minutes. See exactly what you qualify for and what to improve.</p><div className="fc-link">Check eligibility →</div></a>
            <a href="/embassy" className="feature-card"><div className="fc-icon">🗺️</div><h3>Embassy Finder</h3><p>Find your nearest German embassy with visa fees, requirements, and step-by-step appointment booking guidance.</p><div className="fc-link">Find embassy →</div></a>
            <a href="/checklist" className="feature-card"><div className="fc-icon">📋</div><h3>Document Checklist</h3><p>Personalized checklist based on your country, education, and German level. Know exactly what documents you need.</p><div className="fc-link">Get checklist →</div></a>
            <a href="/timeline" className="feature-card"><div className="fc-icon">📅</div><h3>Application Timeline</h3><p>Month-by-month personalized plan. Know exactly what to do and when to do it to maximize your chances.</p><div className="fc-link">Plan timeline →</div></a>
            <a href="/sectors" className="feature-card"><div className="fc-icon">🏭</div><h3>Sector Explorer</h3><p>Explore all 350+ Ausbildung fields with salary ranges, demand levels, and which are best for international applicants.</p><div className="fc-link">Explore sectors →</div></a>
            <a href="/sperrkonto" className="feature-card"><div className="fc-icon">🏦</div><h3>Sperrkonto Calculator</h3><p>Calculate exactly how much blocked account you need, compare providers, and understand how it works.</p><div className="fc-link">Calculate →</div></a>
            <a href="/salary" className="feature-card"><div className="fc-icon">💰</div><h3>Salary Calculator</h3><p>See your expected monthly salary, tax deductions, and net pay for any Ausbildung field and year of training.</p><div className="fc-link">Calculate salary →</div></a>
            <a href="/recognition" className="feature-card"><div className="fc-icon">🎓</div><h3>Qualification Recognition</h3><p>Check if your foreign diploma is recognized in Germany and how to get it officially recognized.</p><div className="fc-link">Check recognition →</div></a>
            <a href="/phrases" className="feature-card"><div className="fc-icon">💬</div><h3>German Phrase Helper</h3><p>Essential German phrases for the workplace, Berufsschule, emails, and interviews — with pronunciation guides.</p><div className="fc-link">Learn phrases →</div></a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="container">
          <div className="reveal" style={{textAlign:'center'}}>
            <div className="section-label">Simple Process</div>
            <div className="section-title">From anywhere in the world<br />to working in Germany</div>
          </div>
          <div className="steps-row reveal">
            <div className="step-item"><div className="step-circle">🎯</div><h3>Check Eligibility</h3><p>Get your score and know exactly what you need to improve</p></div>
            <div className="step-item"><div className="step-circle">🔍</div><h3>Find Your Job</h3><p>Search real vacancies from Germany's official database</p></div>
            <div className="step-item"><div className="step-circle">📄</div><h3>Generate Documents</h3><p>AI creates your German CV and cover letter in minutes</p></div>
            <div className="step-item"><div className="step-circle">🗺️</div><h3>Get Your Visa</h3><p>Embassy finder guides you through appointment booking</p></div>
            <div className="step-item"><div className="step-circle">🎉</div><h3>Start Ausbildung</h3><p>Begin earning €724–€1,500/month (minimum €724 by law) from day one</p></div>
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section className="sectors-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label" style={{color:'rgba(255,255,255,0.5)'}}>Top Sectors</div>
            <div className="section-title">Most in-demand for<br />international applicants</div>
            <div className="section-subtitle">Germany needs 400,000+ skilled workers every year. These sectors have the highest acceptance rates for foreigners.</div>
          </div>
          <div className="sectors-grid reveal">
            <a href="/sectors#it" className="sector-card"><span className="sc-emoji">💻</span><div className="sc-name">IT &amp; Technology</div><div className="sc-salary">€900–€1,200/month</div><div className="sc-demand">🔥 Very High Demand</div></a>
            <a href="/sectors#healthcare" className="sector-card"><span className="sc-emoji">🏥</span><div className="sc-name">Healthcare &amp; Nursing</div><div className="sc-salary">€1,000–€1,300/month</div><div className="sc-demand">🔥 Very High Demand</div></a>
            <a href="/sectors#logistics" className="sector-card"><span className="sc-emoji">🚚</span><div className="sc-name">Logistics &amp; Transport</div><div className="sc-salary">€700–€950/month</div><div className="sc-demand">📈 High Demand</div></a>
            <a href="/sectors#retail" className="sector-card"><span className="sc-emoji">🛒</span><div className="sc-name">Retail &amp; Commerce</div><div className="sc-salary">€620–€860/month</div><div className="sc-demand">📈 High Demand</div></a>
            <a href="/sectors#electrical" className="sector-card"><span className="sc-emoji">⚡</span><div className="sc-name">Electrical Engineering</div><div className="sc-salary">€850–€1,100/month</div><div className="sc-demand">🔥 Very High Demand</div></a>
            <a href="/sectors#construction" className="sector-card"><span className="sc-emoji">🏗️</span><div className="sc-name">Construction &amp; Trades</div><div className="sc-salary">€750–€1,000/month</div><div className="sc-demand">📈 High Demand</div></a>
            <a href="/sectors#hospitality" className="sector-card"><span className="sc-emoji">🍳</span><div className="sc-name">Hospitality &amp; Cooking</div><div className="sc-salary">€600–€850/month</div><div className="sc-demand">📊 Medium Demand</div></a>
            <a href="/sectors#mechatronics" className="sector-card"><span className="sc-emoji">🔧</span><div className="sc-name">Mechatronics</div><div className="sc-salary">€800–€1,100/month</div><div className="sc-demand">🔥 Very High Demand</div></a>
          </div>
          <div style={{textAlign:'center',marginTop:'32px'}}>
            <a href="/sectors" style={{color:'rgba(255,255,255,0.7)',fontSize:'15px',textDecoration:'none',borderBottom:'1px solid rgba(255,255,255,0.3)',paddingBottom:'2px'}}>View all 350+ sectors →</a>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY CTA */}
      <section className="elig-section">
        <div className="container">
          <div className="reveal">
            <div className="section-title">Are you eligible?<br />Find out in 2 minutes.</div>
            <p>Answer 8 quick questions and get your personal Ausbildung eligibility score with a detailed breakdown and action plan.</p>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'36px'}}>
              <div className="elig-score-preview">
                <div><div className="score">75</div><div className="score-label">/ 100</div></div>
                <div>
                  <div style={{fontSize:'13px',marginBottom:'8px',color:'rgba(255,255,255,0.8)'}}>Example score</div>
                  <div className="score-bar"><div className="score-fill"></div></div>
                  <div style={{fontSize:'12px',marginTop:'6px',color:'rgba(255,255,255,0.6)'}}>Good chance of success!</div>
                </div>
              </div>
            </div>
            <a href="/eligibility" className="btn-hero-primary" style={{display:'inline-flex',background:'#fff',color:'#1a56ff'}}>🎯 Check My Eligibility Now →</a>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="compare-section">
        <div className="container">
          <div className="reveal" style={{textAlign:'center'}}>
            <div className="section-label">Why Choose Us</div>
            <div className="section-title">We're different from everyone else</div>
          </div>
          <div className="reveal">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="highlight-col">✅ AusbildungInGermany</th>
                  <th>Agents / Consultants</th>
                  <th>Other Websites</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Cost</td><td className="highlight-col">100% Free</td><td>€200–€2,000+</td><td>Free (limited)</td></tr>
                <tr><td>AI Document Generation</td><td className="highlight-col"><span className="check">✓</span> German CV + Cover Letter</td><td>Manual templates</td><td><span className="cross">✗</span></td></tr>
                <tr><td>Real Job Search</td><td className="highlight-col"><span className="check">✓</span> Official BA database</td><td>Limited listings</td><td>Some</td></tr>
                <tr><td>Embassy Appointment Help</td><td className="highlight-col"><span className="check">✓</span> Step-by-step guidance</td><td>Extra fee</td><td><span className="cross">✗</span></td></tr>
                <tr><td>Eligibility Score</td><td className="highlight-col"><span className="check">✓</span> Instant personalized score</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td></tr>
                <tr><td>Multilingual Support</td><td className="highlight-col"><span className="check">✓</span> 6 languages</td><td>Usually English only</td><td>German/English only</td></tr>
                <tr><td>Privacy</td><td className="highlight-col"><span className="check">✓</span> Data stays on your device</td><td>Your data shared</td><td>Varies</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="reveal" style={{textAlign:'center'}}>
            <div className="section-label">Success Stories</div>
            <div className="section-title">People just like you<br />made it to Germany</div>
          </div>
          <div className="testimonials-grid reveal">
            <div className="testimonial-card"><div className="tc-stars">★★★★★</div><div className="tc-text">"I spent months looking for an agent to help me apply. Then I found this platform and did everything myself in 2 weeks. The CV generator created a perfect German Lebenslauf and I got an interview immediately."</div><div className="tc-author"><div className="tc-avatar">🇳🇬</div><div><div className="tc-name">Chukwuemeka A.</div><div className="tc-country">Lagos, Nigeria → Berlin</div></div></div></div>
            <div className="testimonial-card"><div className="tc-stars">★★★★★</div><div className="tc-text">"The embassy finder saved me so much confusion. I knew exactly which documents to bring, how much the visa costs, and even how to book the appointment. Everything was clear."</div><div className="tc-author"><div className="tc-avatar">🇳🇵</div><div><div className="tc-name">Sanjay T.</div><div className="tc-country">Kathmandu, Nepal → Munich</div></div></div></div>
            <div className="testimonial-card"><div className="tc-stars">★★★★★</div><div className="tc-text">"I was scared to apply without an agent. The AI chatbot answered all my questions at midnight when I was most worried. The document checklist made sure I missed nothing."</div><div className="tc-author"><div className="tc-avatar">🇵🇭</div><div><div className="tc-name">Maria C.</div><div className="tc-country">Manila, Philippines → Hamburg</div></div></div></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <div className="reveal" style={{textAlign:'center'}}>
            <div className="section-label">Common Questions</div>
            <div className="section-title">Everything you need to know</div>
          </div>
          <div className="faq-grid reveal">
            <div className="faq-item" onClick={e => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">Can I really apply for Ausbildung from abroad? <span className="faq-icon">+</span></div><div className="faq-a">Yes! Non-EU citizens can apply for Ausbildung in Germany. You need a valid passport, German language certificate (B1 minimum), school diploma, and an Ausbildungsvertrag (training contract) from a German company. Once you have the contract, you apply for an Ausbildungsvisum at the German embassy in your country.</div></div>
            <div className="faq-item" onClick={e => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">How much German do I need? <span className="faq-icon">+</span></div><div className="faq-a">Most Ausbildung programs require B1 German (CEFR intermediate level). Healthcare, nursing, and social work fields require B2. B1 is the official minimum required by the German embassy for the Ausbildung visa (§16a AufenthG).</div></div>
            <div className="faq-item" onClick={e => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">How much will I earn during Ausbildung? <span className="faq-icon">+</span></div><div className="faq-a">Ausbildung trainees earn a monthly salary (Ausbildungsvergütung) from day one. The legal minimum for 2026 is €724/month in Year 1 (set by BIBB). The national average was €1,133/month (BIBB data). You also receive full social benefits including statutory health insurance.</div></div>
            <div className="faq-item" onClick={e => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">Do I need to pay an agent? <span className="faq-icon">+</span></div><div className="faq-a">Absolutely not. Everything you need to apply for Ausbildung is free and public. Agents charge €200–€2,000 for services you can do yourself for free using this platform.</div></div>
            <div className="faq-item" onClick={e => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">What happens after Ausbildung? <span className="faq-icon">+</span></div><div className="faq-a">After completing Ausbildung, most trainees are hired directly by their training company. You can apply for a Skilled Worker residence permit (§18a AufenthG). After 2 years of qualified employment, you can apply for a settlement permit. German citizenship requires a minimum of 5 years of legal residence (2024 nationality reform). Dual citizenship is now officially permitted.</div></div>
            <div className="faq-item" onClick={e => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">What is a blocked account (Sperrkonto)? <span className="faq-icon">+</span></div><div className="faq-a">A blocked account (Sperrkonto) is sometimes needed to prove financial means for the visa. However, if your Ausbildung salary is at least €1,048 gross / €822 net per month (2026 threshold), the salary itself is sufficient proof. Providers include Fintiba and Expatrio.</div></div>
            <div className="faq-item" onClick={e => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">When should I apply? <span className="faq-icon">+</span></div><div className="faq-a">Germany has two main intake seasons: Summer (starting August/September — applications from October to March) and Winter (starting February/March — applications from June to November). Most companies advertise 6–12 months before the start date.</div></div>
            <div className="faq-item" onClick={e => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">Is my school diploma recognized in Germany? <span className="faq-icon">+</span></div><div className="faq-a">School diplomas from most countries are accepted for Ausbildung, but may need to be officially translated into German by a certified translator. University degrees may need formal recognition through the anabin database or KMK.</div></div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="reveal">
            <div className="section-title">Start your journey<br />to Germany today</div>
            <p>Everything is free. No registration. No agents. Just you and your future.</p>
            <div className="cta-buttons">
              <a href="/eligibility" className="btn-cta-white">🎯 Check My Eligibility</a>
              <a href="/jobs" className="btn-cta-outline">🔍 Search Jobs</a>
              <a href="/chat" className="btn-cta-outline">💬 Talk to AI</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{color:'#fff',fontSize:'16px',display:'flex',alignItems:'center',gap:'10px',fontWeight:800}}>
              <div style={{width:'36px',height:'36px',background:'#fff',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>🎓</div>
              AusbildungInGermany
            </div>
            <p>The complete free platform for people from developing countries to find and apply for Ausbildung in Germany — no agents, no fees, no middlemen.</p>
          </div>
          <div className="footer-col">
            <h4>Tools</h4>
            <a href="/jobs">Job Finder</a>
            <a href="/generator">Document Generator</a>
            <a href="/embassy">Embassy Finder</a>
            <a href="/checklist">Document Checklist</a>
            <a href="/myapplication">My Application</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="/eligibility">Eligibility Checker</a>
            <a href="/timeline">Timeline Planner</a>
            <a href="/sectors">Sector Explorer</a>
            <a href="/sperrkonto">Sperrkonto Calculator</a>
            <a href="/salary">Salary Calculator</a>
          </div>
          <div className="footer-col">
            <h4>Learn</h4>
            <a href="/recognition">Qualification Recognition</a>
            <a href="/phrases">German Phrases</a>
            <a href="/housing">Housing Guide</a>
            <a href="/templates">Email Templates</a>
            <a href="/chat">AI Chatbot</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AusbildungInGermany.org · 100% Free · No Agents</span>
          <span>Built to help people from all over the world to start a career in Germany 🌍</span>
        </div>
      </footer>

      {/* Share Bar */}
      <div id="shareBar" style={{position:'fixed',bottom:'24px',left:'24px',zIndex:8888,display:'flex',flexDirection:'column',gap:'8px'}}>
        <button onClick={() => window.shareWhatsApp && window.shareWhatsApp()} title="Share on WhatsApp" onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#25D366',color:'#fff',fontSize:'20px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',transition:'all .2s'}}>💬</button>
        <button onClick={() => window.shareFacebook && window.shareFacebook()} title="Share on Facebook" onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#1877F2',color:'#fff',fontSize:'18px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',transition:'all .2s'}}>f</button>
        <button onClick={() => window.copyLink && window.copyLink()} title="Copy link" onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#0a1628',color:'#fff',fontSize:'18px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',transition:'all .2s'}}>🔗</button>
        <button onClick={() => window.toggleFeedback && window.toggleFeedback()} title="Send feedback" onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#f5a623',color:'#fff',fontSize:'18px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',transition:'all .2s'}}>💡</button>
      </div>

      {/* Feedback Panel */}
      <div id="feedbackPanel" style={{display:'none',position:'fixed',bottom:'24px',left:'76px',zIndex:8889,background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'16px',padding:'20px',width:'300px',boxShadow:'0 8px 32px rgba(0,0,0,0.12)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
          <strong style={{fontFamily:'Outfit,sans-serif',fontSize:'15px',color:'#0a1628'}}>💡 Send Feedback</strong>
          <button onClick={() => window.toggleFeedback && window.toggleFeedback()} style={{background:'none',border:'none',fontSize:'18px',cursor:'pointer',color:'#718096'}}>×</button>
        </div>
        <p style={{fontSize:'13px',color:'#4a5568',marginBottom:'12px'}}>Found a bug, missing feature, or have a suggestion? Tell us!</p>
        <select id="fbType" style={{width:'100%',background:'#f8faff',border:'1.5px solid #e2e8f0',borderRadius:'8px',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',padding:'8px 12px',outline:'none',marginBottom:'10px'}}>
          <option>🐛 Bug / Something broken</option>
          <option>💡 Feature suggestion</option>
          <option>✏️ Wrong information</option>
          <option>🌍 Language / translation issue</option>
          <option>👍 General feedback</option>
        </select>
        <textarea id="fbText" placeholder="Describe the issue or idea..." style={{width:'100%',background:'#f8faff',border:'1.5px solid #e2e8f0',borderRadius:'8px',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',padding:'10px 12px',outline:'none',resize:'none',minHeight:'80px',marginBottom:'10px'}}></textarea>
        <button onClick={() => window.submitFeedback && window.submitFeedback()} style={{width:'100%',background:'#0a1628',color:'#fff',border:'none',borderRadius:'9px',fontFamily:'Outfit,sans-serif',fontSize:'14px',fontWeight:600,padding:'10px',cursor:'pointer',transition:'all .15s'}}>Send Feedback</button>
      </div>
    </>
  );
}
