import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

export default function Landing() {
  const { lang } = useLang();
  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    window.toggleFaq = function(el) { el.classList.toggle('open'); };

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>AusbildungInGermany – Find Your Apprenticeship in Germany. Free. No Agents.</title>
        <meta name="description" content="The complete free platform to find, apply, and succeed in German Ausbildung. AI-powered tools, job search, embassy finder, document generator — no agents needed." />
        <meta property="og:title" content="AusbildungInGermany – Find Your Apprenticeship in Germany" />
        <meta property="og:url" content="https://www.ausbildungingermany.org/landing" />
        <meta property="og:image" content="https://www.ausbildungingermany.org/icon-512.png" />
        <link rel="canonical" href="https://www.ausbildungingermany.org/landing" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AusbildungInGermany",
  "url": "https://ausbildungingermany.org",
  "description": "The complete free platform to find, apply, and succeed in German Ausbildung.",
  "publisher": {"@type": "Organization", "name": "AusbildungInGermany.org", "url": "https://ausbildungingermany.org", "logo": {"@type": "ImageObject", "url": "https://www.ausbildungingermany.org/icon-512.png"}}
}` }} />
        <style dangerouslySetInnerHTML={{ __html: `
:root{--navy:#0a1628;--navy2:#0f2040;--blue:#1a56ff;--blue2:#4f7fff;--gold:#f5a623;--green:#00c48c;--red:#ff4757;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#ffffff;--border:#e2e8f0;--font-display:'Outfit',sans-serif;--font-body:'Outfit',sans-serif;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
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
.hero p{font-size:clamp(17px,2vw,21px);color:var(--text2);max-width:620px;margin-bottom:44px;line-height:1.6;animation:fadeUp 0.7s ease 0.2s both;}
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
.sector-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:22px;text-decoration:none;color:#fff;transition:all 0.2s;}
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
.tc-text{font-size:15px;color:var(--text2);line-height:1.7;margin-bottom:20px;font-style:italic;}
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
` }} />
      </Head>

      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-badge"><div className="dot"></div>100% Free · No Agents · No Middlemen</div>
        <h1>Your <span className="highlight">Ausbildung</span> in<br/><span className="accent">Germany</span> starts here</h1>
        <p>The complete free platform for people from anywhere in the world to find, apply for, and succeed in German vocational training — powered by AI.</p>
        <div className="hero-actions">
          <Link href="/eligibility" className="btn-hero-primary">🎯 Check My Eligibility →</Link>
          <Link href="/jobs" className="btn-hero-secondary">🔍 Search Jobs</Link>
          <Link href="/generator" className="btn-hero-secondary">📄 Generate Documents</Link>
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
        <div className="trust-item"><span className="ti-icon">🤖</span> AI-powered document generation</div>
        <div className="trust-item"><span className="ti-icon">🏛️</span> Official embassy appointment guidance</div>
      </div>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">Everything You Need</div>
            <div className="section-title">One platform.<br/>Every tool you need.</div>
            <div className="section-subtitle">From finding the right Ausbildung to getting your visa — we guide you through every single step for free.</div>
          </div>
          <div className="features-grid reveal">
            <Link href="/generator" className="feature-card"><div className="fc-icon">🤖</div><h3>Document Generator</h3><p>Ask anything about Ausbildung in your language. Get instant, accurate answers 24/7 — like having a personal advisor.</p><div className="fc-link">Start chatting →</div></Link>
            <Link href="/jobs" className="feature-card"><div className="fc-icon">🔍</div><h3>Job Finder</h3><p>Search real vacancies from Germany&apos;s official job database. Click &quot;Apply with Help&quot; and we guide you through the entire application.</p><div className="fc-link">Search jobs →</div></Link>
            <Link href="/generator" className="feature-card"><div className="fc-icon">📄</div><h3>Document Generator</h3><p>AI generates your German Lebenslauf, Bewerbungsschreiben, and interview prep — tailored to you and the specific job.</p><div className="fc-link">Generate documents →</div></Link>
            <Link href="/eligibility" className="feature-card"><div className="fc-icon">🎯</div><h3>Eligibility Checker</h3><p>Get your personal eligibility score in 2 minutes. See exactly what you qualify for and what to improve.</p><div className="fc-link">Check eligibility →</div></Link>
            <Link href="/embassy" className="feature-card"><div className="fc-icon">🗺️</div><h3>Embassy Finder</h3><p>Find your nearest German embassy with visa fees, requirements, and step-by-step appointment booking guidance.</p><div className="fc-link">Find embassy →</div></Link>
            <Link href="/checklist" className="feature-card"><div className="fc-icon">📋</div><h3>Document Checklist</h3><p>Personalized checklist based on your country, education, and German level. Know exactly what documents you need.</p><div className="fc-link">Get checklist →</div></Link>
            <Link href="/timeline" className="feature-card"><div className="fc-icon">📅</div><h3>Application Timeline</h3><p>Month-by-month personalized plan. Know exactly what to do and when to do it to maximize your chances.</p><div className="fc-link">Plan timeline →</div></Link>
            <Link href="/sectors" className="feature-card"><div className="fc-icon">🏭</div><h3>Sector Explorer</h3><p>Explore all 350+ Ausbildung fields with salary ranges, demand levels, and which are best for international applicants.</p><div className="fc-link">Explore sectors →</div></Link>
            <Link href="/sperrkonto" className="feature-card"><div className="fc-icon">🏦</div><h3>Sperrkonto Calculator</h3><p>Calculate exactly how much blocked account you need, compare providers, and understand how it works.</p><div className="fc-link">Calculate →</div></Link>
            <Link href="/salary" className="feature-card"><div className="fc-icon">💰</div><h3>Salary Calculator</h3><p>See your expected monthly salary, tax deductions, and net pay for any Ausbildung field and year of training.</p><div className="fc-link">Calculate salary →</div></Link>
            <Link href="/recognition" className="feature-card"><div className="fc-icon">🎓</div><h3>Qualification Recognition</h3><p>Check if your foreign diploma is recognized in Germany and how to get it officially recognized.</p><div className="fc-link">Check recognition →</div></Link>
            <Link href="/phrases" className="feature-card"><div className="fc-icon">💬</div><h3>German Phrase Helper</h3><p>Essential German phrases for the workplace, Berufsschule, emails, and interviews — with pronunciation guides.</p><div className="fc-link">Learn phrases →</div></Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="container">
          <div className="reveal" style={{textAlign:'center'}}>
            <div className="section-label">Simple Process</div>
            <div className="section-title">From anywhere in the world<br/>to working in Germany</div>
          </div>
          <div className="steps-row reveal">
            <div className="step-item"><div className="step-circle">🎯</div><h3>Check Eligibility</h3><p>Get your score and know exactly what you need to improve</p></div>
            <div className="step-item"><div className="step-circle">🔍</div><h3>Find Your Job</h3><p>Search real vacancies from Germany&apos;s official database</p></div>
            <div className="step-item"><div className="step-circle">📄</div><h3>Generate Documents</h3><p>AI creates your German CV and cover letter in minutes</p></div>
            <div className="step-item"><div className="step-circle">🗺️</div><h3>Get Your Visa</h3><p>Embassy finder guides you through appointment booking</p></div>
            <div className="step-item"><div className="step-circle">🎉</div><h3>Start Ausbildung</h3><p>Begin earning €724–€1,500/month from day one</p></div>
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section className="sectors-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label" style={{color:'rgba(255,255,255,0.5)'}}>Top Sectors</div>
            <div className="section-title">Most in-demand for<br/>international applicants</div>
            <div className="section-subtitle">Germany needs 400,000+ skilled workers every year. These sectors have the highest acceptance rates for foreigners.</div>
          </div>
          <div className="sectors-grid reveal">
            <Link href="/sectors" className="sector-card"><span className="sc-emoji">💻</span><div className="sc-name">IT &amp; Technology</div><div className="sc-salary">€900–€1,200/month</div><div className="sc-demand">🔥 Very High Demand</div></Link>
            <Link href="/sectors" className="sector-card"><span className="sc-emoji">🏥</span><div className="sc-name">Healthcare &amp; Nursing</div><div className="sc-salary">€1,000–€1,300/month</div><div className="sc-demand">🔥 Very High Demand</div></Link>
            <Link href="/sectors" className="sector-card"><span className="sc-emoji">🚚</span><div className="sc-name">Logistics &amp; Transport</div><div className="sc-salary">€700–€950/month</div><div className="sc-demand">📈 High Demand</div></Link>
            <Link href="/sectors" className="sector-card"><span className="sc-emoji">🛒</span><div className="sc-name">Retail &amp; Commerce</div><div className="sc-salary">€620–€860/month</div><div className="sc-demand">📈 High Demand</div></Link>
            <Link href="/sectors" className="sector-card"><span className="sc-emoji">⚡</span><div className="sc-name">Electrical Engineering</div><div className="sc-salary">€850–€1,100/month</div><div className="sc-demand">🔥 Very High Demand</div></Link>
            <Link href="/sectors" className="sector-card"><span className="sc-emoji">🏗️</span><div className="sc-name">Construction &amp; Trades</div><div className="sc-salary">€750–€1,000/month</div><div className="sc-demand">📈 High Demand</div></Link>
            <Link href="/sectors" className="sector-card"><span className="sc-emoji">🍳</span><div className="sc-name">Hospitality &amp; Cooking</div><div className="sc-salary">€600–€850/month</div><div className="sc-demand">📊 Medium Demand</div></Link>
            <Link href="/sectors" className="sector-card"><span className="sc-emoji">🔧</span><div className="sc-name">Mechatronics</div><div className="sc-salary">€800–€1,100/month</div><div className="sc-demand">🔥 Very High Demand</div></Link>
          </div>
          <div style={{textAlign:'center',marginTop:'32px'}}>
            <Link href="/sectors" style={{color:'rgba(255,255,255,0.7)',fontSize:'15px',textDecoration:'none',borderBottom:'1px solid rgba(255,255,255,0.3)',paddingBottom:'2px'}}>View all 350+ sectors →</Link>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY CTA */}
      <section className="elig-section">
        <div className="container">
          <div className="reveal">
            <div className="section-title">Are you eligible?<br/>Find out in 2 minutes.</div>
            <p>Answer 8 quick questions and get your personal Ausbildung eligibility score with a detailed breakdown and action plan.</p>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'36px'}}>
              <div className="elig-score-preview">
                <div><div className="score">75</div><div className="score-label">/ 100</div></div>
                <div><div style={{fontSize:'13px',marginBottom:'8px',color:'rgba(255,255,255,0.8)'}}>Example score</div><div className="score-bar"><div className="score-fill"></div></div><div style={{fontSize:'12px',marginTop:'6px',color:'rgba(255,255,255,0.6)'}}>Good chance of success!</div></div>
              </div>
            </div>
            <Link href="/eligibility" className="btn-hero-primary" style={{display:'inline-flex',background:'#fff',color:'#1a56ff'}}>🎯 Check My Eligibility Now →</Link>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="compare-section">
        <div className="container">
          <div className="reveal" style={{textAlign:'center'}}>
            <div className="section-label">Why Choose Us</div>
            <div className="section-title">We&apos;re different from everyone else</div>
          </div>
          <div className="reveal">
            <table className="compare-table">
              <thead><tr><th>Feature</th><th className="highlight-col">✅ AusbildungInGermany</th><th>Agents / Consultants</th><th>Other Websites</th></tr></thead>
              <tbody>
                <tr><td>Cost</td><td className="highlight-col">100% Free</td><td>€200–€2,000+</td><td>Free (limited)</td></tr>
                <tr><td>AI Document Generation</td><td className="highlight-col"><span className="check">✓</span> German CV + Cover Letter</td><td>Manual templates</td><td><span className="cross">✗</span></td></tr>
                <tr><td>Real Job Search</td><td className="highlight-col"><span className="check">✓</span> Official BA database</td><td>Limited listings</td><td>Some</td></tr>
                <tr><td>Embassy Appointment Help</td><td className="highlight-col"><span className="check">✓</span> Step-by-step guidance</td><td>Extra fee</td><td><span className="cross">✗</span></td></tr>
                <tr><td>Eligibility Score</td><td className="highlight-col"><span className="check">✓</span> Instant personalized score</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td></tr>
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
            <div className="section-title">People just like you<br/>made it to Germany</div>
          </div>
          <div className="testimonials-grid reveal">
            <div className="testimonial-card"><div className="tc-stars">★★★★★</div><div className="tc-text">&quot;I spent months looking for an agent to help me apply. Then I found this platform and did everything myself in 2 weeks. The CV generator created a perfect German Lebenslauf and I got an interview immediately.&quot;</div><div className="tc-author"><div className="tc-avatar">🇳🇬</div><div><div className="tc-name">Chukwuemeka A.</div><div className="tc-country">Lagos, Nigeria → Berlin</div></div></div></div>
            <div className="testimonial-card"><div className="tc-stars">★★★★★</div><div className="tc-text">&quot;The embassy finder saved me so much confusion. I knew exactly which documents to bring, how much the visa costs, and even how to book the appointment. Everything was clear.&quot;</div><div className="tc-author"><div className="tc-avatar">🇳🇵</div><div><div className="tc-name">Sanjay T.</div><div className="tc-country">Kathmandu, Nepal → Munich</div></div></div></div>
            <div className="testimonial-card"><div className="tc-stars">★★★★★</div><div className="tc-text">&quot;I was scared to apply without an agent. The document generator and checklist made everything so clear. I knew exactly what to prepare and nothing was missing from my application.&quot;</div><div className="tc-author"><div className="tc-avatar">🇵🇭</div><div><div className="tc-name">Maria C.</div><div className="tc-country">Manila, Philippines → Hamburg</div></div></div></div>
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
            <div className="faq-item" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">Can I really apply for Ausbildung from abroad? <span className="faq-icon">+</span></div><div className="faq-a">Yes! Non-EU citizens can apply for Ausbildung in Germany. You need a valid passport, German language certificate (B1 minimum), school diploma, and an Ausbildungsvertrag from a German company. Once you have the contract, you apply for an Ausbildungsvisum at the German embassy in your country.</div></div>
            <div className="faq-item" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">How much German do I need? <span className="faq-icon">+</span></div><div className="faq-a">Most Ausbildung programs require B1 German (CEFR intermediate level). Healthcare, nursing, and social work fields require B2. B1 is the official minimum required by the German embassy for the Ausbildung visa (§16a AufenthG).</div></div>
            <div className="faq-item" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">How much will I earn during Ausbildung? <span className="faq-icon">+</span></div><div className="faq-a">Ausbildung trainees earn a monthly salary from day one. The legal minimum for 2026 is €724/month in Year 1. Most trainees earn the average of €1,133/month across all sectors (BIBB 2024 data). You also receive full social benefits including statutory health insurance.</div></div>
            <div className="faq-item" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">Do I need to pay an agent? <span className="faq-icon">+</span></div><div className="faq-a">Absolutely not. Everything you need to apply for Ausbildung is free and public. Agents charge €200–€2,000 for services you can do yourself for free using this platform.</div></div>
            <div className="faq-item" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">What happens after Ausbildung? <span className="faq-icon">+</span></div><div className="faq-a">After completing Ausbildung, most trainees are hired directly by their training company. You can apply for a Skilled Worker residence permit (§18a AufenthG). After 2 years of qualified employment, you can apply for permanent residency. German citizenship requires a minimum of 5 years of legal residence.</div></div>
            <div className="faq-item" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">What is a blocked account (Sperrkonto)? <span className="faq-icon">+</span></div><div className="faq-a">A blocked account (Sperrkonto) is sometimes needed to prove financial means for the visa. However, if your Ausbildung salary is at least €1,048 gross per month (2026 threshold), the salary itself is sufficient proof — you may not need a separate blocked account.</div></div>
            <div className="faq-item" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">When should I apply? <span className="faq-icon">+</span></div><div className="faq-a">Germany has two main intake seasons: Summer (starting August/September — applications from October to March) and Winter (starting February/March — applications from June to November). Apply early — the best positions fill up fast!</div></div>
            <div className="faq-item" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><div className="faq-q">Is my school diploma recognized in Germany? <span className="faq-icon">+</span></div><div className="faq-a">School diplomas from most countries are accepted for Ausbildung, but may need to be officially translated into German by a certified translator. Use our Qualification Recognition tool to check your specific diploma.</div></div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="reveal">
            <div className="section-title">Start your journey<br/>to Germany today</div>
            <p>Everything is free. No registration. No agents. Just you and your future.</p>
            <div className="cta-buttons">
              <Link href="/eligibility" className="btn-cta-white">🎯 Check My Eligibility</Link>
              <Link href="/jobs" className="btn-cta-outline">🔍 Search Jobs</Link>
              <Link href="/generator" className="btn-cta-outline">📄 Generate Documents</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{display:'flex',alignItems:'center',gap:'10px',color:'#fff',fontSize:'16px',fontWeight:800}}>
              <div style={{width:'36px',height:'36px',background:'#1a56ff',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>🎓</div>
              AusbildungInGermany
            </div>
            <p>The complete free platform for people from developing countries to find and apply for Ausbildung in Germany — no agents, no fees, no middlemen.</p>
          </div>
          <div className="footer-col">
            <h4>Tools</h4>
            <Link href="/jobs">Job Finder</Link>
            <Link href="/generator">Document Generator</Link>
            <Link href="/embassy">Embassy Finder</Link>
            <Link href="/checklist">Document Checklist</Link>
            <Link href="/myapplication">My Application</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link href="/eligibility">Eligibility Checker</Link>
            <Link href="/timeline">Timeline Planner</Link>
            <Link href="/sectors">Sector Explorer</Link>
            <Link href="/sperrkonto">Sperrkonto Calculator</Link>
            <Link href="/salary">Salary Calculator</Link>
          </div>
          <div className="footer-col">
            <h4>Learn</h4>
            <Link href="/recognition">Qualification Recognition</Link>
            <Link href="/phrases">German Phrases</Link>
            <Link href="/housing">Housing Guide</Link>
            <Link href="/templates">Email Templates</Link>
            <Link href="/generator">Document Generator</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AusbildungInGermany.org · 100% Free · No Agents</span>
          <span>Built to help people from all over the world to start a career in Germany 🌍</span>
        </div>
      </footer>
    </>
  );
}
