import Head from 'next/head';
import { useEffect } from 'react';
import Nav from '../components/Nav';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

export default function Salary() {
  const { lang } = useLang();
  useEffect(() => {
    window.calcSalary = function() {
      const cl = localStorage.getItem('aig_lang') || 'en';
      const sectorVals = document.getElementById('sector').value.split(',').map(Number);
      const [y1g, y2g, y3g] = sectorVals;
      const rent = parseInt(document.getElementById('living').value);
      const deductPct = 0.21;
      const y1n = Math.round(y1g * (1 - deductPct));
      const y2n = Math.round(y2g * (1 - deductPct));
      const y3n = Math.round(y3g * (1 - deductPct));

      document.getElementById('yearsRow').innerHTML = `
        <div class="year-card y1"><div class="yc-year">${t(cl,'salary.year1')}</div><div class="yc-gross" style="color:#1a56ff">€${y1g}</div><div class="yc-net">${t(cl,'salary.net_label',{amount:y1n})}</div></div>
        <div class="year-card y2"><div class="yc-year">${t(cl,'salary.year2')}</div><div class="yc-gross" style="color:#d4890a">€${y2g}</div><div class="yc-net">${t(cl,'salary.net_label',{amount:y2n})}</div></div>
        <div class="year-card y3"><div class="yc-year">${t(cl,'salary.year3')}</div><div class="yc-gross" style="color:#00c48c">€${y3g}</div><div class="yc-net">${t(cl,'salary.net_label',{amount:y3n})}</div></div>`;

      const tax = Math.round(y1g * 0.08);
      const health = Math.round(y1g * 0.073);
      const pension = Math.round(y1g * 0.093);
      const unemp = Math.round(y1g * 0.013);
      const care = Math.round(y1g * 0.018);
      const total_ded = tax + health + pension + unemp + care;
      const net = y1g - total_ded;
      const food = 350, transport = 80, misc = 120;
      const savings = net - rent - food - transport - misc;

      document.getElementById('breakdownTable').innerHTML = `
        <thead><tr><th>${t(cl,'salary.col_category')}</th><th>${t(cl,'salary.col_monthly')}</th></tr></thead>
        <tbody>
        <tr><td>${t(cl,'salary.gross')}</td><td>€${y1g}</td></tr>
        <tr><td class="td-red">${t(cl,'salary.tax')}</td><td class="td-red">-€${tax}</td></tr>
        <tr><td class="td-red">${t(cl,'salary.health')}</td><td class="td-red">-€${health}</td></tr>
        <tr><td class="td-red">${t(cl,'salary.pension')}</td><td class="td-red">-€${pension}</td></tr>
        <tr><td class="td-red">${t(cl,'salary.unemp')}</td><td class="td-red">-€${unemp}</td></tr>
        <tr><td class="td-red">${t(cl,'salary.care')}</td><td class="td-red">-€${care}</td></tr>
        <tr><td><strong>${t(cl,'salary.net_takehome')}</strong></td><td class="td-green"><strong>€${net}</strong></td></tr>
        <tr><td>${t(cl,'salary.rent')}</td><td class="td-red">-€${rent}</td></tr>
        <tr><td>${t(cl,'salary.food')}</td><td class="td-red">-€${food}</td></tr>
        <tr><td>${t(cl,'salary.transport')}</td><td class="td-red">-€${transport}</td></tr>
        <tr><td>${t(cl,'salary.misc')}</td><td class="td-red">-€${misc}</td></tr>
        <tr><td><strong>${t(cl,'salary.savings')}</strong></td><td class="${savings >= 0 ? 'td-green' : 'td-red'}"><strong>${savings >= 0 ? '€' + savings : '⚠️ -€' + Math.abs(savings)}</strong></td></tr>
        </tbody>`;

      document.getElementById('postRow').innerHTML = `
        <div class="post-card"><div class="pc-label">After Ausbildung (qualified worker)</div><div class="pc-val" style="color:#00c48c">€2,000–€3,500/mo</div></div>
        <div class="post-card"><div class="pc-label">Annual gross after training</div><div class="pc-val" style="color:#f5a623">€24,000–€42,000/yr</div></div>`;

      document.getElementById('results').classList.add('show');
      document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    };

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
      const text = document.getElementById('fbText').value.trim();
      if (!text) { alert('Please write your feedback!'); return; }
      document.getElementById('feedbackPanel').innerHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:32px;margin-bottom:10px;">🙏</div><strong style="font-family:Outfit,sans-serif;font-size:16px;color:#0a1628;">Thank you!</strong><p style="font-size:13px;color:#718096;margin-top:8px;">Your feedback helps us improve AusbildungInGermany for everyone.</p></div>';
      setTimeout(() => { document.getElementById('feedbackPanel').style.display = 'none'; }, 3000);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Ausbildung Salary Calculator 2026 – Net Pay After Tax</title>
        <meta name="description" content="Calculate your net Ausbildung salary after tax and social contributions. See minimum and average pay by sector for 2026." />
        <meta property="og:title" content="Ausbildung Salary Calculator 2026" />
        <meta property="og:description" content="Calculate your net Ausbildung salary after tax and social contributions." />
        <meta property="og:url" content="https://ausbildungingermany.org/salary" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <link rel="canonical" href="https://ausbildungingermany.org/salary" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Ausbildung Salary Calculator 2026",
  "url": "https://ausbildungingermany.org/salary",
  "description": "Calculate your net Ausbildung salary after tax and social contributions. See minimum and average pay by sector for 2026.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"},
  "publisher": {"@type": "Organization", "name": "AusbildungInGermany.org", "url": "https://ausbildungingermany.org"}
}` }} />
        <style dangerouslySetInnerHTML={{ __html: `
body{padding-top:68px;}
:root{--navy:#0a1628;--blue:#1a56ff;--gold:#f5a623;--green:#00c48c;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#fff;--border:#e2e8f0;--font:'Outfit',sans-serif;}
main{max-width:860px;margin:0 auto;padding:40px 24px 80px;}
.page-label{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1a56ff;margin-bottom:12px;}
.page-title{font-size:clamp(32px,5vw,52px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;margin-bottom:12px;color:#0a1628;}
.page-sub{font-size:17px;color:#4a5568;margin-bottom:40px;}
.calc-card{background:#fff;border:1.5px solid #e2e8f0;border-radius:20px;padding:32px;margin-bottom:24px;}
.calc-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}
.cg-group{display:flex;flex-direction:column;gap:6px;}
.cg-label{font-size:13px;font-weight:600;color:#4a5568;}
.cg-input{background:#f8faff;border:1.5px solid #e2e8f0;border-radius:10px;color:#0a1628;font-family:'Outfit',sans-serif;font-size:14px;padding:10px 14px;outline:none;width:100%;}
.cg-input:focus{border-color:#1a56ff;}
.calc-btn{background:#0a1628;color:#fff;border:none;border-radius:12px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;padding:14px 32px;cursor:pointer;width:100%;transition:all 0.2s;}
.calc-btn:hover{background:#0f2040;}
.results{display:none;}.results.show{display:block;}
.years-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;}
.year-card{border-radius:16px;padding:24px;text-align:center;border:1.5px solid #e2e8f0;}
.year-card.y1{background:rgba(26,86,255,0.04);border-color:rgba(26,86,255,0.2);}
.year-card.y2{background:rgba(245,166,35,0.04);border-color:rgba(245,166,35,0.2);}
.year-card.y3{background:rgba(0,196,140,0.04);border-color:rgba(0,196,140,0.2);}
.yc-year{font-size:13px;font-weight:600;color:#718096;margin-bottom:4px;}
.yc-gross{font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:4px;}
.yc-net{font-size:14px;color:#718096;}
.breakdown-table{width:100%;border-collapse:collapse;margin-bottom:16px;}
.breakdown-table th{background:#0a1628;color:#fff;padding:12px 16px;text-align:left;font-size:13px;font-weight:600;}
.breakdown-table td{padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;}
.breakdown-table tr:last-child td{border-bottom:none;font-weight:700;}
.breakdown-table tr:nth-child(even) td{background:#f8faff;}
.td-red{color:#e53e3e;}.td-green{color:#00c48c;}
.post-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px;}
.post-card{background:#f8faff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;}
.pc-label{font-size:12px;color:#718096;margin-bottom:4px;}
.pc-val{font-size:18px;font-weight:800;}
.info-note{background:rgba(0,196,140,0.06);border:1px solid rgba(0,196,140,0.2);border-radius:12px;padding:16px;font-size:14px;color:#4a5568;line-height:1.7;margin-bottom:16px;}
@media(max-width:600px){.calc-grid{grid-template-columns:1fr;}.years-row{grid-template-columns:1fr;}.post-row{grid-template-columns:1fr;}}
        ` }} />
      </Head>
      <Nav />

      <main>
        <div className="page-label">{t(lang,'salary.label')}</div>
        <div className="page-title">{t(lang,'salary.title')}</div>
        <div className="page-sub">{t(lang,'salary.sub')}</div>

        <div style={{background:'rgba(26,86,255,0.06)',border:'1px solid rgba(26,86,255,0.2)',borderRadius:'12px',padding:'16px',marginBottom:'28px',fontSize:'14px',color:'#4a5568',lineHeight:'1.7'}}>
          📌 <strong>Official 2026 Legal Minimum (BIBB):</strong> Year 1: <strong>€724/mo</strong> · Year 2: <strong>€854/mo</strong> · Year 3: <strong>€977/mo</strong>. Most employers pay significantly above this — the national average across all sectors was <strong>€1,133/month</strong> in 2024.
        </div>

        <div className="calc-card">
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'20px'}}>💰 Calculate My Salary</h2>
          <div className="calc-grid">
            <div className="cg-group">
              <label className="cg-label">{t(lang,'salary.sector_label')}</label>
              <select className="cg-input" id="sector">
                <option value="900,1050,1200">IT & Technology (avg ~€1,050/mo)</option>
                <option value="1000,1150,1300">Healthcare & Nursing</option>
                <option value="880,1000,1100">Electrical Engineering (avg ~€1,000/mo)</option>
                <option value="860,990,1120">Mechatronics (avg ~€990/mo)</option>
                <option value="790,930,1060">Logistics (avg ~€930/mo)</option>
                <option value="750,880,1000">Retail & Commerce (avg ~€880/mo)</option>
                <option value="820,960,1090">Construction & Trades (avg ~€960/mo)</option>
                <option value="724,854,977">Hospitality (minimum by law 2026)</option>
                <option value="950,1100,1250">Banking & Finance (avg ~€1,100/mo)</option>
              </select>
            </div>
            <div className="cg-group">
              <label className="cg-label">{t(lang,'salary.state_label')}</label>
              <select className="cg-input" id="state">
                <option value="Bayern">Bavaria (Bayern)</option>
                <option value="Berlin">Berlin</option>
                <option value="NRW">North Rhine-Westphalia</option>
                <option value="BaWü">Baden-Württemberg</option>
                <option value="Hamburg">Hamburg</option>
                <option value="Other">Other State</option>
              </select>
            </div>
            <div className="cg-group">
              <label className="cg-label">{t(lang,'salary.duration_label')}</label>
              <select className="cg-input" id="duration">
                <option value="2">2 years</option>
                <option value="3" defaultValue="3">3 years</option>
                <option value="3.5">3.5 years</option>
              </select>
            </div>
            <div className="cg-group">
              <label className="cg-label">{t(lang,'salary.living_label')}</label>
              <select className="cg-input" id="living">
                <option value="1200">Own flat — major city (€900–1,200 rent)</option>
                <option value="900">Shared flat WG — major city (€600–900)</option>
                <option value="600">Shared flat WG — smaller city (€400–600)</option>
                <option value="0">Company provides housing</option>
              </select>
            </div>
          </div>
          <button className="calc-btn" onClick={() => window.calcSalary && window.calcSalary()}>{t(lang,'salary.btn_calculate')}</button>
        </div>

        <div className="results" id="results">
          <div className="years-row" id="yearsRow"></div>
          <div className="calc-card">
            <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'20px'}}>{t(lang,'salary.breakdown_title')}</h2>
            <table className="breakdown-table" id="breakdownTable"></table>
          </div>
          <div className="post-row" id="postRow"></div>
          <div className="info-note" style={{marginTop:'20px'}}>
            💡 <strong>After Ausbildung:</strong> Starting salaries for qualified workers range from €2,000–€3,500/month depending on sector. Many trainees receive full-time job offers from their training company.
          </div>
        </div>
      </main>

      {/* Related Resources */}
      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px 60px'}}>
        <h2 style={{fontFamily:'Outfit,sans-serif',fontSize:'17px',fontWeight:800,color:'#0a1628',marginBottom:'14px'}}>{t(lang,'common.related')}</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'10px'}}>
          {[
            {href:'/housing',icon:'🏠',title:'Housing Guide',sub:'Find affordable accommodation'},
            {href:'/sperrkonto',icon:'🏦',title:'Sperrkonto Calculator',sub:'How much blocked account you need'},
            {href:'/jobs',icon:'🔍',title:'Job Finder',sub:'Browse Ausbildung positions'},
            {href:'/checklist',icon:'📋',title:'Document Checklist',sub:'All documents you need'},
          ].map(r => (
            <a key={r.href} href={r.href} style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500,transition:'all .15s'}}>
              <span style={{fontSize:'22px'}}>{r.icon}</span>
              <div><div style={{fontWeight:700,fontSize:'13px'}}>{r.title}</div><div style={{color:'#718096',fontSize:'12px'}}>{r.sub}</div></div>
            </a>
          ))}
        </div>
      </section>

      {/* Share & Feedback Bar */}
      <div id="shareBar" style={{position:'fixed',bottom:'24px',left:'24px',zIndex:8888,display:'flex',flexDirection:'column',gap:'8px'}}>
        <button onClick={() => window.shareWhatsApp && window.shareWhatsApp()} title="Share on WhatsApp" style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#25D366',color:'#fff',fontSize:'20px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>💬</button>
        <button onClick={() => window.shareFacebook && window.shareFacebook()} title="Share on Facebook" style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#1877F2',color:'#fff',fontSize:'18px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>f</button>
        <button onClick={() => window.copyLink && window.copyLink()} title="Copy link" style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#0a1628',color:'#fff',fontSize:'18px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>🔗</button>
        <button onClick={() => window.toggleFeedback && window.toggleFeedback()} title="Send feedback" style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#f5a623',color:'#fff',fontSize:'18px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>💡</button>
      </div>

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
        <button onClick={() => window.submitFeedback && window.submitFeedback()} style={{width:'100%',background:'#0a1628',color:'#fff',border:'none',borderRadius:'9px',fontFamily:'Outfit,sans-serif',fontSize:'14px',fontWeight:600,padding:'10px',cursor:'pointer'}}>Send Feedback</button>
      </div>
    </>
  );
}
