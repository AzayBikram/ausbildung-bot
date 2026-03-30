import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

const PHRASES = [
  {de:'Guten Morgen, ich bin [Name].',en:'Good morning, I am [Name].',ph:'GOO-ten MOR-gen',ctx:'First thing to say when entering the workplace',cat:'workplace'},
  {de:'Können Sie das bitte wiederholen?',en:'Could you please repeat that?',ph:'KER-nen zee das BIT-te VEE-der-ho-len',ctx:'When you did not understand something',cat:'workplace'},
  {de:'Ich verstehe das nicht ganz.',en:'I do not fully understand that.',ph:'ich fer-SHTAY-he das nicht gants',ctx:'Use this instead of pretending to understand',cat:'workplace'},
  {de:'Können Sie mir bitte helfen?',en:'Could you please help me?',ph:'KER-nen zee meer BIT-te HEL-fen',ctx:'Asking a colleague for help',cat:'workplace'},
  {de:'Ich bin krank und kann heute nicht kommen.',en:'I am sick and cannot come today.',ph:'ich bin krank oond kan HOY-te nicht KOM-men',ctx:'Calling in sick — always call, do not text',cat:'workplace'},
  {de:'Ich habe eine Frage.',en:'I have a question.',ph:'ich HA-be EYE-ne FRA-ge',ctx:'Before asking your supervisor something',cat:'workplace'},
  {de:'Bis morgen! / Bis nächste Woche!',en:'See you tomorrow! / See you next week!',ph:'bis MOR-gen / bis NEKHS-te VO-khe',ctx:'Saying goodbye at end of work day',cat:'workplace'},
  {de:'Darf ich bitte Urlaub nehmen?',en:'May I take vacation, please?',ph:'darf ich BIT-te OOR-laub NAY-men',ctx:'Requesting vacation from your Ausbilder',cat:'workplace'},
  {de:'Warum haben Sie sich für diese Stelle beworben?',en:'Why did you apply for this position?',ph:'va-ROOM HA-ben zee sich fyoor DEE-ze SHTEL-le be-VOR-ben',ctx:'Most common interview question — be specific!',cat:'interview'},
  {de:'Ich bin sehr motiviert, die Ausbildung zu absolvieren.',en:'I am very motivated to complete the training.',ph:'ich bin zayr mo-ti-VEERT',ctx:'Express genuine motivation',cat:'interview'},
  {de:'Ich lerne gerne Neues.',en:'I like learning new things.',ph:'ich LER-ne GER-ne NOY-es',ctx:'Show openness to learning',cat:'interview'},
  {de:'Ich bin zuverlässig und pünktlich.',en:'I am reliable and punctual.',ph:'ich bin tsoo-fer-LESS-ich oond PYNKT-likh',ctx:'Important qualities for German employers',cat:'interview'},
  {de:'Haben Sie noch Fragen an mich?',en:'Do you have any more questions for me?',ph:'HA-ben zee nokh FRA-gen an mikh',ctx:'Interviewer asking if you have questions',cat:'interview'},
  {de:'Wann würde die Ausbildung beginnen?',en:'When would the training begin?',ph:'van VYR-de dee OWS-bil-dung be-GIN-en',ctx:'Good question to ask the employer',cat:'interview'},
  {de:'Welche Aufgaben hätte ich in der Ausbildung?',en:'What tasks would I have during the training?',ph:'VEL-khe OWF-ga-ben HET-te ich',ctx:'Shows you are thinking about the job seriously',cat:'interview'},
  {de:'Entschuldigung, ich habe das Hausaufgabe vergessen.',en:'Excuse me, I forgot the homework.',ph:'ent-SHOOL-di-goong',ctx:'When you forget homework at Berufsschule',cat:'school'},
  {de:'Darf ich bitte zur Toilette gehen?',en:'May I go to the toilet, please?',ph:'darf ich BIT-te tsoor twa-LET-te GAY-en',ctx:'Asking teacher permission to leave class',cat:'school'},
  {de:'Ich habe die Aufgabe nicht verstanden.',en:'I did not understand the assignment.',ph:'ich HA-be dee OWF-ga-be nicht fer-SHTAN-den',ctx:'Tell the teacher early, not after the deadline',cat:'school'},
  {de:'Könnten Sie das bitte an die Tafel schreiben?',en:'Could you please write that on the board?',ph:'KER-ten zee das BIT-te an dee TA-fel SHRY-ben',ctx:'Helps when German is fast',cat:'school'},
  {de:'Wann ist die nächste Prüfung?',en:'When is the next exam?',ph:'van ist dee NEKHS-te PRYF-oong',ctx:'Ask this early to have time to prepare',cat:'school'},
  {de:'Sehr geehrte Damen und Herren,',en:'Dear Sir or Madam,',ph:'zayr ge-EHR-te DA-men oond HER-ren',ctx:'Formal email opening when you do not know the name',cat:'email'},
  {de:'Mit freundlichen Grüßen,',en:'With kind regards,',ph:'mit FROYND-li-khen GRYS-sen',ctx:'Standard formal email closing',cat:'email'},
  {de:'Ich bewerbe mich hiermit für die Ausbildungsstelle.',en:'I am hereby applying for the training position.',ph:'ich be-VER-be mikh HEER-mit',ctx:'Only in cover letter — do not start with this!',cat:'email'},
  {de:'Bitte bestätigen Sie den Eingang meiner Bewerbung.',en:'Please confirm receipt of my application.',ph:'BIT-te be-SHTE-ti-gen zee den EYN-gang',ctx:'Follow-up email after applying',cat:'email'},
  {de:'Ich freue mich auf Ihre Antwort.',en:'I look forward to your reply.',ph:'ich FROY-e mikh owf EE-re ANT-vort',ctx:'Good email closing phrase',cat:'email'},
  {de:'Wo ist der nächste Supermarkt?',en:'Where is the nearest supermarket?',ph:'vo ist der NEKHS-te ZOO-per-markt',ctx:'Useful when you first arrive in Germany',cat:'daily'},
  {de:'Ich suche eine Wohnung.',en:'I am looking for an apartment.',ph:'ich ZOO-khe EYE-ne VO-noong',ctx:'When apartment hunting in Germany',cat:'daily'},
  {de:'Wie viel kostet das?',en:'How much does this cost?',ph:'vee feel KOS-tet das',ctx:'Shopping at any German store',cat:'daily'},
  {de:'Ich möchte ein Konto eröffnen.',en:'I would like to open a bank account.',ph:'ich MERKH-te eyn KON-to er-EF-nen',ctx:'At Deutsche Bank or Sparkasse',cat:'daily'},
  {de:'Wo muss ich mich anmelden?',en:'Where do I need to register?',ph:'vo moos ich mikh AN-mel-den',ctx:'For Einwohnermeldeamt (residence registration)',cat:'daily'},
  {de:'Bitte rufen Sie einen Arzt!',en:'Please call a doctor!',ph:'BIT-te ROO-fen zee EYE-nen artst',ctx:'Medical emergency',cat:'emergency'},
  {de:'Ich brauche Hilfe!',en:'I need help!',ph:'ich BROW-khe HIL-fe',ctx:'Any emergency situation',cat:'emergency'},
  {de:'Wo ist das nächste Krankenhaus?',en:'Where is the nearest hospital?',ph:'vo ist das NEKHS-te KRAN-ken-hows',ctx:'Medical emergency',cat:'emergency'},
  {de:'Bitte rufen Sie die Polizei.',en:'Please call the police.',ph:'BIT-te ROO-fen zee dee po-li-TSAY',ctx:'Safety emergency — police number: 110',cat:'emergency'},
];

export default function Phrases() {
  const { lang } = useLang();
  useEffect(() => {
    window.speak = function(text) {
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'de-DE';
        utter.rate = 0.85;
        speechSynthesis.speak(utter);
      }
    };

    window.filterCat = function(cat, btn) {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window._currentCat = cat;
      window.renderPhrases();
    };

    window.filterPhrases = function(val) {
      window._searchTerm = val.toLowerCase();
      window.renderPhrases();
    };

    window._currentCat = 'all';
    window._searchTerm = '';

    window.renderPhrases = function() {
      const filtered = PHRASES.filter(p => {
        const catOk = window._currentCat === 'all' || p.cat === window._currentCat;
        const searchOk = !window._searchTerm || p.de.toLowerCase().includes(window._searchTerm) || p.en.toLowerCase().includes(window._searchTerm);
        return catOk && searchOk;
      });
      document.getElementById('phrasesGrid').innerHTML = filtered.map(p => `
        <div class="phrase-card">
          <div class="pc-german">${p.de}</div>
          <div class="pc-english">${p.en}</div>
          <div class="pc-phonetic">🔤 ${p.ph}</div>
          <div class="pc-context">💡 ${p.ctx}</div>
          <button class="speak-btn" onclick="window.speak('${p.de.replace(/'/g, "\\'")}')">🔊 Listen</button>
        </div>`).join('');
    };

    window.renderPhrases();
  }, []);

  return (
    <>
      <Head>
        <title>Essential German Phrases for Ausbildung – Workplace &amp; Interview</title>
        <meta name="description" content="Learn essential German phrases for Ausbildung interviews, workplace communication, and application emails." />
        <meta property="og:title" content="Essential German Phrases for Ausbildung" />
        <meta property="og:url" content="https://ausbildungingermany.org/phrases" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <link rel="canonical" href="https://ausbildungingermany.org/phrases" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Essential German Phrases for Ausbildung – Workplace & Interview",
  "url": "https://ausbildungingermany.org/phrases",
  "description": "Learn essential German phrases for Ausbildung interviews, workplace communication, and application emails.",
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
.cats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px;}
.cat-btn{background:var(--surface);border:1.5px solid var(--border);border-radius:100px;color:var(--text2);font-family:var(--font);font-size:13px;font-weight:500;padding:7px 16px;cursor:pointer;transition:all 0.15s;}
.cat-btn:hover,.cat-btn.active{background:var(--navy);border-color:var(--navy);color:#fff;}
.phrases-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:14px;}
.phrase-card{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:20px;transition:all 0.2s;cursor:pointer;}
.phrase-card:hover{border-color:var(--blue);transform:translateY(-2px);}
.pc-german{font-size:17px;font-weight:700;color:var(--navy);margin-bottom:6px;}
.pc-english{font-size:14px;color:var(--blue);font-weight:600;margin-bottom:8px;}
.pc-phonetic{font-size:12px;color:var(--text3);font-style:italic;margin-bottom:8px;}
.pc-context{font-size:12px;color:var(--text2);background:var(--bg);border-radius:6px;padding:6px 10px;}
.speak-btn{background:none;border:1px solid var(--border);border-radius:7px;color:var(--text3);font-family:var(--font);font-size:11px;padding:4px 10px;cursor:pointer;margin-top:10px;transition:all 0.15s;}
.speak-btn:hover{border-color:var(--blue);color:var(--blue);}
.search-bar{width:100%;background:var(--surface);border:1.5px solid var(--border);border-radius:12px;color:var(--text);font-family:var(--font);font-size:15px;padding:14px 18px;outline:none;margin-bottom:24px;}
.search-bar:focus{border-color:var(--blue);}
` }} />
      </Head>

      <Nav />

      <main>
        <div className="page-label">{t(lang,'phrases.label')}</div>
        <div className="page-title">{t(lang,'phrases.title')}</div>
        <div className="page-sub">{t(lang,'phrases.sub')}</div>

        <input type="text" className="search-bar" placeholder="🔍 Search phrases in English or German..." onInput={(e) => window.filterPhrases && window.filterPhrases(e.target.value)} />

        <div className="cats">
          <button className="cat-btn active" onClick={(e) => window.filterCat && window.filterCat('all', e.currentTarget)}>All Phrases</button>
          <button className="cat-btn" onClick={(e) => window.filterCat && window.filterCat('interview', e.currentTarget)}>🎤 Interview</button>
          <button className="cat-btn" onClick={(e) => window.filterCat && window.filterCat('workplace', e.currentTarget)}>🏢 Workplace</button>
          <button className="cat-btn" onClick={(e) => window.filterCat && window.filterCat('school', e.currentTarget)}>📚 Berufsschule</button>
          <button className="cat-btn" onClick={(e) => window.filterCat && window.filterCat('email', e.currentTarget)}>📧 Emails</button>
          <button className="cat-btn" onClick={(e) => window.filterCat && window.filterCat('daily', e.currentTarget)}>☀️ Daily Life</button>
          <button className="cat-btn" onClick={(e) => window.filterCat && window.filterCat('emergency', e.currentTarget)}>🚨 Emergency</button>
        </div>

        <div className="phrases-grid" id="phrasesGrid"></div>
      </main>

      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px 60px'}}>
        <h2 style={{fontFamily:'Outfit,sans-serif',fontSize:'17px',fontWeight:800,color:'#0a1628',marginBottom:'14px'}}>Related Resources</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'10px'}}>
          <Link href="/templates" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>📧</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Email Templates</div><div style={{color:'#718096',fontSize:'12px'}}>Use German in your applications</div></div></Link>
          <Link href="/recognition" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>🎓</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Qualification Recognition</div><div style={{color:'#718096',fontSize:'12px'}}>Understand German bureaucracy</div></div></Link>
          <Link href="/checklist" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>📋</span><div><div style={{fontWeight:700,fontSize:'13px'}}>Document Checklist</div><div style={{color:'#718096',fontSize:'12px'}}>All docs you need prepared</div></div></Link>
          <Link href="/chat" style={{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',textDecoration:'none',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:500}}><span style={{fontSize:'22px'}}>🤖</span><div><div style={{fontWeight:700,fontSize:'13px'}}>AI Assistant</div><div style={{color:'#718096',fontSize:'12px'}}>Ask any Ausbildung question</div></div></Link>
        </div>
      </section>
    </>
  );
}
