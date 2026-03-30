import Head from 'next/head';
import { useEffect } from 'react';
import Nav from '../components/Nav';

export default function Checklist() {
  useEffect(() => {
    const countryNames = {NP:'Nepal',NG:'Nigeria',IN:'India',PK:'Pakistan',PH:'Philippines',GH:'Ghana',VN:'Vietnam',TR:'Turkey',BD:'Bangladesh',KE:'Kenya',EG:'Egypt',MA:'Morocco',TN:'Tunisia',LK:'Sri Lanka',ID:'Indonesia',BR:'Brazil',CO:'Colombia',MX:'Mexico',ET:'Ethiopia',CM:'Cameroon',UZ:'Uzbekistan',KZ:'Kazakhstan',UA:'Ukraine',GE:'Georgia',OTHER:'your country'};
    let checkedState = {};

    window.setQuick = function(code) {
      document.getElementById('countrySelect').value = code;
      document.querySelectorAll('.quick-btn').forEach(b => {
        b.classList.toggle('active', b.textContent.trim().startsWith(code));
      });
    };

    window.generateChecklist = function() {
      const country = document.getElementById('countrySelect').value;
      const education = document.getElementById('educationSelect').value;
      const german = document.getElementById('germanSelect').value;
      const cName = countryNames[country] || country;
      const hasB1 = german.startsWith('B1') || german.startsWith('B2') || german.startsWith('C1') || german.startsWith('C2');

      const items = [];
      items.push({title:'Valid Passport',desc:'Must be valid for at least 6 months beyond the planned start date. Ensure at least 2 blank pages for visa stamps.',cat:'essential',req:true,tip:'Apply for renewal early if your passport expires within 18 months.'});
      items.push({title:'Ausbildungsvertrag (Training Contract)',desc:'Signed training contract from a German company. This is the single most important document — without it, no visa is possible.',cat:'essential',req:true,tip:'Use our Job Finder to search for open Ausbildung positions and apply directly.'});
      items.push({title:'School Diploma / Leaving Certificate',desc:'Your highest completed school qualification. Must be officially translated into German by a certified translator.',cat:'essential',req:true});
      items.push({title:'Certified German Translation of Diploma',desc:'Your diploma must be translated by a sworn/certified translator (beeidigter Übersetzer). Some embassies accept English translations as well.',cat:'essential',req:true,tip:'Find certified translators through your local German embassy website.'});
      items.push({title:'German Language Certificate (B1 minimum)',desc:'B1 is the minimum for most Ausbildung programs. Accepted certificates: Goethe-Institut, telc, TestDaF, ÖSD.',cat:'essential',req:true,tip:hasB1?'You already meet this requirement — make sure to bring the original certificate.':'Start learning German immediately. B1 typically takes 6–9 months of intensive study.'});
      items.push({title:'Visa Application Form',desc:'The official visa application form (Antrag auf Erteilung eines nationalen Visums). Download from the embassy website.',cat:'visa',req:true,tip:'Fill it out in German or English. Use our Embassy Finder to get the correct form.'});
      items.push({title:'Biometric Passport Photos',desc:'2 recent biometric passport photos (35mm × 45mm), white background, taken within the last 6 months.',cat:'visa',req:true});
      items.push({title:'Proof of Health Insurance',desc:"Travel health insurance valid from your arrival date. Once you start Ausbildung, you'll be enrolled in statutory health insurance automatically.",cat:'visa',req:true,tip:'Providers like Mawista, DR-WALTER, or Care Concept offer affordable travel insurance.'});
      items.push({title:'Motivation Letter (Bewerbungsschreiben)',desc:'A letter explaining why you want to do this specific Ausbildung in Germany. Write in German if possible.',cat:'visa',req:true,tip:'Use our Document Generator to create a professional Bewerbungsschreiben.'});
      items.push({title:'CV / Lebenslauf (German format)',desc:'A tabular CV in German format with photo, personal details, education, and work experience in reverse chronological order.',cat:'visa',req:true,tip:'German CVs are different from English ones. Use our Document Generator for the correct format.'});
      items.push({title:'Police Clearance Certificate',desc:"A certificate of good conduct from your home country's police authority. Must be recent (usually within 6 months).",cat:'visa',req:true,tip:'Processing times vary by country — apply early.'});
      items.push({title:'Proof of Financial Means',desc:'Either your Ausbildung salary confirmation (if ≥ €1,048 gross/month) or a blocked account (Sperrkonto). The 2026 threshold is €11,904/year.',cat:'financial',req:true,tip:'If your salary covers the threshold, the training contract itself serves as proof.'});
      items.push({title:'Blocked Account (Sperrkonto) — if salary is below threshold',desc:'A blocked savings account proving you can support yourself. Required if your Ausbildung salary is below €1,048 gross/month.',cat:'financial',req:false,tip:'Use our Sperrkonto Calculator to determine if you need one and how much to deposit.'});
      if (education === "Bachelor's Degree" || education === "Master's Degree") {
        items.push({title:'University Degree Certificate (translated)',desc:'Include the original and certified German translation. This can strengthen your application.',cat:'optional',req:false,tip:'Check anabin database (anabin.kmk.org) to see if your degree is recognized.'});
      }
      if (education === 'No Formal Diploma') {
        items.push({title:'Alternative Qualification Proof',desc:'Gather all available training certificates, employer references, and proof of professional experience.',cat:'essential',req:true,tip:'Speak with potential employers about their specific requirements.'});
      }
      items.push({title:'Diploma Recognition (Anerkennung) — if required',desc:'Some embassies require that your school diploma be checked for equivalence with German qualifications through anabin or KMK.',cat:'optional',req:false,tip:'Use our Qualification Recognition tool to check if your diploma needs formal recognition.'});
      items.push({title:'Proof of Accommodation in Germany',desc:'A letter confirming where you will live in Germany (from landlord, host family, or student housing).',cat:'optional',req:false,tip:'Your employer may help arrange initial housing. Ask in the interview.'});
      items.push({title:'Birth Certificate (translated)',desc:'Original birth certificate with certified German translation. Required by some embassies.',cat:'optional',req:false});
      items.push({title:'Proof of Previous Work Experience',desc:'Employment references or certificates from previous jobs, especially if relevant to the Ausbildung field.',cat:'optional',req:false});

      checkedState = {};
      renderChecklist(items, cName, education, german);
    };

    function renderChecklist(items, cName, education, german) {
      const r = document.getElementById('results');
      const totalReq = items.filter(i => i.req).length;
      const cats = [
        {key:'essential',label:'Essential'},
        {key:'visa',label:'Visa'},
        {key:'financial',label:'Financial'},
        {key:'optional',label:'Optional'}
      ];

      let html = '';
      html += `<div class="progress-card" id="progressCard"><div class="progress-header"><span>Your progress: <span id="checkedCount">0</span> / ${items.length} items checked</span><span class="progress-sub">${totalReq} required</span></div><div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:0%"></div></div></div>`;
      html += `<div class="summary-card"><h3>📍 Checklist for ${cName}</h3><p>Based on your profile (${education}, ${german}), here are all the documents you need to apply for Ausbildung in Germany. Required items are marked with a red badge. Check off items as you complete them.</p></div>`;

      cats.forEach(cat => {
        const catItems = items.map((item, idx) => ({item, idx})).filter(ci => ci.item.cat === cat.key);
        if (catItems.length === 0) return;
        html += `<div class="cat-${cat.key}"><div class="category-heading"><span class="cat-badge">${cat.label}</span><span class="cat-count">(${catItems.length} items)</span></div>`;
        catItems.forEach(({item: i, idx}) => {
          html += `<div class="checklist-item" id="item-${idx}" onclick="window.toggleItem(${idx},${items.length})"><div class="check-box" id="cb-${idx}"></div><div class="item-content"><div class="item-header"><span class="item-title" id="title-${idx}">${i.title}</span>${i.req ? '<span class="req-badge">Required</span>' : ''}</div><div class="item-desc">${i.desc}</div>${i.tip ? `<div class="item-tip">💡 <strong>Tip:</strong> ${i.tip}</div>` : ''}</div></div>`;
        });
        html += `</div>`;
      });

      html += `<div class="disclaimer"><p><strong>⚠️ Disclaimer:</strong> This checklist is based on general requirements. Always verify with the German embassy in your country. Use our <a href="/embassy">Embassy Finder</a> to find your embassy's specific requirements.</p></div>`;
      r.innerHTML = html;
      r.classList.add('show');
      r.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.toggleItem = function(idx, total) {
      checkedState[idx] = !checkedState[idx];
      const el = document.getElementById('item-' + idx);
      const cb = document.getElementById('cb-' + idx);
      if (checkedState[idx]) {
        el.classList.add('checked');
        cb.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      } else {
        el.classList.remove('checked');
        cb.innerHTML = '';
      }
      let count = 0;
      for (const k in checkedState) if (checkedState[k]) count++;
      document.getElementById('checkedCount').textContent = count;
      document.getElementById('progressFill').style.width = Math.round((count / total) * 100) + '%';
    };
  }, []);

  return (
    <>
      <Head>
        <title>Document Checklist – AusbildungInGermany</title>
        <meta name="description" content="Get a personalized document checklist for your Ausbildung application in Germany — tailored to your country, education level, and German proficiency." />
        <meta name="keywords" content="Ausbildung checklist, Germany visa documents, Ausbildung application documents, vocational training Germany checklist" />
        <meta property="og:title" content="Document Checklist – AusbildungInGermany" />
        <meta property="og:description" content="Get a personalized document checklist for your Ausbildung application in Germany." />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <meta property="og:url" content="https://ausbildungingermany.org/checklist" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://ausbildungingermany.org/checklist" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Ausbildung Application Document Checklist",
  "url": "https://ausbildungingermany.org/checklist",
  "description": "Get a personalized document checklist for your Ausbildung application in Germany.",
  "step": [
    {"@type": "HowToStep", "name": "Gather personal documents", "text": "Collect passport, birth certificate, and ID documents."},
    {"@type": "HowToStep", "name": "Prepare educational certificates", "text": "Obtain school diplomas, transcripts, and any recognition certificates."},
    {"@type": "HowToStep", "name": "Get language proof", "text": "Obtain a German language certificate at B1 level or higher."},
    {"@type": "HowToStep", "name": "Write application documents", "text": "Prepare a Lebenslauf (CV) and Bewerbungsschreiben (cover letter) in German."},
    {"@type": "HowToStep", "name": "Apply for visa", "text": "Once you have a training contract, apply for the Ausbildungsvisum at your local German embassy."}
  ],
  "publisher": {"@type": "Organization", "name": "AusbildungInGermany.org", "url": "https://ausbildungingermany.org"}
}` }} />
        <style dangerouslySetInnerHTML={{ __html: `
body{padding-top:68px;}
:root{--navy:#0a1628;--blue:#1a56ff;--gold:#f5a623;--green:#00c48c;--red:#ff4757;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#fff;--border:#e2e8f0;}
.page-section{max-width:900px;margin:0 auto;padding:60px 20px 80px;}
.page-title{font-family:'Outfit',sans-serif;font-size:clamp(32px,5vw,48px);font-weight:900;letter-spacing:-1.5px;line-height:1.1;margin-bottom:12px;}
.page-title .highlight{color:#1a56ff;}
.page-subtitle{font-size:18px;color:#4a5568;max-width:700px;line-height:1.6;margin-bottom:40px;}
.form-card{background:#fff;border:1.5px solid #e2e8f0;border-radius:20px;padding:28px 32px;margin-bottom:40px;}
.form-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:20px;}
.form-label{display:block;font-size:14px;font-weight:600;margin-bottom:8px;color:#0a1628;}
.form-select{width:100%;background:#f8faff;border:1.5px solid #e2e8f0;border-radius:12px;padding:12px 16px;font-size:14px;font-weight:500;font-family:'Outfit',sans-serif;color:#0a1628;cursor:pointer;transition:border-color 0.15s;outline:none;}
.form-select:focus{border-color:#1a56ff;}
.quick-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.quick-label{font-size:14px;color:#718096;font-weight:500;}
.quick-btn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;border:1.5px solid #e2e8f0;background:#f8faff;color:#4a5568;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.15s;}
.quick-btn:hover{border-color:#1a56ff;color:#1a56ff;}
.quick-btn.active{background:#1a56ff;color:#fff;border-color:#1a56ff;}
.btn-generate{background:#1a56ff;color:#fff;font-size:14px;font-weight:700;font-family:'Outfit',sans-serif;padding:14px 32px;border-radius:12px;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;}
.btn-generate:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(26,86,255,0.3);}
.progress-card{background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:20px 24px;margin-bottom:28px;}
.progress-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:14px;font-weight:600;}
.progress-sub{color:#718096;font-weight:500;}
.progress-bar{width:100%;height:10px;background:#e2e8f0;border-radius:5px;overflow:hidden;}
.progress-fill{height:100%;background:linear-gradient(90deg,#1a56ff,#00c48c);border-radius:5px;transition:width 0.3s ease;}
.summary-card{background:rgba(26,86,255,0.04);border:1.5px solid rgba(26,86,255,0.15);border-radius:16px;padding:20px 24px;margin-bottom:32px;}
.summary-card h3{font-size:16px;font-weight:700;margin-bottom:8px;}
.summary-card p{font-size:14px;color:#4a5568;line-height:1.7;}
.category-heading{display:flex;align-items:center;gap:8px;margin-bottom:16px;margin-top:8px;}
.cat-badge{font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;text-transform:uppercase;letter-spacing:0.5px;}
.cat-essential .cat-badge{background:rgba(255,71,87,0.1);color:#ff4757;}
.cat-visa .cat-badge{background:rgba(26,86,255,0.1);color:#1a56ff;}
.cat-financial .cat-badge{background:rgba(245,166,35,0.1);color:#f5a623;}
.cat-optional .cat-badge{background:rgba(0,196,140,0.1);color:#00c48c;}
.cat-count{font-size:13px;color:#718096;font-weight:400;}
.checklist-item{background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px 20px;margin-bottom:12px;cursor:pointer;transition:all 0.15s;display:flex;align-items:flex-start;gap:14px;}
.checklist-item:hover{border-color:rgba(26,86,255,0.3);}
.checklist-item.checked{border-color:rgba(0,196,140,0.4);background:rgba(0,196,140,0.02);}
.check-box{width:24px;height:24px;border:2px solid #e2e8f0;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;transition:all 0.15s;}
.checklist-item.checked .check-box{background:#00c48c;border-color:#00c48c;color:#fff;}
.item-content{flex:1;}
.item-header{display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;}
.item-title{font-size:15px;font-weight:600;color:#0a1628;}
.checklist-item.checked .item-title{text-decoration:line-through;color:#718096;}
.req-badge{font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(255,71,87,0.1);color:#ff4757;text-transform:uppercase;}
.item-desc{font-size:13px;color:#4a5568;line-height:1.6;}
.item-tip{margin-top:8px;font-size:12px;color:#1a56ff;background:rgba(26,86,255,0.05);border-radius:8px;padding:8px 12px;line-height:1.5;}
.disclaimer{background:rgba(245,166,35,0.05);border:1.5px solid rgba(245,166,35,0.2);border-radius:14px;padding:18px 20px;margin-top:32px;}
.disclaimer p{font-size:13px;color:#4a5568;line-height:1.7;}
.disclaimer a{color:#1a56ff;font-weight:600;text-decoration:none;}
#results{display:none;}#results.show{display:block;}
@media(max-width:900px){.form-grid{grid-template-columns:1fr;}.page-section{padding:40px 16px 60px;}.form-card{padding:20px;}}
        ` }} />
      </Head>
      <Nav />

      <div className="page-section">
        <h1 className="page-title">📋 Document <span className="highlight">Checklist</span></h1>
        <p className="page-subtitle">Get a personalized list of every document you need to apply for Ausbildung in Germany — tailored to your country, education level, and visa type.</p>

        <div className="form-card">
          <div className="form-grid">
            <div>
              <label className="form-label">Your Country</label>
              <select className="form-select" id="countrySelect">
                <option value="NP">NP Nepal</option>
                <option value="NG">NG Nigeria</option>
                <option value="IN">IN India</option>
                <option value="PK">PK Pakistan</option>
                <option value="PH">PH Philippines</option>
                <option value="GH">GH Ghana</option>
                <option value="VN">VN Vietnam</option>
                <option value="TR">TR Turkey</option>
                <option value="BD">BD Bangladesh</option>
                <option value="KE">KE Kenya</option>
                <option value="EG">EG Egypt</option>
                <option value="MA">MA Morocco</option>
                <option value="TN">TN Tunisia</option>
                <option value="LK">LK Sri Lanka</option>
                <option value="ID">ID Indonesia</option>
                <option value="BR">BR Brazil</option>
                <option value="CO">CO Colombia</option>
                <option value="MX">MX Mexico</option>
                <option value="ET">ET Ethiopia</option>
                <option value="CM">CM Cameroon</option>
                <option value="UZ">UZ Uzbekistan</option>
                <option value="KZ">KZ Kazakhstan</option>
                <option value="UA">UA Ukraine</option>
                <option value="GE">GE Georgia</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Education Level</label>
              <select className="form-select" id="educationSelect">
                <option>High School Diploma</option>
                <option>Vocational Certificate</option>
                <option>{"Bachelor's Degree"}</option>
                <option>{"Master's Degree"}</option>
                <option>No Formal Diploma</option>
              </select>
            </div>
            <div>
              <label className="form-label">German Level</label>
              <select className="form-select" id="germanSelect">
                <option>A1 – Beginner</option>
                <option>A2 – Elementary</option>
                <option defaultValue="B1 – Intermediate">B1 – Intermediate</option>
                <option>B2 – Upper Intermediate</option>
                <option>C1 – Advanced</option>
                <option>C2 – Proficient</option>
                <option>No German yet</option>
              </select>
            </div>
          </div>

          <div className="quick-row">
            <span className="quick-label">Quick:</span>
            {[['NG','Nigeria'],['IN','India'],['PK','Pakistan'],['PH','Philippines'],['NP','Nepal'],['GH','Ghana'],['VN','Vietnam'],['TR','Turkey']].map(([code, name]) => (
              <button key={code} className="quick-btn" onClick={() => window.setQuick && window.setQuick(code)}>{code} {name}</button>
            ))}
          </div>

          <button className="btn-generate" onClick={() => window.generateChecklist && window.generateChecklist()}>📋 Get Checklist</button>
        </div>

        <div id="results"></div>
      </div>

      {/* Footer */}
      <footer style={{background:'#060d1a',color:'rgba(255,255,255,0.5)',padding:'60px 40px 40px',marginTop:'40px'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'40px',maxWidth:'1200px',margin:'0 auto 48px'}}>
          <div>
            <a href="/" style={{display:'flex',alignItems:'center',gap:'10px',textDecoration:'none',color:'#fff',fontWeight:800,fontSize:'17px'}}>
              <div style={{width:'36px',height:'36px',background:'#0a1628',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'17px'}}>🎓</div>
              AusbildungInGermany
            </a>
            <p style={{fontSize:'14px',lineHeight:'1.7',marginTop:'12px',maxWidth:'280px'}}>The complete free platform to find, apply and succeed in German Ausbildung. No agents. No fees.</p>
          </div>
          <div>
            <h4 style={{fontSize:'13px',fontWeight:700,color:'#fff',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'16px'}}>Tools</h4>
            {[['Jobs','/jobs'],['Documents','/generator'],['Embassy','/embassy'],['AI Chat','/chat']].map(([t,h]) => <a key={h} href={h} style={{display:'block',color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:'14px',marginBottom:'10px'}}>{t}</a>)}
          </div>
          <div>
            <h4 style={{fontSize:'13px',fontWeight:700,color:'#fff',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'16px'}}>Resources</h4>
            {[['Eligibility','/eligibility'],['Sectors','/sectors'],['Timeline','/timeline'],['Salary','/salary']].map(([t,h]) => <a key={h} href={h} style={{display:'block',color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:'14px',marginBottom:'10px'}}>{t}</a>)}
          </div>
          <div>
            <h4 style={{fontSize:'13px',fontWeight:700,color:'#fff',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'16px'}}>Legal</h4>
            {[['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Impressum','/impressum']].map(([t,h]) => <a key={h} href={h} style={{display:'block',color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:'14px',marginBottom:'10px'}}>{t}</a>)}
          </div>
        </div>
        <div style={{maxWidth:'1200px',margin:'0 auto',paddingTop:'24px',borderTop:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'13px',flexWrap:'wrap',gap:'12px'}}>
          <span>© 2026 AusbildungInGermany.org — Free. Open. For Everyone.</span>
          <a href="https://ausbildungingermany.org" style={{color:'rgba(255,255,255,0.5)',textDecoration:'none'}}>ausbildungingermany.org</a>
        </div>
      </footer>

      {/* Related Resources */}
      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px 60px'}}>
        <h2 style={{fontFamily:'Outfit,sans-serif',fontSize:'17px',fontWeight:800,color:'#0a1628',marginBottom:'14px'}}>Related Resources</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'10px'}}>
          {[
            {href:'/recognition',icon:'🎓',title:'Qualification Recognition',sub:'Get your degree recognized'},
            {href:'/templates',icon:'📧',title:'Email Templates',sub:'Ready-to-use application emails'},
            {href:'/generator',icon:'📄',title:'Document Generator',sub:'Create CV and cover letter'},
            {href:'/salary',icon:'💰',title:'Salary Calculator',sub:'Know what you will earn'},
          ].map(r => (
            <a key={r.href} href={r.href} style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}>
              <span style={{fontSize:'22px'}}>{r.icon}</span>
              <div><div style={{fontWeight:700,fontSize:'13px'}}>{r.title}</div><div style={{color:'#718096',fontSize:'12px'}}>{r.sub}</div></div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
