import Head from 'next/head';
import { useEffect } from 'react';
import Nav from '../components/Nav';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

export default function Timeline() {
  const { lang } = useLang();
  useEffect(() => {
    window.generateTimeline = function() {
      const season = document.getElementById('startSeason').value;
      const german = document.getElementById('currentGerman').value;
      const sector = document.getElementById('targetSector').value;
      const country = document.getElementById('country').value;
      const now = new Date();
      let startDate;
      if (season === 'summer2026') { startDate = new Date(2026, 7, 1); }
      else if (season === 'winter2026') { startDate = new Date(2027, 1, 1); }
      else { startDate = new Date(2027, 7, 1); }
      const needsGermanUpgrade = ['none','A1','A2'].includes(german);
      const germanMonthsNeeded = german==='none'?12:german==='A1'?10:german==='A2'?6:3;
      const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const phases = [];
      let cursor = new Date(now);
      function isCurrentMonth(date, n) { return date.getMonth()===n.getMonth()&&date.getFullYear()===n.getFullYear(); }
      if (needsGermanUpgrade) {
        phases.push({ emoji:'📚', type:'prep', title:`Start German Course (${german||'Beginner'} → B1)`, month: monthNames[cursor.getMonth()]+' '+cursor.getFullYear(), badge: isCurrentMonth(cursor,now)?'now':'upcoming', tasks: [`Enroll in German language course — target B1 in ${germanMonthsNeeded} months`,`Study at least 1–2 hours daily (apps like Duolingo + formal class)`,`Find a Goethe-Institut or approved language school in ${country}`,`Register for the Goethe-Zertifikat B1 exam (book 2 months in advance)`], note:`💡 German is the most important factor. Without B1, you cannot get a visa. Start immediately!` });
        cursor.setMonth(cursor.getMonth()+Math.min(3,germanMonthsNeeded));
      }
      phases.push({ emoji:'🔍', type:'apply', title:'Research & Job Search', month: monthNames[cursor.getMonth()]+' '+cursor.getFullYear(), badge: isCurrentMonth(cursor,now)?'now':'upcoming', tasks: [`Research ${sector} Ausbildung programs on arbeitsagentur.de and ausbildung.de`,`Create a list of 20–30 target companies in Germany`,`Research cities with most ${sector} opportunities (Munich, Berlin, Hamburg, Frankfurt)`,`Check if your school diploma needs recognition (use our Recognition Checker)`,`Open a folder with all your important documents`], note: null });
      cursor.setMonth(cursor.getMonth()+2);
      phases.push({ emoji:'📄', type:'apply', title:'Prepare Application Documents', month: monthNames[cursor.getMonth()]+' '+cursor.getFullYear(), badge: isCurrentMonth(cursor,now)?'now':'upcoming', tasks: [`Create your German Lebenslauf (CV) — use our free Document Generator`,`Write tailored Bewerbungsschreiben for each company`,`Get school diploma officially translated into German`,`Take biometric passport photos`,`Get your German language certificate (if not already done)`,`Prepare a professional email address with your real name`], note:`💡 Use our Document Generator to create a professional German CV and cover letter for free!` });
      cursor.setMonth(cursor.getMonth()+1);
      phases.push({ emoji:'📨', type:'apply', title:'Send Applications (Application Season)', month: monthNames[cursor.getMonth()]+' '+cursor.getFullYear(), badge: isCurrentMonth(cursor,now)?'now':'upcoming', tasks: [`Send applications to your 20–30 target companies`,`Apply through company websites, arbeitsagentur.de, and azubi.de`,`Follow up with companies after 2 weeks if no response`,`Track all applications in My Application tracker`,`Prepare for phone or video interviews`,`Practice common Ausbildung interview questions`], note: null });
      cursor.setMonth(cursor.getMonth()+2);
      phases.push({ emoji:'🎤', type:'apply', title:'Interviews & Contract Signing', month: monthNames[cursor.getMonth()]+' '+cursor.getFullYear(), badge:'upcoming', tasks: [`Attend video or in-person interviews`,`If invited to Germany for interview — apply for a Schengen visa`,`Review and sign the Ausbildungsvertrag (training contract) carefully`,`Make sure contract includes: salary, duration, start date, company address`,`Ask company to register you for health insurance (Krankenkasse)`], note:`🎉 Once you have a signed Ausbildungsvertrag, you can apply for your visa!` });
      cursor.setMonth(cursor.getMonth()+1);
      phases.push({ emoji:'🏦', type:'visa', title:'Open Blocked Account (Sperrkonto)', month: monthNames[cursor.getMonth()]+' '+cursor.getFullYear(), badge:'upcoming', tasks: [`Open a Sperrkonto with Fintiba, Expatrio, or Deutsche Bank`,`Deposit required amount (check with embassy — usually ~€11,208)`,`Get the official Sperrkonto confirmation letter`,`This is YOUR money — you get it back monthly once training starts`], note:`💡 Use our Sperrkonto Calculator to calculate the exact amount needed.` });
      cursor.setMonth(cursor.getMonth()+1);
      phases.push({ emoji:'🗺️', type:'visa', title:'Apply for Ausbildungsvisum', month: monthNames[cursor.getMonth()]+' '+cursor.getFullYear(), badge:'upcoming', tasks: [`Book visa appointment at German embassy in ${country} (book 4–8 weeks early)`,`Prepare all visa documents: passport, Ausbildungsvertrag, diploma, German certificate, photos, Sperrkonto proof, health insurance`,`Attend appointment — dress professionally`,`Pay visa fee (~€75)`,`Wait 4–12 weeks for decision`], note:`💡 Use our Embassy Finder for ${country} for exact requirements and appointment booking link.` });
      cursor.setMonth(cursor.getMonth()+2);
      phases.push({ emoji:'✈️', type:'ready', title:'Travel to Germany & Start Ausbildung', month: monthNames[cursor.getMonth()]+' '+cursor.getFullYear(), badge:'upcoming', tasks: [`Book your flight to Germany (arrive 1–2 weeks before start date)`,`Arrange temporary accommodation (WG-Gesucht, Immoscout, ask company for help)`,`Register at local Einwohnermeldeamt (residence registration — required within 2 weeks)`,`Open German bank account (Deutsche Bank, Sparkasse, or N26)`,`Start your Ausbildung — congratulations! 🎉`], note:`🎊 You made it! Your Ausbildung starts and so does your €900–€1,500/month salary.` });
      const tl = document.getElementById('timeline');
      tl.classList.add('show');
      tl.innerHTML = `<div class="tl-header"><h2>📅 Your Personal Timeline</h2><p>${sector} Ausbildung starting ${season.includes('summer')?'Summer':'Winter'} ${season.includes('2026')?'2026':'2027'} · From ${country}</p></div>${phases.map(p=>`<div class="month-block"><div class="month-dot ${p.type} ${p.badge==='now'?'current':''}">${p.emoji}</div><div class="month-content ${p.badge==='now'?'current-month':''}"><div class="mc-header"><div class="mc-title">${p.month}: ${p.title}</div><span class="mc-badge ${p.badge}">${p.badge==='now'?'▶ Do this NOW':p.badge==='done'?'✓ Done':'⏳ Upcoming'}</span></div><div class="mc-tasks">${p.tasks.map(t=>`<div class="mc-task">${t}</div>`).join('')}</div>${p.note?`<div class="mc-note">${p.note}</div>`:''}</div></div>`).join('')}`;
      tl.scrollIntoView({behavior:'smooth'});
    };
  }, []);

  return (
    <>
      <Head>
        <title>Ausbildung Application Timeline Planner – Month by Month</title>
        <meta name="description" content="Month-by-month Ausbildung application timeline — when to research, apply, get documents ready, and prepare for your start date." />
        <meta property="og:title" content="Ausbildung Application Timeline Planner – Month by Month" />
        <meta property="og:description" content="Month-by-month Ausbildung application timeline — when to research, apply, get documents ready, and prepare for your start date." />
        <meta property="og:url" content="https://ausbildungingermany.org/timeline" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://ausbildungingermany.org/timeline" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"HowTo","name":"Ausbildung Application Timeline Planner","url":"https://ausbildungingermany.org/timeline","description":"Month-by-month Ausbildung application timeline.","step":[{"@type":"HowToStep","name":"12 months before: Research","text":"Research Ausbildung fields, companies, and German language requirements."},{"@type":"HowToStep","name":"9 months before: Language prep","text":"Enrol in German language course and aim for B1 certificate."},{"@type":"HowToStep","name":"6 months before: Apply","text":"Submit applications to German companies via our job search platform."},{"@type":"HowToStep","name":"3 months before: Visa","text":"After receiving a training contract, apply for the Ausbildungsvisum at your German embassy."},{"@type":"HowToStep","name":"1 month before: Prepare","text":"Arrange housing, open a German bank account, and prepare for relocation."}],"publisher":{"@type":"Organization","name":"AusbildungInGermany.org","url":"https://ausbildungingermany.org"}}` }} />
        <style dangerouslySetInnerHTML={{ __html: `:root{--navy:#0a1628;--blue:#1a56ff;--gold:#f5a623;--green:#00c48c;--red:#ff4757;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#fff;--border:#e2e8f0;--font:'Outfit',sans-serif;}*{box-sizing:border-box;margin:0;padding:0;}body{padding-top:68px;background:var(--bg);color:var(--text);font-family:var(--font);}main{max-width:860px;margin:0 auto;padding:calc(68px + 32px) 24px 80px;}.page-label{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--blue);margin-bottom:12px;}.page-title{font-size:clamp(32px,5vw,52px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;margin-bottom:12px;color:var(--navy);}.page-sub{font-size:17px;color:var(--text2);margin-bottom:40px;}.setup-card{background:var(--surface);border:1.5px solid var(--border);border-radius:20px;padding:32px;margin-bottom:32px;}.setup-card h2{font-size:18px;font-weight:700;margin-bottom:20px;}.setup-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}.sg-group{display:flex;flex-direction:column;gap:6px;}.sg-label{font-size:13px;font-weight:600;color:var(--text2);}.sg-input{background:var(--bg);border:1.5px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--font);font-size:14px;padding:10px 14px;outline:none;transition:border-color 0.15s;width:100%;}.sg-input:focus{border-color:var(--blue);}.gen-btn{background:var(--navy);color:#fff;border:none;border-radius:12px;font-family:var(--font);font-size:15px;font-weight:700;padding:14px 32px;cursor:pointer;margin-top:20px;width:100%;transition:all 0.2s;}.gen-btn:hover{background:#0f2040;}.timeline{display:none;}.timeline.show{display:block;}.tl-header{background:var(--navy);color:#fff;border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;}.tl-header h2{font-size:22px;font-weight:800;margin-bottom:6px;}.tl-header p{font-size:14px;opacity:0.7;}.month-block{display:flex;gap:20px;margin-bottom:24px;align-items:flex-start;}.month-dot{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;border:3px solid var(--bg);}.month-dot.prep{background:#1a56ff;}.month-dot.apply{background:#f5a623;}.month-dot.visa{background:#00c48c;}.month-dot.ready{background:#ff4757;}.month-dot.current{background:var(--navy);box-shadow:0 0 0 4px rgba(26,86,255,0.2);}.month-content{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:20px;flex:1;}.month-content.current-month{border-color:var(--blue);}.mc-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}.mc-title{font-size:16px;font-weight:700;}.mc-badge{font-size:11px;font-weight:600;padding:3px 10px;border-radius:6px;}.mc-badge.now{background:rgba(26,86,255,0.12);color:var(--blue);}.mc-badge.done{background:rgba(0,196,140,0.12);color:var(--green);}.mc-badge.upcoming{background:rgba(245,166,35,0.12);color:#d4890a;}.mc-tasks{display:flex;flex-direction:column;gap:7px;}.mc-task{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:var(--text2);line-height:1.5;}.mc-task::before{content:'→';color:var(--blue);font-weight:700;flex-shrink:0;margin-top:1px;}.mc-note{margin-top:12px;padding:10px 14px;background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:8px;font-size:12px;color:#9a6a00;line-height:1.6;}` }} />
      </Head>
      <Nav />
      <main>
        <div className="page-label">{t(lang,'timeline.label')}</div>
        <div className="page-title">{t(lang,'timeline.title')}</div>
        <div className="page-sub">{t(lang,'timeline.sub')}</div>
        <div className="setup-card">
          <h2>📅 Create My Timeline</h2>
          <div className="setup-grid">
            <div className="sg-group">
              <label className="sg-label">{t(lang,'timeline.start_label')}</label>
              <select className="sg-input" id="startSeason">
                <option value="summer2026">Summer 2026 (Aug/Sep 2026)</option>
                <option value="winter2026">Winter 2026 (Feb/Mar 2027)</option>
                <option value="summer2027">Summer 2027 (Aug/Sep 2027)</option>
              </select>
            </div>
            <div className="sg-group">
              <label className="sg-label">Current German level</label>
              <select className="sg-input" id="currentGerman">
                <option value="none">No German yet</option>
                <option value="A1">A1 – Beginner</option>
                <option value="A2">A2 – Elementary</option>
                <option value="B1">B1 – Intermediate (minimum)</option>
                <option value="B2">B2 – Upper Intermediate</option>
                <option value="C1">C1/C2 – Advanced</option>
              </select>
            </div>
            <div className="sg-group">
              <label className="sg-label">Target sector</label>
              <select className="sg-input" id="targetSector">
                <option>IT & Technology</option>
                <option>Healthcare & Nursing</option>
                <option>Electrical Engineering</option>
                <option>Mechatronics</option>
                <option>Logistics</option>
                <option>Retail & Commerce</option>
                <option>Construction & Trades</option>
                <option>Other</option>
              </select>
            </div>
            <div className="sg-group">
              <label className="sg-label">Your country</label>
              <select className="sg-input" id="country">
                <option>Nigeria</option><option>India</option><option>Pakistan</option>
                <option>Philippines</option><option>Nepal</option><option>Ghana</option>
                <option>Kenya</option><option>Vietnam</option><option>Morocco</option>
                <option>Turkey</option><option>Other</option>
              </select>
            </div>
          </div>
          <button className="gen-btn" onClick={() => window.generateTimeline && window.generateTimeline()}>{t(lang,'timeline.btn_generate')}</button>
        </div>
        <div className="timeline" id="timeline"></div>
      </main>
      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px 60px'}}>
        <h2 style={{fontFamily:'Outfit,sans-serif',fontSize:'17px',fontWeight:'800',color:'#0a1628',marginBottom:'14px'}}>{t(lang,'common.related')}</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'10px'}}>
          {[{href:'/checklist',icon:'📋',title:'Document Checklist',desc:'Start preparing your documents'},{href:'/salary',icon:'💰',title:'Salary Calculator',desc:'Know your expected earnings'},{href:'/housing',icon:'🏠',title:'Housing Guide',desc:'Plan your accommodation early'},{href:'/sperrkonto',icon:'🏦',title:'Sperrkonto Calculator',desc:'Prepare your blocked account'},{href:'/embassy',icon:'🗺️',title:'Embassy Finder',desc:'Book your visa appointment'},{href:'/generator',icon:'📄',title:'Document Generator',desc:'Create professional documents'}].map(r => (
            <a key={r.href} href={r.href} style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:'500',transition:'all .15s'}}>
              <span style={{fontSize:'22px'}}>{r.icon}</span>
              <div><div style={{fontWeight:'700',fontSize:'13px'}}>{r.title}</div><div style={{color:'#718096',fontSize:'12px'}}>{r.desc}</div></div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
