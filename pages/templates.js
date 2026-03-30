import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

const TEMPLATES = [
  {icon:'📨',title:'Initial Application Email',badge:'Most Important',when:'Use when sending your application by email (CV + cover letter attached as PDF)',subject:'Bewerbung als [Stelle] – [Ihr Name]',text:`Sehr geehrte Damen und Herren,

anbei übersende ich Ihnen meine Bewerbungsunterlagen für die Ausbildungsstelle als [Stelle].

Ich bin [Ihr Name], [Alter] Jahre alt und komme aus [Land]. Derzeit verfüge ich über Deutschkenntnisse auf dem Niveau [Level].

Meine vollständigen Bewerbungsunterlagen (Lebenslauf und Bewerbungsschreiben) finden Sie als PDF-Anhang.

Für Rückfragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
[Ihr Name]
[Telefonnummer]
[E-Mail]`},
  {icon:'🔁',title:'Follow-Up Email',badge:'Send after 2 weeks',when:'Use 2 weeks after sending your application if you have heard nothing',subject:'Nachfrage zur Bewerbung als [Stelle] – [Ihr Name]',text:`Sehr geehrte Damen und Herren,

am [Datum] habe ich Ihnen meine Bewerbungsunterlagen für die Ausbildungsstelle als [Stelle] zugesandt.

Da ich bislang noch keine Rückmeldung erhalten habe, erlaubt ich mir, freundlich nachzufragen, ob meine Bewerbung bei Ihnen eingegangen ist.

Ich bin weiterhin sehr an der Stelle interessiert und stehe für ein Vorstellungsgespräch gerne zur Verfügung.

Mit freundlichen Grüßen
[Ihr Name]
[Telefonnummer]`},
  {icon:'🎤',title:'Interview Confirmation',badge:'Reply promptly',when:'Reply to an interview invitation within 24 hours',subject:'Re: Einladung zum Vorstellungsgespräch – [Ihr Name]',text:`Sehr geehrte Frau/Herr [Name],

vielen Dank für Ihre Einladung zum Vorstellungsgespräch.

Ich bestätige hiermit gerne den Termin am [Datum] um [Uhrzeit] Uhr bei Ihnen in [Ort/Online].

Ich freue mich auf das Gespräch.

Mit freundlichen Grüßen
[Ihr Name]`},
  {icon:'✅',title:'Contract Acceptance',badge:'After offer',when:'When you receive and accept an Ausbildungsvertrag',subject:'Bestätigung Ausbildungsvertrag – [Ihr Name]',text:`Sehr geehrte Frau/Herr [Name],

vielen Dank für das Angebot und den Ausbildungsvertrag für die Ausbildung als [Stelle].

Ich freue mich sehr über diese Möglichkeit und nehme das Angebot hiermit gerne an.

Den unterschriebenen Vertrag sende ich Ihnen bis [Datum] zurück.

Mit freundlichen Grüßen
[Ihr Name]`},
  {icon:'🏥',title:'Sick Day Notification',badge:'Call first!',when:'When you are sick — always CALL first, then send email if required',subject:'Krankmeldung [Ihr Name] – [Datum]',text:`Sehr geehrte/r [Vorgesetzte/r],

leider muss ich Ihnen mitteilen, dass ich heute, [Datum], aufgrund von Krankheit nicht zur Arbeit erscheinen kann.

Ein Arzttermin ist für heute [Uhrzeit] Uhr vereinbart. Das ärztliche Attest werde ich Ihnen sobald wie möglich zukommen lassen.

Mit freundlichen Grüßen
[Ihr Name]`},
  {icon:'📋',title:'Document Request',badge:'For HR',when:'Requesting a needed document from your employer (e.g. for visa)',subject:'Anfrage: [Dokument] – [Ihr Name]',text:`Sehr geehrte Damen und Herren,

für [Visumantrag / Anmeldung / etc.] benötige ich folgendes Dokument:

• [Dokument, z.B. Arbeitsvertrag / Ausbildungsvertrag / Bescheinigung]

Wären Sie so freundlich, mir dieses Dokument bis [Datum] zukommen zu lassen?

Ich danke Ihnen herzlich im Voraus.

Mit freundlichen Grüßen
[Ihr Name]`},
  {icon:'❌',title:'Withdrawal of Application',badge:'Be polite',when:'When you want to withdraw your application after applying',subject:'Rücknahme meiner Bewerbung – [Ihr Name]',text:`Sehr geehrte Damen und Herren,

hiermit möchte ich meine Bewerbung um die Ausbildungsstelle als [Stelle] vom [Datum] zurückziehen.

Ich bitte Sie, meine Bewerbungsunterlagen nicht weiter zu berücksichtigen.

Ich danke Ihnen für Ihr bisheriges Interesse.

Mit freundlichen Grüßen
[Ihr Name]`},
  {icon:'🙏',title:'Thank You After Interview',badge:'Within 24hrs',when:'Send within 24 hours after a job interview — sets you apart!',subject:'Dankeschön für das Gespräch – [Ihr Name]',text:`Sehr geehrte Frau/Herr [Name],

herzlichen Dank für das angenehme Gespräch am [Datum].

Das Gespräch hat mein Interesse an der Ausbildungsstelle als [Stelle] noch weiter gestärkt. Besonders [ein Aspekt des Gesprächs] hat mich beeindruckt.

Ich freue mich auf Ihre Rückmeldung.

Mit freundlichen Grüßen
[Ihr Name]`},
];

export default function Templates() {
  const { lang } = useLang();
  useEffect(() => {
    window.copyTemplate = function(idx) {
      const cl = localStorage.getItem('aig_lang') || 'en';
      const tmpl = TEMPLATES[idx];
      const text = `Betreff: ${tmpl.subject}\n\n${tmpl.text}`;
      navigator.clipboard.writeText(text).then(() => alert(t(cl, 'templates.copied')));
    };

    const cl = localStorage.getItem('aig_lang') || 'en';
    document.getElementById('templatesGrid').innerHTML = TEMPLATES.map((tmpl, i) => `
      <div class="template-card">
        <div class="tc-header">
          <span class="tc-icon">${tmpl.icon}</span>
          <span class="tc-title">${tmpl.title}</span>
          <span class="tc-badge">${tmpl.badge}</span>
        </div>
        <div class="tc-body">
          <div class="tc-when">📌 When to use: ${tmpl.when}</div>
          <div class="tc-subject">Subject line (Betreff):</div>
          <div class="tc-subject-val">${tmpl.subject}</div>
          <div class="tc-text">${tmpl.text}</div>
        </div>
        <div class="tc-footer">
          <button class="tc-btn" onclick="window.copyTemplate(${i})">${t(cl,'templates.copy_btn')}</button>
        </div>
      </div>`).join('');
  }, []);

  return (
    <>
      <Head>
        <title>German Email Templates for Ausbildung Applications</title>
        <meta name="description" content="Free copy-paste German email templates for Ausbildung applications — enquiry emails, follow-ups, and acceptance/rejection replies." />
        <meta property="og:title" content="German Email Templates for Ausbildung Applications" />
        <meta property="og:url" content="https://ausbildungingermany.org/templates" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <link rel="canonical" href="https://ausbildungingermany.org/templates" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "German Email Templates for Ausbildung Applications",
  "url": "https://ausbildungingermany.org/templates",
  "description": "Free copy-paste German email templates for Ausbildung applications.",
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
.templates-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(440px,1fr));gap:20px;}
.template-card{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;overflow:hidden;}
.tc-header{background:var(--navy);color:#fff;padding:18px 22px;display:flex;align-items:center;gap:12px;}
.tc-icon{font-size:22px;}
.tc-title{font-size:15px;font-weight:700;}
.tc-badge{margin-left:auto;font-size:11px;background:rgba(255,255,255,0.15);border-radius:6px;padding:3px 8px;}
.tc-body{padding:20px 22px;}
.tc-when{font-size:12px;color:var(--text3);margin-bottom:12px;line-height:1.5;}
.tc-subject{font-size:12px;font-weight:600;color:var(--text3);margin-bottom:4px;}
.tc-subject-val{font-size:13px;font-weight:700;color:var(--navy);margin-bottom:14px;}
.tc-text{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px;font-size:13px;color:var(--text2);line-height:1.8;white-space:pre-line;font-family:'Courier New',monospace;}
.tc-footer{padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:8px;}
.tc-btn{flex:1;background:var(--navy);color:#fff;border:none;border-radius:8px;font-family:var(--font);font-size:13px;font-weight:600;padding:9px;cursor:pointer;transition:all 0.15s;}
.tc-btn:hover{background:#0f2040;}
` }} />
      </Head>

      <Nav />

      <main>
        <div className="page-label">{t(lang,'templates.label')}</div>
        <div className="page-title">{t(lang,'templates.title')}</div>
        <div className="page-sub">{t(lang,'templates.sub')}</div>
        <div className="templates-grid" id="templatesGrid"></div>
      </main>

      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px 60px'}}>
        <h2 style={{fontFamily:'Outfit,sans-serif',fontSize:'17px',fontWeight:800,color:'#0a1628',marginBottom:'14px'}}>{t(lang,'common.related')}</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'10px'}}>
          <Link href="/phrases" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>💬</span><div><div style={{fontWeight:700,fontSize:'13px'}}>German Phrases</div><div style={{color:'#718096',fontSize:'12px'}}>Key phrases for interviews</div></div></Link>
          <Link href="/checklist" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>📋</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Document Checklist</div><div style={{color:'#718096',fontSize:'12px'}}>Ensure your docs are complete</div></div></Link>
          <Link href="/generator" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>📄</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Document Generator</div><div style={{color:'#718096',fontSize:'12px'}}>AI-powered CV & cover letter</div></div></Link>
          <Link href="/recognition" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>🎓</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Qualification Recognition</div><div style={{color:'#718096',fontSize:'12px'}}>Get your degree recognized</div></div></Link>
        </div>
      </section>
    </>
  );
}
