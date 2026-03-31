import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

export default function Housing() {
  const { lang } = useLang();
  return (
    <>
      <Head>
        <title>Finding Housing in Germany for Ausbildung Trainees</title>
        <meta name="description" content="Guide to finding accommodation in Germany as an Ausbildung trainee — dormitories, WGs, and tips for international applicants." />
        <meta property="og:title" content="Finding Housing in Germany for Ausbildung Trainees" />
        <meta property="og:url" content="https://ausbildungingermany.org/housing" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <link rel="canonical" href="https://ausbildungingermany.org/housing" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Finding Housing in Germany for Ausbildung Trainees",
  "url": "https://ausbildungingermany.org/housing",
  "description": "Guide to finding accommodation in Germany as an Ausbildung trainee — dormitories, WGs, and tips for international applicants.",
  "author": {"@type": "Organization", "name": "AusbildungInGermany.org"},
  "publisher": {"@type": "Organization", "name": "AusbildungInGermany.org", "url": "https://ausbildungingermany.org"}
}` }} />
        <style dangerouslySetInnerHTML={{ __html: `
:root{--navy:#0a1628;--blue:#1a56ff;--gold:#f5a623;--green:#00c48c;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#fff;--border:#e2e8f0;--font:'Outfit',sans-serif;}
*{box-sizing:border-box;margin:0;padding:0;}
body{padding-top:68px;background:var(--bg);color:var(--text);font-family:var(--font);}
main{max-width:960px;margin:0 auto;padding:32px 24px 80px;}
.page-label{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--blue);margin-bottom:12px;}
.page-title{font-size:clamp(32px,5vw,52px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;margin-bottom:12px;color:var(--navy);}
.page-sub{font-size:17px;color:var(--text2);margin-bottom:40px;}
.info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:32px;}
.info-card{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:24px;}
.ic-icon{font-size:32px;margin-bottom:12px;}
.ic-title{font-size:16px;font-weight:700;margin-bottom:8px;}
.ic-text{font-size:14px;color:var(--text2);line-height:1.7;}
.ic-badge{display:inline-block;margin-top:10px;font-size:12px;font-weight:600;padding:4px 10px;border-radius:6px;}
.badge-green{background:rgba(0,196,140,0.1);color:#00a878;}
.badge-gold{background:rgba(245,166,35,0.1);color:#d4890a;}
.section-title{font-size:22px;font-weight:800;letter-spacing:-0.5px;color:var(--navy);margin-bottom:16px;margin-top:32px;}
.platform-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin-bottom:32px;}
.platform-card{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:20px;text-decoration:none;color:var(--text);transition:all 0.2s;display:block;}
.platform-card:hover{border-color:var(--blue);transform:translateY(-2px);}
.pc-name{font-size:16px;font-weight:700;margin-bottom:4px;}
.pc-desc{font-size:13px;color:var(--text2);margin-bottom:10px;line-height:1.5;}
.pc-tags{display:flex;gap:6px;flex-wrap:wrap;}
.pc-tag{font-size:11px;background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:2px 7px;color:var(--text3);}
.tips-list{display:flex;flex-direction:column;gap:12px;margin-bottom:32px;}
.tip-item{background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:18px;display:flex;gap:14px;}
.tip-icon{font-size:22px;flex-shrink:0;}
.tip-text h4{font-size:14px;font-weight:700;margin-bottom:4px;}
.tip-text p{font-size:13px;color:var(--text2);line-height:1.6;}
.costs-table{width:100%;border-collapse:collapse;margin-bottom:24px;background:var(--surface);border-radius:12px;overflow:hidden;}
.costs-table th{background:var(--navy);color:#fff;padding:12px 16px;text-align:left;font-size:13px;}
.costs-table td{padding:12px 16px;border-bottom:1px solid var(--border);font-size:14px;}
.costs-table tr:last-child td{border-bottom:none;}
.costs-table tr:nth-child(even) td{background:var(--bg);}
` }} />
      </Head>

      <Nav />

      <main>
        <div className="page-label">{t(lang,'housing.label')}</div>
        <div className="page-title">Finding accommodation<br/>in Germany</div>
        <div className="page-sub">{t(lang,'housing.sub')}</div>

        <div className="info-grid">
          <div className="info-card"><div className="ic-icon">🏠</div><div className="ic-title">{t(lang,'housing.wg_title')}</div><div className="ic-text">{t(lang,'housing.wg_text')}</div><span className="ic-badge badge-green">{t(lang,'housing.wg_badge')}</span></div>
          <div className="info-card"><div className="ic-icon">🏢</div><div className="ic-title">{t(lang,'housing.apt_title')}</div><div className="ic-text">{t(lang,'housing.apt_text')}</div><span className="ic-badge badge-gold">{t(lang,'housing.apt_badge')}</span></div>
          <div className="info-card"><div className="ic-icon">🏭</div><div className="ic-title">{t(lang,'housing.company_title')}</div><div className="ic-text">{t(lang,'housing.company_text')}</div><span className="ic-badge badge-green">{t(lang,'housing.company_badge')}</span></div>
          <div className="info-card"><div className="ic-icon">🛏️</div><div className="ic-title">{t(lang,'housing.temp_title')}</div><div className="ic-text">{t(lang,'housing.temp_text')}</div><span className="ic-badge badge-gold">{t(lang,'housing.temp_badge')}</span></div>
        </div>

        <div className="section-title">{t(lang,'housing.platforms_title')}</div>
        <div className="platform-grid">
          <a href="https://www.wg-gesucht.de" target="_blank" rel="noopener noreferrer" className="platform-card"><div className="pc-name">🏠 WG-Gesucht.de</div><div className="pc-desc">Germany&apos;s #1 platform for shared flats. Free to search. Most listings. Create a profile and apply to rooms.</div><div className="pc-tags"><span className="pc-tag">Free</span><span className="pc-tag">WG rooms</span><span className="pc-tag">Best for trainees</span></div></a>
          <a href="https://www.immoscout24.de" target="_blank" rel="noopener noreferrer" className="platform-card"><div className="pc-name">🏢 ImmobilienScout24</div><div className="pc-desc">Germany&apos;s largest real estate platform. Good for own apartments. Many listings across all cities.</div><div className="pc-tags"><span className="pc-tag">All types</span><span className="pc-tag">Large database</span></div></a>
          <a href="https://www.immonet.de" target="_blank" rel="noopener noreferrer" className="platform-card"><div className="pc-name">🔍 Immonet.de</div><div className="pc-desc">Alternative to ImmobilienScout. Good selection especially in smaller cities and rural areas.</div><div className="pc-tags"><span className="pc-tag">All types</span><span className="pc-tag">Rural areas</span></div></a>
          <a href="https://www.ebay-kleinanzeigen.de" target="_blank" rel="noopener noreferrer" className="platform-card"><div className="pc-name">📋 eBay Kleinanzeigen</div><div className="pc-desc">Classifieds with many private listings. Often cheaper than agencies. Now called &quot;Kleinanzeigen&quot;.</div><div className="pc-tags"><span className="pc-tag">Private landlords</span><span className="pc-tag">Often cheaper</span></div></a>
        </div>

        <div className="section-title">{t(lang,'housing.costs_title')}</div>
        <table className="costs-table">
          <thead><tr><th>{t(lang,'housing.cost_city')}</th><th>{t(lang,'housing.cost_wg')}</th><th>{t(lang,'housing.cost_1room')}</th><th>{t(lang,'housing.cost_2room')}</th></tr></thead>
          <tbody>
            <tr><td>🏙️ Munich (München)</td><td>€700–1,000</td><td>€1,200–1,800</td><td>€1,600–2,400</td></tr>
            <tr><td>🏙️ Frankfurt</td><td>€600–900</td><td>€1,000–1,500</td><td>€1,400–2,000</td></tr>
            <tr><td>🏙️ Berlin</td><td>€550–850</td><td>€900–1,400</td><td>€1,200–1,800</td></tr>
            <tr><td>🏙️ Hamburg</td><td>€600–900</td><td>€1,000–1,500</td><td>€1,300–1,900</td></tr>
            <tr><td>🏘️ Cologne (Köln)</td><td>€500–750</td><td>€800–1,200</td><td>€1,100–1,600</td></tr>
            <tr><td>🏘️ Stuttgart</td><td>€550–800</td><td>€900–1,300</td><td>€1,200–1,700</td></tr>
            <tr><td>🌾 Rural areas / small cities</td><td>€300–550</td><td>€450–750</td><td>€600–1,000</td></tr>
          </tbody>
        </table>

        <div className="section-title">{t(lang,'housing.tips_title')}</div>
        <div className="tips-list">
          <div className="tip-item"><div className="tip-icon">📝</div><div className="tip-text"><h4>{t(lang,'housing.tip1_title')}</h4><p>{t(lang,'housing.tip1_text')}</p></div></div>
          <div className="tip-item"><div className="tip-icon">💳</div><div className="tip-text"><h4>{t(lang,'housing.tip2_title')}</h4><p>{t(lang,'housing.tip2_text')}</p></div></div>
          <div className="tip-item"><div className="tip-icon">🔍</div><div className="tip-text"><h4>{t(lang,'housing.tip3_title')}</h4><p>{t(lang,'housing.tip3_text')}</p></div></div>
          <div className="tip-item"><div className="tip-icon">🗣️</div><div className="tip-text"><h4>{t(lang,'housing.tip4_title')}</h4><p>{t(lang,'housing.tip4_text')}</p></div></div>
          <div className="tip-item"><div className="tip-icon">🏢</div><div className="tip-text"><h4>{t(lang,'housing.tip5_title')}</h4><p>{t(lang,'housing.tip5_text')}</p></div></div>
          <div className="tip-item"><div className="tip-icon">⚠️</div><div className="tip-text"><h4>{t(lang,'housing.tip6_title')}</h4><p>{t(lang,'housing.tip6_text')}</p></div></div>
        </div>
      </main>

      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px 60px'}}>
        <h2 style={{fontFamily:'Outfit,sans-serif',fontSize:'17px',fontWeight:800,color:'#0a1628',marginBottom:'14px'}}>{t(lang,'common.related')}</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'10px'}}>
          <Link href="/salary" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>💰</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Salary Calculator</div><div style={{color:'#718096',fontSize:'12px'}}>Check net pay by sector</div></div></Link>
          <Link href="/sperrkonto" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>🏦</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Sperrkonto Calculator</div><div style={{color:'#718096',fontSize:'12px'}}>Blocked account requirements</div></div></Link>
          <Link href="/timeline" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>📅</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Timeline Planner</div><div style={{color:'#718096',fontSize:'12px'}}>When to start your housing search</div></div></Link>
          <Link href="/checklist" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>📋</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Document Checklist</div><div style={{color:'#718096',fontSize:'12px'}}>Documents needed for renting</div></div></Link>
        </div>
      </section>
    </>
  );
}
