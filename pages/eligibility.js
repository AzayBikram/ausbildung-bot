import Head from 'next/head';
import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

const QUESTIONS = [
  { key: 'german', qKey: 'eligibility.q1', options: [['😅','No German at all','none',0],['🔤','A1 – Can say hello and basic words','A1',5],['📖','A2 – Can handle simple conversations','A2',10],['💬','B1 – Can communicate at work (minimum required)','B1',20],['🗣️','B2 – Comfortable in most situations','B2',25],['🎯','C1/C2 – Near-native level','C1+',35]] },
  { key: 'education', qKey: 'eligibility.q2', options: [['📚','No completed diploma yet','none',0],['🏫','Middle school / Class 8–9 completed','middle',8],['🎒','High school diploma (Class 10–12)','highschool',15],['🔧','Vocational certificate / trade diploma','vocational',17],['🎓',"Bachelor's degree",'bachelor',20],['🏆',"Master's degree or higher",'master',20]] },
  { key: 'age', qKey: 'eligibility.q3', options: [['👦','Under 16 (too young for most programs)','under16',5],['🧑','16–18 years old','16-18',12],['😊','19–25 years old (ideal range)','19-25',15],['🙂','26–30 years old','26-30',13],['😌','31–35 years old','31-35',10],['🧓','Over 35 (still possible in some fields)','over35',7]] },
  { key: 'experience', qKey: 'eligibility.q4', options: [['🌱','No work experience at all','none',3],['💼','Less than 1 year of work experience','some',6],['🏢','1–3 years of work experience','1-3',8],['⭐','More than 3 years of work experience','3+',10]] },
  { key: 'passport', qKey: 'eligibility.q5', options: [['❌','No passport yet','no',0],['⚠️','Have passport but expires within 1 year','expiring',3],['✅','Valid passport (2+ years remaining)','valid',5]] },
  { key: 'field', qKey: 'eligibility.q6', options: [['💻','IT & Technology','it',5],['🏥','Healthcare & Nursing','healthcare',5],['⚡','Engineering & Trades (Electrical, Mechanical)','engineering',5],['🚚','Logistics & Transport','logistics',5],['🛒','Retail & Business Administration','retail',5],['🔍','Other / Not sure yet','other',5]] },
  { key: 'finance', qKey: 'eligibility.q7', options: [['😰','No — I have no savings','no',0],['🤔','Limited — I have some savings but not much','some',3],['👍','Yes — I can cover 3–6 months of expenses','enough',5],['🏦','Yes — I can open a blocked account (€11,208)','blocked',5]] },
  { key: 'origin', qKey: 'eligibility.q8', options: [['🇪🇺','EU / EEA country (no visa needed)','eu',5],['🌍','Western Balkans (Albania, Bosnia, Kosovo, Serbia, N. Macedonia, Montenegro)','balkans',4],['🌏','Asia (India, Philippines, Vietnam, Nepal, etc.)','asia',4],['🌍','Africa (Nigeria, Ghana, Kenya, etc.)','africa',4],['🌎','Latin America (Brazil, Colombia, Peru, etc.)','latam',4],['🌐','Other country','other',3]] },
];

const TOTAL = QUESTIONS.length;

export default function Eligibility() {
  const { lang } = useLang();
  const [currentQ, setCurrentQ] = useState(1);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    if (!result) return;
    let displayed = 0;
    const interval = setInterval(() => {
      displayed = Math.min(displayed + 2, result.pct);
      setAnimScore(displayed);
      if (displayed >= result.pct) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [result]);

  function selectOption(key, value, score) {
    setAnswers(prev => ({ ...prev, [key]: { value, score } }));
  }

  function calculateScore() {
    const totalScore = Object.values(answers).reduce((sum, a) => sum + (a.score || 0), 0);
    const pct = Math.round((totalScore / 100) * 100);

    let label, desc, labelColor;
    if (pct >= 80) { label = t(lang,'eligibility.result_excellent'); desc = t(lang,'eligibility.desc_excellent'); labelColor = '#00c48c'; }
    else if (pct >= 65) { label = t(lang,'eligibility.result_good'); desc = t(lang,'eligibility.desc_good'); labelColor = '#1a56ff'; }
    else if (pct >= 45) { label = t(lang,'eligibility.result_fair'); desc = t(lang,'eligibility.desc_fair'); labelColor = '#f5a623'; }
    else { label = t(lang,'eligibility.result_low'); desc = t(lang,'eligibility.desc_low'); labelColor = '#ff4757'; }

    const breakdownItems = [
      { key:'german', label:t(lang,'eligibility.bd_german'), max:35, tip: answers.german?.value==='B1'||answers.german?.value==='B2'||answers.german?.value==='C1+'?'Great! Your German meets or exceeds the minimum required (B1 per §16a AufenthG).':'This is the most critical factor. You need at least B1 (e.g. Goethe-Zertifikat B1) before your visa can be issued.' },
      { key:'education', label:t(lang,'eligibility.bd_education'), max:20, tip: answers.education?.score>=15?'Your education meets requirements.':'Complete at minimum high school (Class 10) before applying.' },
      { key:'age', label:t(lang,'eligibility.bd_age'), max:15, tip: answers.age?.value==='19-25'?'Ideal age range.':'No strict age limit for the Ausbildung visa (§16a AufenthG). Most employers prefer applicants aged 18-30.' },
      { key:'experience', label:t(lang,'eligibility.bd_experience'), max:10, tip:'Work experience helps but is not required for most Ausbildung programs.' },
      { key:'passport', label:t(lang,'eligibility.bd_passport'), max:5, tip: answers.passport?.value==='valid'?'Valid passport — ready to go!':'Get a valid passport immediately. It is essential for the visa application.' },
      { key:'finance', label:t(lang,'eligibility.bd_finance'), max:5, tip:'You will need a blocked account (Sperrkonto) of ~€11,208 for the visa.' },
    ];

    setResult({ pct, score: totalScore, label, desc, labelColor, breakdownItems });
    setAnimScore(0);
  }

  const scoreColor = animScore >= 70 ? '#00c48c' : animScore >= 50 ? '#f5a623' : '#ff4757';
  const strokeOffset = 427 - (427 * animScore / 100);
  const field = answers.field?.value || 'it';

  return (
    <>
      <Head>
        <title>Check Your Ausbildung Eligibility – Free Score in 2 Minutes</title>
        <meta name="description" content="Get your personal Ausbildung eligibility score instantly. Find out if you qualify for German vocational training and what to improve." />
        <meta property="og:title" content="Check Your Ausbildung Eligibility – Free Score in 2 Minutes" />
        <meta property="og:description" content="Get your personal Ausbildung eligibility score instantly. Find out if you qualify for German vocational training and what to improve." />
        <meta property="og:url" content="https://ausbildungingermany.org/eligibility" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://ausbildungingermany.org/eligibility" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"WebApplication","name":"Ausbildung Eligibility Checker","url":"https://ausbildungingermany.org/eligibility","description":"Get your personal Ausbildung eligibility score instantly.","applicationCategory":"EducationalApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"EUR"},"publisher":{"@type":"Organization","name":"AusbildungInGermany.org","url":"https://ausbildungingermany.org"}}` }} />
        <style dangerouslySetInnerHTML={{ __html: `:root{--navy:#0a1628;--blue:#1a56ff;--blue2:#4f7fff;--gold:#f5a623;--green:#00c48c;--red:#ff4757;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#fff;--border:#e2e8f0;--font:'Outfit',sans-serif;}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{padding-top:68px;background:var(--bg);color:var(--text);font-family:var(--font);font-size:16px;line-height:1.6;}main{max-width:760px;margin:0 auto;padding:calc(68px + 32px) 24px 80px;}.page-label{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--blue);margin-bottom:12px;}.page-title{font-size:clamp(32px,5vw,52px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;margin-bottom:12px;color:var(--navy);}.page-sub{font-size:17px;color:var(--text2);margin-bottom:48px;line-height:1.6;}.progress-steps{display:flex;gap:8px;margin-bottom:40px;}.ps-step{flex:1;height:4px;background:var(--border);border-radius:2px;transition:background 0.3s;}.ps-step.active{background:var(--blue);}.ps-step.done{background:var(--green);}.ps-label{font-size:13px;color:var(--text3);margin-bottom:20px;}.q-card{background:var(--surface);border:1.5px solid var(--border);border-radius:20px;padding:32px;margin-bottom:24px;animation:fadeIn 0.3s ease;}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.q-num{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;}.q-text{font-size:20px;font-weight:700;letter-spacing:-0.3px;color:var(--navy);margin-bottom:24px;line-height:1.4;}.q-options{display:flex;flex-direction:column;gap:10px;}.q-option{background:var(--bg);border:1.5px solid var(--border);border-radius:12px;padding:14px 18px;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:12px;font-size:15px;font-weight:500;}.q-option:hover{border-color:var(--blue);background:rgba(26,86,255,0.03);}.q-option.selected{border-color:var(--blue);background:rgba(26,86,255,0.06);color:var(--blue);}.q-option .opt-icon{font-size:20px;flex-shrink:0;}.q-option .opt-label{flex:1;}.q-option .opt-check{width:20px;height:20px;border:2px solid var(--border);border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all 0.15s;}.q-option.selected .opt-check{background:var(--blue);border-color:var(--blue);color:#fff;}.q-nav{display:flex;gap:12px;margin-top:24px;}.btn-next{background:var(--navy);color:#fff;border:none;border-radius:12px;font-family:var(--font);font-size:15px;font-weight:700;padding:14px 28px;cursor:pointer;transition:all 0.2s;flex:1;}.btn-next:hover{background:#0f2040;transform:translateY(-1px);}.btn-next:disabled{opacity:0.4;cursor:not-allowed;transform:none;}.btn-back{background:none;border:1.5px solid var(--border);border-radius:12px;font-family:var(--font);font-size:15px;font-weight:500;padding:14px 20px;cursor:pointer;color:var(--text2);transition:all 0.15s;}.btn-back:hover{border-color:var(--navy);color:var(--navy);}.result-card{background:var(--surface);border:1.5px solid var(--border);border-radius:20px;padding:40px;text-align:center;animation:fadeIn 0.4s ease;}.score-ring{width:160px;height:160px;margin:0 auto 24px;position:relative;}.score-ring svg{transform:rotate(-90deg);}.score-ring .score-text{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}.score-num{font-size:44px;font-weight:900;letter-spacing:-2px;line-height:1;}.score-sub{font-size:13px;color:var(--text3);margin-top:2px;}.score-label{font-size:22px;font-weight:800;margin-bottom:8px;}.score-desc{font-size:15px;color:var(--text2);margin-bottom:32px;max-width:480px;margin-left:auto;margin-right:auto;}.breakdown{display:flex;flex-direction:column;gap:12px;margin-bottom:32px;text-align:left;}.breakdown-item{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:16px 18px;}.bi-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}.bi-label{font-size:14px;font-weight:600;}.bi-score{font-size:14px;font-weight:700;}.bi-score.good{color:var(--green);}.bi-score.medium{color:var(--gold);}.bi-score.bad{color:var(--red);}.bi-bar{height:6px;background:var(--border);border-radius:3px;overflow:hidden;}.bi-fill{height:100%;border-radius:3px;transition:width 0.8s ease;}.bi-fill.good{background:var(--green);}.bi-fill.medium{background:var(--gold);}.bi-fill.bad{background:var(--red);}.bi-tip{font-size:12px;color:var(--text3);margin-top:6px;}.result-actions{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;}.ra-btn{background:var(--navy);color:#fff;text-decoration:none;font-family:var(--font);font-size:14px;font-weight:600;padding:12px 24px;border-radius:12px;transition:all 0.2s;border:none;cursor:pointer;}.ra-btn:hover{background:#0f2040;transform:translateY(-1px);}.ra-btn.secondary{background:none;border:1.5px solid var(--border);color:var(--text2);}.ra-btn.secondary:hover{border-color:var(--navy);color:var(--navy);}` }} />
      </Head>
      <Nav />
      <main>
        <div className="page-label">{t(lang,'eligibility.label')}</div>
        <div className="page-title">Check your Ausbildung<br />eligibility score</div>
        <div className="page-sub">{t(lang,'eligibility.sub')}</div>

        {!result && (
          <>
            <div className="progress-steps">
              {Array.from({length: TOTAL}, (_, i) => (
                <div key={i} className={`ps-step ${i+1 < currentQ ? 'done' : i+1 === currentQ ? 'active' : ''}`} />
              ))}
            </div>
            <div className="ps-label">{t(lang,'eligibility.q_of',{n:currentQ,total:TOTAL})}</div>

            {QUESTIONS.map((q, idx) => {
              const qNum = idx + 1;
              if (qNum !== currentQ) return null;
              const isLast = qNum === TOTAL;
              const hasAnswer = !!answers[q.key];
              return (
                <div key={q.key} className="q-card">
                  <div className="q-num">{t(lang,'eligibility.q_of',{n:qNum,total:TOTAL})}</div>
                  <div className="q-text">{t(lang,q.qKey)}</div>
                  <div className="q-options">
                    {q.options.map(([icon, label, val, score]) => (
                      <div
                        key={val}
                        className={`q-option${answers[q.key]?.value === val ? ' selected' : ''}`}
                        onClick={() => selectOption(q.key, val, score)}
                      >
                        <span className="opt-icon">{icon}</span>
                        <span className="opt-label">{label}</span>
                        <span className="opt-check">{answers[q.key]?.value === val ? '✓' : ''}</span>
                      </div>
                    ))}
                  </div>
                  <div className="q-nav">
                    {qNum > 1 && (
                      <button className="btn-back" onClick={() => setCurrentQ(q => q - 1)}>
                        {t(lang,'common.back')}
                      </button>
                    )}
                    {isLast ? (
                      <button className="btn-next" disabled={!hasAnswer} onClick={calculateScore}>
                        {t(lang,'eligibility.btn_calculate')}
                      </button>
                    ) : (
                      <button className="btn-next" disabled={!hasAnswer} onClick={() => setCurrentQ(q => q + 1)}>
                        {t(lang,'common.continue')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {result && (
          <div className="result-card">
            <div className="score-ring">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle cx="80" cy="80" r="68" fill="none" stroke={scoreColor} strokeWidth="12" strokeLinecap="round" strokeDasharray="427" strokeDashoffset={strokeOffset} style={{transition:'stroke-dashoffset 0.05s linear, stroke 0.3s'}} />
              </svg>
              <div className="score-text">
                <div className="score-num">{animScore}</div>
                <div className="score-sub">{t(lang,'eligibility.score_sub')}</div>
              </div>
            </div>
            <div className="score-label" style={{color: result.labelColor}}>{result.label}</div>
            <div className="score-desc">{result.desc}</div>
            <div className="breakdown">
              {result.breakdownItems.map(item => {
                const score = answers[item.key]?.score || 0;
                const p = Math.round((score / item.max) * 100);
                const cls = p >= 70 ? 'good' : p >= 40 ? 'medium' : 'bad';
                return (
                  <div key={item.key} className="breakdown-item">
                    <div className="bi-header">
                      <span className="bi-label">{item.label}</span>
                      <span className={`bi-score ${cls}`}>{score}/{item.max}</span>
                    </div>
                    <div className="bi-bar"><div className={`bi-fill ${cls}`} style={{width:`${p}%`}} /></div>
                    <div className="bi-tip">{item.tip}</div>
                  </div>
                );
              })}
            </div>
            <div className="result-actions">
              <a href="/jobs" className="ra-btn">🔍 {t(lang,'eligibility.search_jobs_in',{field:field.toUpperCase()})}</a>
              <a href="/timeline" className="ra-btn secondary">{t(lang,'eligibility.my_timeline')}</a>
              <a href="/checklist" className="ra-btn secondary">{t(lang,'eligibility.my_checklist')}</a>
              <button onClick={() => { setResult(null); setAnswers({}); setCurrentQ(1); setAnimScore(0); }} className="ra-btn secondary">{t(lang,'eligibility.retake')}</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
