import Head from 'next/head';
import { useEffect } from 'react';
import Nav from '../components/Nav';

export default function Sperrkonto() {
  useEffect(() => {
    window.calculate = function() {
      const salary = parseInt(document.getElementById('sectorSel').value);
      const rent = parseInt(document.getElementById('citySize').value);
      const housingHelp = parseInt(document.getElementById('housing').value);
      const actualRent = Math.max(0, rent - housingHelp);
      const food = 350, transport = 80, misc = 150;
      const monthlyNeeded = actualRent + food + transport + misc;
      const total = monthlyNeeded * 12;
      const recommended = Math.max(total, 11904);
      document.getElementById('reqAmount').textContent = '€' + recommended.toLocaleString();
      document.getElementById('breakdownGrid').innerHTML = `
        <div class="bg-item"><div class="bg-label">Monthly Rent</div><div class="bg-val">€${actualRent}/mo</div></div>
        <div class="bg-item"><div class="bg-label">Food & Groceries</div><div class="bg-val">€${food}/mo</div></div>
        <div class="bg-item"><div class="bg-label">Transport</div><div class="bg-val">€${transport}/mo</div></div>
        <div class="bg-item"><div class="bg-label">Other Expenses</div><div class="bg-val">€${misc}/mo</div></div>
        <div class="bg-item"><div class="bg-label">Monthly Total</div><div class="bg-val">€${monthlyNeeded}/mo</div></div>
        <div class="bg-item"><div class="bg-label">Your Salary (Yr 1)</div><div class="bg-val" style="color:#00c48c">~€${salary}/mo</div></div>`;
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
        <title>Sperrkonto Calculator – German Blocked Account for Visa</title>
        <meta name="description" content="Calculate how much you need in your German Sperrkonto (blocked account) for your Ausbildung visa application." />
        <meta property="og:title" content="Sperrkonto Calculator – German Blocked Account for Visa" />
        <meta property="og:url" content="https://ausbildungingermany.org/sperrkonto" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <link rel="canonical" href="https://ausbildungingermany.org/sperrkonto" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Sperrkonto Calculator – German Blocked Account for Visa",
  "url": "https://ausbildungingermany.org/sperrkonto",
  "description": "Calculate how much you need in your German Sperrkonto (blocked account) for your Ausbildung visa application.",
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
.calc-card h2{font-size:18px;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:10px;}
.calc-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}
.cg-group{display:flex;flex-direction:column;gap:6px;}
.cg-label{font-size:13px;font-weight:600;color:#4a5568;}
.cg-input{background:#f8faff;border:1.5px solid #e2e8f0;border-radius:10px;color:#0a1628;font-family:'Outfit',sans-serif;font-size:14px;padding:10px 14px;outline:none;width:100%;}
.cg-input:focus{border-color:#1a56ff;}
.result-hero{background:linear-gradient(135deg,#0a1628,#1a56ff);border-radius:16px;padding:32px;text-align:center;color:#fff;margin-bottom:24px;}
.result-amount{font-size:56px;font-weight:900;letter-spacing:-2px;margin-bottom:8px;}
.result-label{font-size:16px;opacity:0.8;}
.result-note{font-size:13px;opacity:0.6;margin-top:8px;}
.breakdown-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px;}
.bg-item{background:#f8faff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;}
.bg-label{font-size:12px;color:#718096;margin-bottom:4px;}
.bg-val{font-size:16px;font-weight:700;}
.providers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.provider-card{border:1.5px solid #e2e8f0;border-radius:14px;padding:20px;text-align:center;transition:all 0.2s;}
.provider-card:hover{border-color:#1a56ff;transform:translateY(-2px);}
.pc-name{font-size:16px;font-weight:800;margin-bottom:4px;}
.pc-fee{font-size:13px;color:#718096;margin-bottom:12px;}
.pc-pros{font-size:12px;color:#4a5568;line-height:1.6;margin-bottom:12px;text-align:left;}
.pc-btn{background:#0a1628;color:#fff;border:none;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;padding:9px 16px;cursor:pointer;width:100%;text-decoration:none;display:block;transition:all 0.15s;}
.pc-btn:hover{background:#0f2040;}
.info-box{background:rgba(26,86,255,0.05);border:1px solid rgba(26,86,255,0.15);border-radius:12px;padding:20px;margin-bottom:16px;font-size:14px;color:#4a5568;line-height:1.7;}
.calc-btn{background:#0a1628;color:#fff;border:none;border-radius:12px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;padding:14px 32px;cursor:pointer;width:100%;transition:all 0.2s;margin-top:4px;}
.calc-btn:hover{background:#0f2040;}
.results-section{display:none;}.results-section.show{display:block;}
@media(max-width:600px){.calc-grid{grid-template-columns:1fr;}.breakdown-grid{grid-template-columns:1fr 1fr;}.providers-grid{grid-template-columns:1fr;}}
        ` }} />
      </Head>
      <Nav />

      <main>
        <div className="page-label">Sperrkonto Calculator</div>
        <div className="page-title">How much blocked account<br />do you need?</div>
        <div className="page-sub">Calculate your exact Sperrkonto requirement, compare providers, and understand how the blocked account system works.</div>

        <div className="info-box">
          💡 <strong>What is a Sperrkonto?</strong> A blocked account (Sperrkonto) may be needed for your Ausbildung visa. <strong>Important 2026 update:</strong> If your company-based Ausbildung salary is at least <strong>€1,048 gross / €822 net per month</strong>, your salary alone is proof enough — you do NOT need a separate blocked account. If your salary is below this, you supplement the difference. The blocked account is <strong>YOUR money</strong> — not a fee. You withdraw it monthly once training starts.
        </div>

        <div className="calc-card">
          <h2>🧮 Calculate My Sperrkonto</h2>
          <div className="calc-grid">
            <div className="cg-group">
              <label className="cg-label">Ausbildung start month</label>
              <select className="cg-input" id="startMonth">
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m,i) => (
                  <option key={m} value={i+1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="cg-group">
              <label className="cg-label">Your Ausbildung sector</label>
              <select className="cg-input" id="sectorSel">
                <option value="800">IT & Technology (~€800–1,050/mo)</option>
                <option value="1100">Healthcare & Nursing (~€1,100–1,300/mo)</option>
                <option value="900">Electrical / Mechatronics (~€900–1,100/mo)</option>
                <option value="750">Logistics (~€750–950/mo)</option>
                <option value="700">Retail & Commerce (~€700–900/mo)</option>
                <option value="750">Construction (~€750–1,000/mo)</option>
                <option value="650">Hospitality (~€650–800/mo)</option>
              </select>
            </div>
            <div className="cg-group">
              <label className="cg-label">City size</label>
              <select className="cg-input" id="citySize">
                <option value="1200">Major city (Berlin, Munich, Hamburg, Frankfurt)</option>
                <option value="900">Medium city (Cologne, Stuttgart, Düsseldorf)</option>
                <option value="700">Small city or rural area</option>
              </select>
            </div>
            <div className="cg-group">
              <label className="cg-label">Company provides housing?</label>
              <select className="cg-input" id="housing">
                <option value="0">No (I need to find my own)</option>
                <option value="300">Yes (company provides or subsidizes)</option>
              </select>
            </div>
          </div>
          <button className="calc-btn" onClick={() => window.calculate && window.calculate()}>🧮 Calculate My Sperrkonto</button>
        </div>

        <div className="results-section" id="results">
          <div className="result-hero">
            <div className="result-amount" id="reqAmount">€11,208</div>
            <div className="result-label">Recommended Sperrkonto Amount</div>
            <div className="result-note">This is your money — you withdraw it monthly once your Ausbildung salary begins</div>
          </div>
          <div className="breakdown-grid" id="breakdownGrid"></div>

          <div className="calc-card">
            <h2>🏦 Compare Sperrkonto Providers</h2>
            <div className="providers-grid">
              <div className="provider-card">
                <div className="pc-name">🟢 Fintiba</div>
                <div className="pc-fee">Setup fee: €159 one-time + €9.90/month</div>
                <div className="pc-pros">• Most popular for Ausbildung<br />• Fast setup (24–48 hrs)<br />• English support<br />• Embassy-recognized worldwide</div>
                <a href="https://www.fintiba.com" target="_blank" className="pc-btn">Open with Fintiba →</a>
              </div>
              <div className="provider-card">
                <div className="pc-name">🔵 Expatrio</div>
                <div className="pc-fee">Setup fee: lower than Fintiba (check current rates at expatrio.com)</div>
                <div className="pc-pros">• Cheaper setup fee<br />• Health insurance bundle available<br />• English & German support<br />• 3–5 day setup</div>
                <a href="https://www.expatrio.com" target="_blank" className="pc-btn">Open with Expatrio →</a>
              </div>
              <div className="provider-card">
                <div className="pc-name">🏛️ Deutsche Bank</div>
                <div className="pc-fee">No setup fee</div>
                <div className="pc-pros">• Free to open<br />• Traditional bank<br />• May require in-person visit<br />• Slower process (2–4 weeks)</div>
                <a href="https://www.deutsche-bank.de" target="_blank" className="pc-btn">Open with Deutsche Bank →</a>
              </div>
            </div>
          </div>

          <div className="info-box" style={{marginTop:0}}>
            📋 <strong>How to use your Sperrkonto:</strong> After depositing, you receive a confirmation letter. Attach this to your visa application. Once in Germany and your salary starts, you can withdraw the blocked amount in equal monthly installments (€992/month, 2026 official rate). The money is yours — it never expires.
          </div>
        </div>
      </main>

      {/* Related Resources */}
      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px 60px'}}>
        <h2 style={{fontFamily:'Outfit,sans-serif',fontSize:'17px',fontWeight:800,color:'#0a1628',marginBottom:'14px'}}>Related Resources</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'10px'}}>
          {[
            {href:'/salary',icon:'💰',title:'Salary Calculator',sub:'Check your expected income'},
            {href:'/checklist',icon:'📋',title:'Document Checklist',sub:'Full list of required documents'},
            {href:'/embassy',icon:'🗺️',title:'Embassy Finder',sub:'Book your visa appointment'},
            {href:'/timeline',icon:'📅',title:'Timeline Planner',sub:'Step-by-step application plan'},
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
