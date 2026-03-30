import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { useEffect } from 'react';

export default function Recognition() {
  useEffect(() => {
    window.checkRecognition = function() {
      const country = document.getElementById('recCountry').value;
      const diploma = document.getElementById('diplomaType').value;
      const field = document.getElementById('recField').value;
      const translated = document.getElementById('translated').value;
      const needsTranslation = translated === 'no';

      let html = `<div class="result-header">
        <div class="result-icon">${diploma==='highschool'?'🏫':diploma==='bachelor'?'🎓':'📜'}</div>
        <div><div class="result-title">Recognition Status for ${country}</div>
        <div class="result-sub">${diploma==='highschool'?'High School Diploma':diploma==='bachelor'?"Bachelor's Degree":diploma==='vocational'?'Vocational Certificate':diploma==='master'?"Master's Degree":'Medical Degree'} · ${field}</div></div>
      </div>`;

      if (diploma === 'highschool') {
        html += `<div class="status-good">✅ <strong>Good news!</strong> High school diplomas (Class 10 or 12) from ${country} are generally accepted for Ausbildung in Germany. You do NOT need formal academic recognition for most vocational training programs.</div>`;
      } else if (diploma === 'bachelor' || diploma === 'master') {
        html += `<div class="status-warn">⚠️ <strong>Recognition may be needed.</strong> University degrees from ${country} need to be checked in the <a href="https://anabin.kmk.org" target="_blank" rel="noopener noreferrer" style="color:#d4890a;">anabin database</a>. For Ausbildung specifically, a high school diploma is usually sufficient — your university degree is a bonus.</div>`;
      } else if (diploma === 'medical') {
        html += `<div class="status-warn">⚠️ <strong>Special process required.</strong> Medical and nursing degrees require formal recognition by the responsible authority (Landesbehörde). This is more complex but special fast-track programs exist for nurses from India and Philippines.</div>`;
      }

      if (needsTranslation) {
        html += `<div class="status-warn">⚠️ <strong>Translation required!</strong> Your diploma must be officially translated into German by a certified translator (vereidigter Übersetzer). Cost: €50–€200 per document.</div>`;
      }

      html += `<h3 style="font-size:16px;font-weight:700;margin-bottom:16px;margin-top:8px;">📋 Steps to Get Your Diploma Recognized</h3>
      <div class="steps-list">
        <div class="step-item"><div class="step-num">1</div><div class="step-text"><h4>Check anabin Database</h4><p>Germany's official database of foreign qualifications. Search for ${country} to see how your diploma is classified. Website: <a href="https://anabin.kmk.org" target="_blank" rel="noopener noreferrer">anabin.kmk.org</a></p></div></div>
        <div class="step-item"><div class="step-num">2</div><div class="step-text"><h4>Get Official German Translation</h4><p>Find a certified translator (vereidigter Übersetzer) for ${country} documents. Cost: €50–€200 per document.</p></div></div>
        <div class="step-item"><div class="step-num">3</div><div class="step-text"><h4>Get Documents Notarized (if required)</h4><p>Some embassies require notarized copies. Get your diploma apostilled at the relevant ministry in ${country}. Cost: €20–€100.</p></div></div>
        ${diploma==='bachelor'||diploma==='master'?`<div class="step-item"><div class="step-num">4</div><div class="step-text"><h4>Apply for Recognition (if university degree)</h4><p>Apply through the ZAB (Zentralstelle für ausländisches Bildungswesen) or relevant Landesbehörde. Processing: 2–3 months. Cost: ~€200. Website: <a href="https://www.kmk.org" target="_blank" rel="noopener noreferrer">kmk.org</a></p></div></div>`:''}
        <div class="step-item"><div class="step-num">${diploma==='bachelor'||diploma==='master'?5:4}</div><div class="step-text"><h4>Include in Visa Application</h4><p>All translated and certified documents go in your visa application package. The embassy will verify them.</p></div></div>
      </div>
      <div class="info-box">💡 <strong>For Ausbildung specifically:</strong> Even without formal recognition, many employers in Germany accept foreign school diplomas for Ausbildung. The most important factor is your German language certificate — not your diploma's formal recognition status.</div>`;

      const result = document.getElementById('recResult');
      result.innerHTML = html;
      result.classList.add('show');
      result.scrollIntoView({behavior:'smooth'});
    };
  }, []);

  return (
    <>
      <Head>
        <title>Foreign Diploma Recognition in Germany – Ausbildung Guide</title>
        <meta name="description" content="Step-by-step guide to getting your foreign school diploma or degree recognised in Germany for Ausbildung applications." />
        <meta property="og:title" content="Foreign Diploma Recognition in Germany" />
        <meta property="og:url" content="https://ausbildungingermany.org/recognition" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <link rel="canonical" href="https://ausbildungingermany.org/recognition" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Foreign Diploma Recognition in Germany – Ausbildung Guide",
  "url": "https://ausbildungingermany.org/recognition",
  "description": "Step-by-step guide to getting your foreign school diploma or degree recognised in Germany for Ausbildung applications.",
  "author": {"@type": "Organization", "name": "AusbildungInGermany.org"},
  "publisher": {"@type": "Organization", "name": "AusbildungInGermany.org", "url": "https://ausbildungingermany.org"}
}` }} />
        <style dangerouslySetInnerHTML={{ __html: `
:root{--navy:#0a1628;--blue:#1a56ff;--gold:#f5a623;--green:#00c48c;--red:#ff4757;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#fff;--border:#e2e8f0;--font:'Outfit',sans-serif;}
*{box-sizing:border-box;margin:0;padding:0;}
body{padding-top:68px;background:var(--bg);color:var(--text);font-family:var(--font);}
main{max-width:860px;margin:0 auto;padding:32px 24px 80px;}
.page-label{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--blue);margin-bottom:12px;}
.page-title{font-size:clamp(32px,5vw,52px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;margin-bottom:12px;color:var(--navy);}
.page-sub{font-size:17px;color:var(--text2);margin-bottom:40px;}
.check-card{background:var(--surface);border:1.5px solid var(--border);border-radius:20px;padding:32px;margin-bottom:24px;}
.check-card h2{font-size:18px;font-weight:700;margin-bottom:20px;}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}
.cg-group{display:flex;flex-direction:column;gap:6px;}
.cg-label{font-size:13px;font-weight:600;color:var(--text2);}
.cg-input{background:var(--bg);border:1.5px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--font);font-size:14px;padding:10px 14px;outline:none;width:100%;}
.cg-input:focus{border-color:var(--blue);}
.check-btn{background:var(--navy);color:#fff;border:none;border-radius:12px;font-family:var(--font);font-size:15px;font-weight:700;padding:14px 32px;cursor:pointer;width:100%;transition:all 0.2s;}
.check-btn:hover{background:#0f2040;}
.result{display:none;background:var(--surface);border:1.5px solid var(--border);border-radius:20px;padding:32px;margin-bottom:24px;}
.result.show{display:block;}
.result-header{display:flex;align-items:center;gap:16px;margin-bottom:20px;}
.result-icon{font-size:40px;}
.result-title{font-size:22px;font-weight:800;color:var(--navy);}
.result-sub{font-size:14px;color:var(--text3);}
.steps-list{display:flex;flex-direction:column;gap:12px;margin:20px 0;}
.step-item{display:flex;gap:14px;background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:16px;}
.step-num{width:28px;height:28px;background:var(--navy);border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;}
.step-text h4{font-size:14px;font-weight:700;margin-bottom:3px;}
.step-text p{font-size:13px;color:var(--text2);line-height:1.6;}
.step-text a{color:var(--blue);text-decoration:none;}
.info-box{background:rgba(26,86,255,0.05);border:1px solid rgba(26,86,255,0.15);border-radius:12px;padding:20px;font-size:14px;color:var(--text2);line-height:1.7;margin-top:16px;}
.status-good{background:rgba(0,196,140,0.08);border:1px solid rgba(0,196,140,0.2);border-radius:12px;padding:16px;font-size:14px;color:var(--text2);line-height:1.7;margin-bottom:16px;}
.status-warn{background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:12px;padding:16px;font-size:14px;color:var(--text2);line-height:1.7;margin-bottom:16px;}
@media(max-width:600px){.cg{grid-template-columns:1fr;}}
` }} />
      </Head>

      <Nav />

      <main>
        <div className="page-label">Qualification Recognition</div>
        <div className="page-title">Is your diploma<br/>recognized in Germany?</div>
        <div className="page-sub">Check if your foreign school or university diploma is recognized in Germany — and how to get it officially recognized if needed.</div>

        <div className="check-card">
          <h2>🎓 Check My Qualification</h2>
          <div className="cg">
            <div className="cg-group">
              <label className="cg-label">Your Country</label>
              <select className="cg-input" id="recCountry">
                <option value="Nigeria">Nigeria</option><option value="India">India</option>
                <option value="Pakistan">Pakistan</option><option value="Philippines">Philippines</option>
                <option value="Nepal">Nepal</option><option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option><option value="Vietnam">Vietnam</option>
                <option value="Morocco">Morocco</option><option value="Turkey">Turkey</option>
                <option value="Egypt">Egypt</option><option value="Bangladesh">Bangladesh</option>
                <option value="Ethiopia">Ethiopia</option><option value="Indonesia">Indonesia</option>
                <option value="Other">Other country</option>
              </select>
            </div>
            <div className="cg-group">
              <label className="cg-label">Your Diploma Type</label>
              <select className="cg-input" id="diplomaType">
                <option value="highschool">High School Diploma (Class 10 or 12)</option>
                <option value="vocational">Vocational/Technical Certificate</option>
                <option value="bachelor">Bachelor&apos;s Degree</option>
                <option value="master">Master&apos;s Degree</option>
                <option value="medical">Medical/Nursing Degree</option>
              </select>
            </div>
            <div className="cg-group">
              <label className="cg-label">Target Ausbildung Field</label>
              <select className="cg-input" id="recField">
                <option>IT &amp; Technology</option>
                <option>Healthcare &amp; Nursing</option>
                <option>Electrical / Mechatronics</option>
                <option>Retail &amp; Commerce</option>
                <option>Logistics</option>
                <option>Construction &amp; Trades</option>
                <option>Other</option>
              </select>
            </div>
            <div className="cg-group">
              <label className="cg-label">Is your diploma translated to German?</label>
              <select className="cg-input" id="translated">
                <option value="no">No, not yet</option>
                <option value="yes">Yes, I have a German translation</option>
                <option value="certified">Yes, certified by official translator</option>
              </select>
            </div>
          </div>
          <button className="check-btn" onClick={() => window.checkRecognition && window.checkRecognition()}>🎓 Check Recognition Status</button>
        </div>

        <div className="result" id="recResult"></div>
      </main>

      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px 60px'}}>
        <h2 style={{fontFamily:'Outfit,sans-serif',fontSize:'17px',fontWeight:800,color:'#0a1628',marginBottom:'14px'}}>Related Resources</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'10px'}}>
          <Link href="/checklist" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>📋</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Document Checklist</div><div style={{color:'#718096',fontSize:'12px'}}>Documents needed for recognition</div></div></Link>
          <Link href="/timeline" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>📅</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Timeline Planner</div><div style={{color:'#718096',fontSize:'12px'}}>When to start the recognition process</div></div></Link>
          <Link href="/embassy" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>🗺️</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Embassy Finder</div><div style={{color:'#718096',fontSize:'12px'}}>Contact your nearest German embassy</div></div></Link>
          <Link href="/phrases" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>💬</span><div><div style={{fontWeight:700,fontSize:'13px'}}>German Phrases</div><div style={{color:'#718096',fontSize:'12px'}}>Communicate with German authorities</div></div></Link>
        </div>
      </section>
    </>
  );
}
