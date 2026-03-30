import Head from 'next/head';
import { useEffect } from 'react';
import Nav from '../components/Nav';

const SECTORS = [
  {id:'it',emoji:'💻',name:'IT & Technology',german:'Informationstechnologie',demand:'very',demandLabel:'🔥 Very High Demand',salary1:'€800–€1,100',salary3:'€1,000–€1,300',duration:'3 years',german_req:'B1 minimum (B2 recommended)',jobs:['Fachinformatiker Anwendungsentwicklung','Fachinformatiker Systemintegration','IT-Kaufmann','Digitaler Medienkonsument'],desc:'Germany has a massive shortage of IT professionals. Programs combine coding, networking, and business skills. IHK-certified and internationally respected.',tags:['Remote work possible','High job security','Good for career changers'],categories:['high','highpay','foreigners']},
  {id:'healthcare',emoji:'🏥',name:'Healthcare & Nursing',german:'Gesundheit & Pflege',demand:'very',demandLabel:'🔥 Very High Demand',salary1:'€1,000–€1,200',salary3:'€1,200–€1,500',duration:'3 years',german_req:'B2 required',jobs:['Pflegefachmann/-frau','Altenpfleger/in','Medizinische Fachangestellte','Krankenpflegehelfer/in'],desc:'Germany desperately needs healthcare workers due to an aging population. Special programs for nurses from India and Philippines with language support.',tags:['Job guarantee','PR pathway fast','High salary'],categories:['high','highpay','foreigners']},
  {id:'electrical',emoji:'⚡',name:'Electrical Engineering',german:'Elektrotechnik',demand:'very',demandLabel:'🔥 Very High Demand',salary1:'€800–€1,000',salary3:'€900–€1,200',duration:'3.5 years',german_req:'B1 minimum',jobs:['Elektroniker/in für Betriebstechnik','Elektroniker/in für Energie','Mechatroniker/in','Elektroinstallateur/in'],desc:'Electricians and electronics engineers are in extremely high demand across all industries. Practical hands-on work with excellent career progression.',tags:['Hands-on work','Excellent career','Trade certification'],categories:['high','highpay','foreigners','beginner']},
  {id:'mechatronics',emoji:'🔧',name:'Mechatronics',german:'Mechatronik',demand:'very',demandLabel:'🔥 Very High Demand',salary1:'€800–€1,100',salary3:'€1,000–€1,300',duration:'3.5 years',german_req:'B1 minimum',jobs:['Mechatroniker/in','Industriemechaniker/in','Kfz-Mechatroniker/in','Feinwerkmechaniker/in'],desc:'Combines mechanical engineering, electronics, and IT. Automotive mechatronics (Kfz) is especially popular with German companies like BMW and Mercedes.',tags:['BMW/Mercedes partners','Technical skills','European recognized'],categories:['high','highpay','foreigners','beginner']},
  {id:'logistics',emoji:'🚚',name:'Logistics & Transport',german:'Logistik & Transport',demand:'high',demandLabel:'📈 High Demand',salary1:'€700–€900',salary3:'€800–€1,050',duration:'2–3 years',german_req:'B1 sufficient',jobs:['Fachkraft für Lagerlogistik','Kaufmann für Spedition','Berufskraftfahrer/in','Fachlagerist/in'],desc:'E-commerce boom created huge demand for logistics professionals. Many companies recruit internationally. Good entry point with B1 German.',tags:['Entry-level friendly','Many vacancies','Physical work'],categories:['high','foreigners','beginner']},
  {id:'retail',emoji:'🛒',name:'Retail & Commerce',german:'Einzelhandel & Kaufmann',demand:'high',demandLabel:'📈 High Demand',salary1:'€724–€870',salary3:'€860–€1,020',duration:'2–3 years',german_req:'B1 minimum',jobs:['Kaufmann/-frau im Einzelhandel','Kaufmann/-frau für Büromanagement','Verkäufer/in','Kaufmann/-frau im E-Commerce'],desc:'Most common Ausbildung category. Business administration skills applicable in many industries. Good first step into German working culture.',tags:['Office skills','Customer service','Career flexibility'],categories:['high','foreigners','beginner']},
  {id:'construction',emoji:'🏗️',name:'Construction & Trades',german:'Bau & Handwerk',demand:'high',demandLabel:'📈 High Demand',salary1:'€750–€1,000',salary3:'€850–€1,150',duration:'2–3 years',german_req:'B1 minimum',jobs:['Maurer/in','Tischler/in','Maler/in und Lackierer/in','Dachdecker/in','Fliesenleger/in'],desc:'Massive skilled worker shortage in German construction sector. Trade skills are highly valued and well-paid. Many rural companies offer housing.',tags:['Housing sometimes included','Physical work','High demand rural areas'],categories:['high','foreigners','beginner']},
  {id:'hospitality',emoji:'🍳',name:'Hospitality & Cooking',german:'Gastronomie & Küche',demand:'medium',demandLabel:'📊 Medium Demand',salary1:'€724–€900',salary3:'€860–€1,050',duration:'3 years',german_req:'B1 minimum',jobs:['Koch/Köchin','Restaurantfachmann/-frau','Hotelfachmann/-frau','Fachkraft im Gastgewerbe'],desc:'Tourism and hospitality sector actively seeks international workers. Good cultural integration opportunity. Hours can be irregular but good tips.',tags:['Cultural integration','Tips income','Tourism industry'],categories:['foreigners','beginner']},
  {id:'social',emoji:'👶',name:'Social & Education',german:'Soziales & Erziehung',demand:'very',demandLabel:'🔥 Very High Demand',salary1:'€1,000–€1,200',salary3:'€1,100–€1,400',duration:'3 years',german_req:'B2 required',jobs:['Erzieher/in','Sozialpädagogische Assistent/in','Heilerziehungspfleger/in','Sozialassistent/in'],desc:'Critical shortage of childcare and social workers. Work with children and vulnerable people. Rewarding career with job security and good pay.',tags:['Very rewarding','Job security','State-funded positions'],categories:['high','highpay']},
  {id:'finance',emoji:'🏦',name:'Banking & Finance',german:'Bank & Finanzwesen',demand:'medium',demandLabel:'📊 Medium Demand',salary1:'€800–€1,000',salary3:'€900–€1,200',duration:'3 years',german_req:'B2 recommended',jobs:['Bankkaufmann/-frau','Versicherungskaufmann/-frau','Kaufmann/-frau für Versicherungen','Steuerfachangestellte/r'],desc:'Prestigious banking Ausbildung with excellent career path. Deutsche Bank, Commerzbank, and savings banks (Sparkasse) recruit nationally.',tags:['Prestigious career','Excellent progression','Suit and tie culture'],categories:['highpay']},
  {id:'pharma',emoji:'💊',name:'Pharmacy & Chemistry',german:'Pharmazie & Chemie',demand:'high',demandLabel:'📈 High Demand',salary1:'€800–€1,000',salary3:'€950–€1,200',duration:'3 years',german_req:'B2 required',jobs:['Pharmazeutisch-kaufmännische/r Angestellte/r','Chemielaborant/in','Pharmakant/in','Drogist/in'],desc:'Science-based programs with excellent career prospects in pharmaceutical and chemical industries. Germany is a global leader in both sectors.',tags:['Science background helpful','Global recognition','Lab work'],categories:['highpay']},
  {id:'agriculture',emoji:'🌾',name:'Agriculture & Environment',german:'Landwirtschaft & Umwelt',demand:'medium',demandLabel:'📊 Medium Demand',salary1:'€724–€900',salary3:'€860–€1,050',duration:'3 years',german_req:'B1 sufficient',jobs:['Landwirt/in','Gärtner/in','Forstwirt/in','Umweltschutztechnische/r Assistent/in'],desc:'Rural Germany needs agricultural workers. Often includes housing. Good for those wanting to live outside big cities with nature-based work.',tags:['Rural lifestyle','Housing often included','Nature work'],categories:['beginner','foreigners']},
];

export default function Sectors() {
  useEffect(() => {
    window.filterSectors = function(cat, btn) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtered = cat === 'all' ? SECTORS : SECTORS.filter(s => s.categories.includes(cat));
      document.getElementById('sectorsGrid').innerHTML = filtered.map(s => `
        <div class="sector-card" id="${s.id}">
          <div class="sc-header">
            <div class="sc-emoji">${s.emoji}</div>
            <div><div class="sc-title">${s.name}</div><div class="sc-german">${s.german}</div></div>
          </div>
          <div class="sc-badges"><span class="sc-badge ${s.demand==='very'?'demand-very':s.demand==='high'?'demand-high':'demand-med'}">${s.demandLabel}</span></div>
          <div class="sc-grid">
            <div class="sc-stat"><div class="ss-label">Year 1 Salary</div><div class="ss-val gold">${s.salary1}/mo</div></div>
            <div class="sc-stat"><div class="ss-label">Year 3 Salary</div><div class="ss-val green">${s.salary3}/mo</div></div>
            <div class="sc-stat"><div class="ss-label">Duration</div><div class="ss-val">${s.duration}</div></div>
            <div class="sc-stat"><div class="ss-label">German Required</div><div class="ss-val">${s.german_req}</div></div>
          </div>
          <div class="sc-desc">${s.desc}</div>
          <div class="sc-tags">${s.tags.map(t=>`<span class="sc-tag">${t}</span>`).join('')}</div>
          <div class="sc-tags" style="margin-top:8px;">${s.jobs.slice(0,3).map(j=>`<span class="sc-tag">📋 ${j}</span>`).join('')}</div>
          <div class="sc-footer">
            <a href="/jobs?sector=${encodeURIComponent(s.name)}" class="sc-btn">🔍 Search ${s.name} Jobs</a>
            <a href="/chat" class="sc-btn outline">💬 Ask AI</a>
          </div>
        </div>`).join('');
    };

    // Initial render
    document.getElementById('sectorsGrid').innerHTML = SECTORS.map(s => `
      <div class="sector-card" id="${s.id}">
        <div class="sc-header">
          <div class="sc-emoji">${s.emoji}</div>
          <div><div class="sc-title">${s.name}</div><div class="sc-german">${s.german}</div></div>
        </div>
        <div class="sc-badges"><span class="sc-badge ${s.demand==='very'?'demand-very':s.demand==='high'?'demand-high':'demand-med'}">${s.demandLabel}</span></div>
        <div class="sc-grid">
          <div class="sc-stat"><div class="ss-label">Year 1 Salary</div><div class="ss-val gold">${s.salary1}/mo</div></div>
          <div class="sc-stat"><div class="ss-label">Year 3 Salary</div><div class="ss-val green">${s.salary3}/mo</div></div>
          <div class="sc-stat"><div class="ss-label">Duration</div><div class="ss-val">${s.duration}</div></div>
          <div class="sc-stat"><div class="ss-label">German Required</div><div class="ss-val">${s.german_req}</div></div>
        </div>
        <div class="sc-desc">${s.desc}</div>
        <div class="sc-tags">${s.tags.map(t=>`<span class="sc-tag">${t}</span>`).join('')}</div>
        <div class="sc-tags" style="margin-top:8px;">${s.jobs.slice(0,3).map(j=>`<span class="sc-tag">📋 ${j}</span>`).join('')}</div>
        <div class="sc-footer">
          <a href="/jobs?sector=${encodeURIComponent(s.name)}" class="sc-btn">🔍 Search ${s.name} Jobs</a>
          <a href="/chat" class="sc-btn outline">💬 Ask AI</a>
        </div>
      </div>`).join('');

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
        <title>Ausbildung Sectors & Fields – Salary, Demand & Requirements</title>
        <meta name="description" content="Explore all 350+ Ausbildung training fields in Germany. Compare salaries, demand levels, German requirements and career paths." />
        <meta name="keywords" content="Ausbildung sectors, Ausbildung salary, best Ausbildung for foreigners, IT Ausbildung, healthcare Ausbildung Germany" />
        <meta property="og:title" content="Ausbildung Sectors & Fields – Salary, Demand & Requirements" />
        <meta property="og:description" content="Explore all 350+ Ausbildung training fields in Germany. Compare salaries, demand levels, German requirements and career paths." />
        <meta property="og:url" content="https://ausbildungingermany.org/sectors" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://ausbildungingermany.org/sectors" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Ausbildung Sectors & Training Fields",
  "url": "https://ausbildungingermany.org/sectors",
  "description": "Explore all 350+ Ausbildung training fields in Germany. Compare salaries, demand levels, German requirements and career paths.",
  "publisher": {"@type": "Organization", "name": "AusbildungInGermany.org", "url": "https://ausbildungingermany.org"}
}` }} />
        <style dangerouslySetInnerHTML={{ __html: `
body{padding-top:68px;}
:root{--navy:#0a1628;--blue:#1a56ff;--gold:#f5a623;--green:#00c48c;--red:#ff4757;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#fff;--border:#e2e8f0;--font:'Outfit',sans-serif;}
main{max-width:1100px;margin:0 auto;padding:40px 24px 80px;}
.page-label{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1a56ff;margin-bottom:12px;}
.page-title{font-size:clamp(32px,5vw,52px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;margin-bottom:12px;color:#0a1628;}
.page-sub{font-size:17px;color:#4a5568;margin-bottom:48px;}
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px;}
.filter-btn{background:#fff;border:1.5px solid #e2e8f0;border-radius:100px;color:#4a5568;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;padding:7px 16px;cursor:pointer;transition:all 0.15s;}
.filter-btn:hover,.filter-btn.active{background:#0a1628;border-color:#0a1628;color:#fff;}
.sectors-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;}
.sector-card{background:#fff;border:1.5px solid #e2e8f0;border-radius:20px;padding:28px;cursor:pointer;transition:all 0.2s;}
.sector-card:hover{border-color:#1a56ff;transform:translateY(-3px);box-shadow:0 12px 40px rgba(26,86,255,0.08);}
.sc-header{display:flex;align-items:flex-start;gap:16px;margin-bottom:20px;}
.sc-emoji{font-size:40px;flex-shrink:0;}
.sc-title{font-size:19px;font-weight:800;letter-spacing:-0.3px;margin-bottom:4px;}
.sc-german{font-size:13px;color:#718096;}
.sc-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
.sc-badge{font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;}
.demand-high{background:rgba(0,196,140,0.12);color:#00a878;}
.demand-very{background:rgba(255,71,87,0.1);color:#e63946;}
.demand-med{background:rgba(245,166,35,0.12);color:#d4890a;}
.sc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.sc-stat{background:#f8faff;border-radius:10px;padding:12px;}
.ss-label{font-size:11px;color:#718096;margin-bottom:3px;}
.ss-val{font-size:14px;font-weight:700;}
.ss-val.green{color:#00c48c;}.ss-val.gold{color:#f5a623;}
.sc-desc{font-size:13px;color:#4a5568;line-height:1.6;margin-bottom:16px;}
.sc-tags{display:flex;gap:6px;flex-wrap:wrap;}
.sc-tag{font-size:11px;background:#f8faff;border:1px solid #e2e8f0;border-radius:4px;padding:3px 8px;color:#718096;}
.sc-footer{margin-top:16px;padding-top:16px;border-top:1px solid #e2e8f0;display:flex;gap:8px;}
.sc-btn{flex:1;background:#0a1628;color:#fff;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;padding:10px;cursor:pointer;text-decoration:none;text-align:center;transition:all 0.15s;}
.sc-btn:hover{background:#0f2040;}
.sc-btn.outline{background:none;border:1.5px solid #e2e8f0;color:#4a5568;}
.sc-btn.outline:hover{border-color:#0a1628;color:#0a1628;}
        ` }} />
      </Head>
      <Nav />

      <main>
        <div className="page-label">Sector Explorer</div>
        <div className="page-title">Find the right Ausbildung<br />for you</div>
        <div className="page-sub">Explore all major sectors with salary ranges, demand levels, German requirements, and career paths. Filter by what matters to you.</div>
        <div style={{background:'rgba(26,86,255,0.06)',border:'1px solid rgba(26,86,255,0.2)',borderRadius:'12px',padding:'14px 18px',marginBottom:'28px',fontSize:'13px',color:'#4a5568',lineHeight:'1.6'}}>
          📌 <strong>2026 legal minimum salary:</strong> €724/month (Year 1) · €854 (Year 2) · €977 (Year 3). Salaries shown are <em>typical ranges</em> — most employers pay above the minimum. National average: €1,133/month (BIBB 2024). All figures are gross before tax deductions.
        </div>
        <div className="filters">
          <button className="filter-btn active" onClick={e => window.filterSectors && window.filterSectors('all', e.currentTarget)}>All Sectors</button>
          <button className="filter-btn" onClick={e => window.filterSectors && window.filterSectors('high', e.currentTarget)}>🔥 High Demand</button>
          <button className="filter-btn" onClick={e => window.filterSectors && window.filterSectors('beginner', e.currentTarget)}>🗣️ A2/B1 German OK</button>
          <button className="filter-btn" onClick={e => window.filterSectors && window.filterSectors('highpay', e.currentTarget)}>💰 High Salary</button>
          <button className="filter-btn" onClick={e => window.filterSectors && window.filterSectors('foreigners', e.currentTarget)}>🌍 Best for Foreigners</button>
        </div>
        <div className="sectors-grid" id="sectorsGrid"></div>
      </main>

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
