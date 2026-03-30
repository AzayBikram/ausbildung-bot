import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

export default function MyApplication() {
  const { lang } = useLang();
  useEffect(() => {
    const S = {
      get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
      set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
    };

    function toast(msg, bg) {
      const t = document.getElementById('toastEl');
      t.textContent = msg; t.style.background = bg || 'var(--navy)'; t.style.display = 'block';
      setTimeout(() => t.style.display = 'none', 3000);
    }

    window.showSec = function(id) {
      document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
      document.querySelectorAll('.sn-a[id^="sn-"]').forEach(n => n.classList.remove('on'));
      document.getElementById('sec-' + id).classList.add('on');
      document.getElementById('sn-' + id)?.classList.add('on');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    function updateAll() {
      const docs = (S.get('saved_docs') || []).length;
      const jobs = (S.get('applied_jobs') || []).length;
      const stages = Object.values(S.get('app_stages') || {}).filter(v => v === 'done').length;
      const rev = Object.values(S.get('review_checks') || {}).filter(Boolean).length;
      const pct = Math.min((docs > 0 ? 25 : 0) + (jobs > 0 ? 25 : 0) + Math.round((stages / 7) * 30) + Math.round((rev / 10) * 20), 100);
      ['ovPct', 'sidePct'].forEach(id => { const e = document.getElementById(id); if (e) e.textContent = pct + '%'; });
      ['ovFill', 'sideFill'].forEach(id => { const e = document.getElementById(id); if (e) e.style.width = pct + '%'; });
      const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
      set('ovDocs', docs); set('hDocs', docs); set('snDocs', docs);
      set('ovJobs', jobs); set('hJobs', jobs); set('snJobs', jobs);
      set('ovStages', stages + '/7'); set('hStages', stages + '/7');
      set('ovReview', rev + '/10'); set('hReview', rev + '/10'); set('snReview', rev + '/10');
      set('revProg', rev + ' / 10');
    }

    const ICONS = { cv: '📋', cover: '✉️', interview: '🎤', pdf: '📕', word: '📘', image: '🖼️', text: '📝', other: '📄' };
    function getDocs() { return S.get('saved_docs') || []; }

    function renderDocs() {
      const docs = getDocs();
      if (!docs.length) {
        document.getElementById('docsOut').innerHTML = '<div class="empty"><div class="ei">📭</div><h3>No documents saved yet</h3><p>Upload files above or generate documents with our <a href="/generator" style="color:var(--blue)">Document Generator</a>.</p></div>';
        return;
      }
      document.getElementById('docsOut').innerHTML = `<div class="doc-grid">${docs.map((d, i) => `
        <div class="doc-c">
          <div class="doc-icon">${ICONS[d.type] || '📄'}</div>
          <div class="doc-name">${d.name}</div>
          <div class="doc-meta">${new Date(d.date).toLocaleDateString('de-DE')} · ${d.size ? Math.round(d.size / 1024) + 'KB' : (d.content?.length || 0) + ' ch'}</div>
          <div class="doc-acts">
            <button class="doc-btn" onclick="window.viewDoc(${i})">👁️ View</button>
            <button class="doc-btn" onclick="window.cpDoc(${i})">📋 Copy</button>
            <button class="doc-btn del" onclick="window.delDoc(${i})">🗑️</button>
          </div>
        </div>`).join('')}</div>`;
    }

    window.viewDoc = function(i) {
      const d = getDocs()[i]; if (!d) return;
      document.getElementById('docMTitle').textContent = d.name;
      let body = '';
      if (d.dataUrl && d.type === 'image') body = `<img src="${d.dataUrl}" style="max-width:100%;border-radius:8px;"/>`;
      else if (d.dataUrl && d.type === 'pdf') body = `<iframe src="${d.dataUrl}" style="width:100%;height:480px;border:none;border-radius:8px;"></iframe>`;
      else body = `<pre style="white-space:pre-wrap;font-family:var(--font);font-size:13px;line-height:1.8;">${(d.content || '').replace(/</g, '&lt;')}</pre>`;
      document.getElementById('docMBody').innerHTML = body;
      document.getElementById('docM').classList.add('on');
    };
    window.cpDoc = function(i) { const d = getDocs()[i]; if (!d?.content) { toast('Cannot copy binary', 'var(--red)'); return; } navigator.clipboard.writeText(d.content).then(() => toast('📋 Copied!')); };
    window.delDoc = function(i) { if (!confirm('Delete?')) return; const docs = getDocs(); docs.splice(i, 1); S.set('saved_docs', docs); renderDocs(); updateAll(); toast('🗑️ Deleted'); };
    window.copyMDoc = function() { const p = document.getElementById('docMBody').querySelector('pre'); if (p) navigator.clipboard.writeText(p.textContent).then(() => toast('📋 Copied!')); };

    window.dOver = function(e) { e.preventDefault(); document.getElementById('upZone').classList.add('drag'); };
    window.dLeave = function() { document.getElementById('upZone').classList.remove('drag'); };
    window.dDrop = function(e) { e.preventDefault(); window.dLeave(); window.doFiles(e.dataTransfer.files); };
    window.onFiles = function(e) { window.doFiles(e.target.files); };
    window.doFiles = function(files) {
      Array.from(files).forEach(file => {
        const r = new FileReader();
        const isImg = file.type.startsWith('image/'), isPdf = file.type === 'application/pdf', isTxt = file.type === 'text/plain' || file.name.endsWith('.txt');
        let type = 'other';
        if (isImg) type = 'image'; else if (isPdf) type = 'pdf'; else if (isTxt) type = 'text';
        else if (file.name.match(/\.(doc|docx)$/i)) type = 'word';
        else if (file.name.toLowerCase().includes('lebenslauf') || file.name.toLowerCase().includes('cv')) type = 'cv';
        else if (file.name.toLowerCase().includes('bewerbung') || file.name.toLowerCase().includes('cover')) type = 'cover';
        r.onload = e => {
          const docs = getDocs();
          const entry = { name: file.name, type, date: Date.now(), size: file.size };
          if (isTxt) entry.content = e.target.result;
          else if (isImg || isPdf) { entry.dataUrl = e.target.result; entry.content = `[${file.type} — ${Math.round(file.size / 1024)}KB]`; }
          else entry.content = `[${file.name} — ${Math.round(file.size / 1024)}KB]\nSaved successfully.`;
          docs.unshift(entry); S.set('saved_docs', docs); renderDocs(); updateAll();
          toast(`✅ "${file.name}" saved!`, 'var(--green)');
        };
        if (isTxt) r.readAsText(file); else r.readAsDataURL(file);
      });
      document.getElementById('fi').value = '';
    };

    function getJobs() { return S.get('applied_jobs') || []; }
    const JBL = { applied: '📨 Applied', interview: '🎤 Interview', accepted: '✅ Accepted', rejected: '❌ Rejected' };
    const JBC = { applied: 'jb-applied', interview: 'jb-interview', accepted: 'jb-accepted', rejected: 'jb-rejected' };

    function renderJobs() {
      const jobs = getJobs();
      if (!jobs.length) { document.getElementById('jobsOut').innerHTML = '<div class="empty"><div class="ei">🔍</div><h3>No jobs tracked yet</h3><p>Add jobs you have applied for.</p></div>'; return; }
      document.getElementById('jobsOut').innerHTML = jobs.map((j, i) => `
        <div class="job-c">
          <div class="job-hdr"><div><div class="job-title">${j.title}</div><div class="job-co">🏢 ${j.company}</div></div><span class="jbadge ${JBC[j.status] || 'jb-applied'}">${JBL[j.status] || j.status}</span></div>
          <div class="job-tags">${j.location ? `<span class="job-tag">📍 ${j.location}</span>` : ''}${j.date ? `<span class="job-tag">📅 ${new Date(j.date + 'T00:00:00').toLocaleDateString('de-DE')}</span>` : ''}${j.ref ? `<span class="job-tag">🔖 ${j.ref}</span>` : ''}</div>
          ${j.notes ? `<p style="font-size:12px;color:var(--text2);margin-bottom:9px;">${j.notes}</p>` : ''}
          <div class="job-acts">
            <button class="job-btn" onclick="window.setJS(${i},'applied')">📨</button>
            <button class="job-btn" onclick="window.setJS(${i},'interview')">🎤</button>
            <button class="job-btn" onclick="window.setJS(${i},'accepted')">✅</button>
            <button class="job-btn" onclick="window.setJS(${i},'rejected')">❌</button>
            <button class="job-btn del" onclick="window.delJob(${i})">🗑️ Remove</button>
          </div>
        </div>`).join('');
    }
    window.openJobM = function() { document.getElementById('nj4').value = new Date().toISOString().split('T')[0]; document.getElementById('jobM').classList.add('on'); };
    window.saveJob = function() {
      const t = document.getElementById('nj1').value.trim(), c = document.getElementById('nj2').value.trim();
      if (!t || !c) { toast('Please enter job title and company!', 'var(--red)'); return; }
      const jobs = getJobs();
      jobs.unshift({ title: t, company: c, location: document.getElementById('nj3').value.trim(), date: document.getElementById('nj4').value, status: document.getElementById('nj5').value, ref: document.getElementById('nj6').value.trim(), notes: document.getElementById('nj7').value.trim() });
      S.set('applied_jobs', jobs); renderJobs(); updateAll(); window.closeM('jobM');
      ['nj1', 'nj2', 'nj3', 'nj6', 'nj7'].forEach(id => document.getElementById(id).value = '');
      toast('💼 Job added!', 'var(--green)');
    };
    window.setJS = function(i, s) { const jobs = getJobs(); jobs[i].status = s; S.set('applied_jobs', jobs); renderJobs(); toast('Status updated!'); };
    window.delJob = function(i) { if (!confirm('Remove this job?')) return; const jobs = getJobs(); jobs.splice(i, 1); S.set('applied_jobs', jobs); renderJobs(); updateAll(); toast('Removed'); };

    const STAGES = [
      { id: 'search', icon: '🔍', name: 'Found a Job', desc: 'Found a suitable Ausbildung position' },
      { id: 'documents', icon: '📄', name: 'Docs Prepared', desc: 'CV, cover letter and all documents ready' },
      { id: 'applied', icon: '📨', name: 'Application Sent', desc: 'Submitted application to employer' },
      { id: 'waiting', icon: '⏳', name: 'Waiting', desc: 'Waiting for employer response' },
      { id: 'interview', icon: '🎤', name: 'Interview', desc: 'Interview invitation received' },
      { id: 'visa', icon: '🛂', name: 'Visa Applied', desc: 'Applied for Ausbildungsvisum at embassy' },
      { id: 'accepted', icon: '🎉', name: 'Accepted!', desc: 'Ausbildung offer accepted!' },
    ];
    function renderStages() {
      const stages = S.get('app_stages') || {};
      document.getElementById('stagesOut').innerHTML = STAGES.map(s => {
        const done = stages[s.id] === 'done';
        return `<div class="stage-c ${done ? 'done' : ''}" onclick="window.togStage('${s.id}')"><div class="stage-icon">${s.icon}</div><div class="stage-name">${s.name}</div><div class="stage-status">${done ? '✅ Complete · undo' : '○ Click to complete'}</div></div>`;
      }).join('');
      updateAll();
    }
    window.togStage = function(id) { const s = S.get('app_stages') || {}; s[id] = s[id] === 'done' ? 'pending' : 'done'; S.set('app_stages', s); renderStages(); toast(s[id] === 'done' ? '✅ Stage completed!' : 'Stage unchecked'); };

    const REV = [
      { id: 'r1', t: 'CV written entirely in German', d: 'All sections and content must be in German' },
      { id: 'r2', t: 'Professional photo attached', d: 'Biometric style, white background, recent' },
      { id: 'r3', t: 'Dates in German format (TT.MM.JJJJ)', d: 'e.g. 15.03.2026 — not 03/15/2026' },
      { id: 'r4', t: 'Cover letter does not start with "Ich"', d: 'Find an original engaging opening sentence' },
      { id: 'r5', t: 'Betreff contains only the job title', d: 'No applicant name in the subject line' },
      { id: 'r6', t: 'No spelling or grammar errors', d: 'Read the whole document at least twice' },
      { id: 'r7', t: 'All facts are accurate and honest', d: 'No invented experience or fake connections' },
      { id: 'r8', t: 'Documents saved as PDF', d: 'Always send PDF, not Word documents' },
      { id: 'r9', t: 'Someone else has reviewed it', d: 'Friend or family member has read it' },
      { id: 'r10', t: 'Cover letter shows real motivation', d: 'No generic phrases — reflects your genuine reasons' },
    ];
    function renderRev() {
      const r = S.get('review_checks') || {};
      const done = Object.values(r).filter(Boolean).length;
      const p = document.getElementById('revProg'); if (p) p.textContent = done + ' / 10';
      document.getElementById('snReview').textContent = done + '/10';
      document.getElementById('hReview').textContent = done + '/10';
      document.getElementById('revOut').innerHTML = REV.map(item => `
        <div class="rev-item ${r[item.id] ? 'chk' : ''}" onclick="window.togRev('${item.id}')">
          <div class="rev-box">${r[item.id] ? '✓' : ''}</div>
          <div><div class="rev-title">${item.t}</div><div class="rev-desc">${item.d}</div></div>
        </div>`).join('');
      updateAll();
    }
    window.togRev = function(id) { const r = S.get('review_checks') || {}; r[id] = !r[id]; S.set('review_checks', r); renderRev(); toast(r[id] ? '✅ Checked!' : 'Unchecked'); };
    window.resetRev = function() { if (!confirm('Reset all review checks?')) return; S.set('review_checks', {}); renderRev(); toast('Review reset'); };

    window.loadNotes = function() { const n = S.get('my_notes'); if (n) document.getElementById('notesTA').value = n; };
    window.saveNotes = function() { S.set('my_notes', document.getElementById('notesTA').value); toast('📝 Notes saved!', 'var(--green)'); };
    window.clearNotes = function() { if (!confirm('Clear all notes?')) return; document.getElementById('notesTA').value = ''; S.set('my_notes', ''); toast('Notes cleared'); };

    window.closeM = function(id) { document.getElementById(id).classList.remove('on'); };
    document.addEventListener('click', e => {
      ['docM', 'jobM'].forEach(id => { const m = document.getElementById(id); if (m && e.target === m) m.classList.remove('on'); });
    });

    // Handle saved doc from generator
    const ps = S.get('pending_save');
    if (ps) {
      const docs = getDocs();
      docs.unshift({ name: ps.name, type: ps.type, content: ps.content, date: Date.now(), size: ps.content?.length || 0 });
      S.set('saved_docs', docs);
      localStorage.removeItem('pending_save');
      toast('✅ Document saved from Generator!', 'var(--green)');
    }

    // Init
    renderDocs(); renderJobs(); renderStages(); renderRev(); window.loadNotes(); updateAll();
  }, []);

  return (
    <>
      <Head>
        <title>My Application – AusbildungInGermany</title>
        <meta name="description" content="Track all your Ausbildung applications in one place — status updates, deadlines, and follow-up reminders." />
        <meta property="og:title" content="My Application – AusbildungInGermany" />
        <meta property="og:url" content="https://ausbildungingermany.org/myapplication" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <link rel="canonical" href="https://ausbildungingermany.org/myapplication" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Ausbildung Application Tracker",
  "url": "https://ausbildungingermany.org/myapplication",
  "description": "Track all your Ausbildung applications in one place.",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"},
  "publisher": {"@type": "Organization", "name": "AusbildungInGermany.org", "url": "https://ausbildungingermany.org"}
}` }} />
        <style dangerouslySetInnerHTML={{ __html: `
:root{--navy:#0a1628;--blue:#1a56ff;--blue-bg:rgba(26,86,255,0.06);--gold:#f5a623;--green:#00c48c;--red:#ff4757;--text:#0a1628;--text2:#4a5568;--text3:#718096;--bg:#f8faff;--surface:#fff;--border:#e2e8f0;--font:'Outfit',sans-serif;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:15px;line-height:1.6;min-height:100vh;padding-top:68px;}
.hero{background:var(--navy);color:#fff;padding:44px 40px 36px;}
.hero-inner{max-width:1100px;margin:0 auto;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;}
.h-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:8px;}
.h-title{font-size:clamp(28px,4vw,42px);font-weight:900;letter-spacing:-1px;line-height:1.05;}
.h-title span{color:#4f8ef7;}
.h-sub{font-size:14px;color:rgba(255,255,255,0.6);margin-top:8px;}
.h-stats{display:flex;gap:16px;flex-wrap:wrap;}
.h-stat{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:12px 18px;text-align:center;min-width:80px;cursor:pointer;transition:all .15s;}
.h-stat:hover{background:rgba(255,255,255,0.14);}
.h-stat-n{font-size:22px;font-weight:900;line-height:1;}
.h-stat-l{font-size:11px;color:rgba(255,255,255,0.5);margin-top:3px;}
.layout{max-width:1100px;margin:0 auto;padding:28px 24px 80px;display:grid;grid-template-columns:220px 1fr;gap:24px;align-items:start;}
.sidenav{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:14px;position:sticky;top:86px;}
.sn-prog{background:var(--bg);border-radius:10px;padding:12px;margin-bottom:10px;}
.sn-prog-row{display:flex;justify-content:space-between;font-size:12px;color:var(--text3);margin-bottom:6px;}
.sn-prog-track{height:7px;background:var(--border);border-radius:4px;overflow:hidden;}
.sn-prog-fill{height:100%;background:linear-gradient(90deg,var(--blue),var(--green));border-radius:4px;transition:width .4s;}
.sn-label{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--text3);margin:10px 0 5px 8px;}
.sn-a{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:9px;cursor:pointer;transition:all .15s;margin-bottom:2px;border:1px solid transparent;text-decoration:none;color:var(--text2);font-size:13px;font-weight:500;}
.sn-a:hover{background:var(--bg);color:var(--text);}
.sn-a.on{background:var(--blue-bg);border-color:rgba(26,86,255,0.18);color:var(--blue);font-weight:600;}
.sn-n{margin-left:auto;font-size:11px;background:var(--bg);border:1px solid var(--border);border-radius:20px;padding:1px 7px;color:var(--text3);}
.sn-a.on .sn-n{background:rgba(26,86,255,0.1);border-color:rgba(26,86,255,0.18);color:var(--blue);}
.sn-hr{height:1px;background:var(--border);margin:8px 0;}
.sec{display:none;}.sec.on{display:block;}
.sec-title{font-size:21px;font-weight:800;letter-spacing:-0.5px;color:var(--navy);margin-bottom:5px;}
.sec-sub{font-size:14px;color:var(--text2);margin-bottom:24px;}
.prog-bar-card{background:linear-gradient(135deg,var(--navy),#1a3a6f);border-radius:14px;padding:22px 26px;margin-bottom:20px;color:#fff;}
.pbc-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.pbc-label{font-size:14px;font-weight:700;}
.pbc-pct{font-size:30px;font-weight:900;letter-spacing:-1px;}
.pbc-track{height:9px;background:rgba(255,255,255,0.15);border-radius:5px;overflow:hidden;}
.pbc-fill{height:100%;background:linear-gradient(90deg,#4f8ef7,var(--green));border-radius:5px;transition:width .5s;}
.ov-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;}
.ov-c{background:var(--surface);border:1.5px solid var(--border);border-radius:13px;padding:18px;text-align:center;cursor:pointer;transition:all .2s;}
.ov-c:hover{border-color:var(--blue);transform:translateY(-2px);}
.ov-icon{font-size:26px;margin-bottom:8px;}
.ov-num{font-size:24px;font-weight:900;letter-spacing:-1px;line-height:1;}
.ov-lbl{font-size:11px;color:var(--text3);margin-top:3px;}
.notebox{background:rgba(245,166,35,0.07);border:1px solid rgba(245,166,35,0.22);border-radius:11px;padding:13px 16px;font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:20px;}
.notebox strong{color:#9a6a00;}
.card{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:22px;margin-bottom:18px;}
.card-h{font-size:15px;font-weight:700;color:var(--navy);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.upzone{border:2px dashed var(--border);border-radius:14px;padding:32px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:18px;background:var(--surface);}
.upzone:hover,.upzone.drag{border-color:var(--blue);background:var(--blue-bg);}
.up-icon{font-size:32px;margin-bottom:8px;}
.up-title{font-size:15px;font-weight:700;color:var(--navy);margin-bottom:5px;}
.up-sub{font-size:12px;color:var(--text3);}
.up-btn{background:var(--navy);color:#fff;border:none;border-radius:8px;font-family:var(--font);font-size:13px;font-weight:600;padding:9px 20px;cursor:pointer;margin-top:12px;transition:all .15s;}
.up-btn:hover{background:#0f2040;}
.doc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;}
.doc-c{background:var(--surface);border:1.5px solid var(--border);border-radius:11px;padding:16px;cursor:pointer;transition:all .2s;}
.doc-c:hover{border-color:var(--blue);transform:translateY(-2px);}
.doc-icon{font-size:28px;margin-bottom:8px;}
.doc-name{font-size:13px;font-weight:700;color:var(--navy);margin-bottom:3px;line-height:1.4;}
.doc-meta{font-size:11px;color:var(--text3);}
.doc-acts{display:flex;gap:5px;margin-top:10px;}
.doc-btn{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:6px;color:var(--text2);font-family:var(--font);font-size:11px;padding:5px 7px;cursor:pointer;transition:all .15s;text-align:center;}
.doc-btn:hover{border-color:var(--blue);color:var(--blue);}
.doc-btn.del:hover{border-color:var(--red);color:var(--red);}
.stages-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:11px;}
.stage-c{background:var(--surface);border:1.5px solid var(--border);border-radius:11px;padding:16px;text-align:center;cursor:pointer;transition:all .2s;}
.stage-c:hover{border-color:var(--blue);transform:translateY(-2px);}
.stage-c.done{border-color:var(--green);background:rgba(0,196,140,0.04);}
.stage-c.done .stage-status{color:var(--green);}
.stage-icon{font-size:24px;margin-bottom:7px;}
.stage-name{font-size:13px;font-weight:700;color:var(--navy);margin-bottom:3px;}
.stage-status{font-size:11px;color:var(--text3);}
.job-c{background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:18px;margin-bottom:11px;transition:all .15s;}
.job-c:hover{border-color:var(--blue);}
.job-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px;}
.job-title{font-size:14px;font-weight:700;color:var(--navy);}
.job-co{font-size:12px;color:var(--blue);margin-top:2px;}
.jbadge{font-size:11px;font-weight:600;padding:3px 11px;border-radius:20px;white-space:nowrap;}
.jb-applied{background:rgba(26,86,255,0.1);color:var(--blue);border:1px solid rgba(26,86,255,0.18);}
.jb-interview{background:rgba(245,166,35,0.1);color:#d4890a;border:1px solid rgba(245,166,35,0.18);}
.jb-accepted{background:rgba(0,196,140,0.1);color:#00a878;border:1px solid rgba(0,196,140,0.18);}
.jb-rejected{background:rgba(255,71,87,0.1);color:var(--red);border:1px solid rgba(255,71,87,0.18);}
.job-tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;}
.job-tag{font-size:11px;color:var(--text3);background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:2px 7px;}
.job-acts{display:flex;gap:5px;flex-wrap:wrap;}
.job-btn{background:none;border:1px solid var(--border);border-radius:6px;color:var(--text2);font-family:var(--font);font-size:11px;font-weight:500;padding:4px 9px;cursor:pointer;transition:all .15s;}
.job-btn:hover{border-color:var(--blue);color:var(--blue);}
.job-btn.del:hover{border-color:var(--red);color:var(--red);}
.rev-item{display:flex;align-items:flex-start;gap:11px;padding:12px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:all .15s;}
.rev-item:last-child{border-bottom:none;}
.rev-item:hover{background:var(--blue-bg);margin:0 -14px;padding:12px 14px;border-radius:8px;}
.rev-box{width:21px;height:21px;border:2px solid var(--border);border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;margin-top:2px;transition:all .15s;}
.rev-item.chk .rev-box{background:var(--green);border-color:var(--green);color:#fff;}
.rev-title{font-size:13px;font-weight:600;color:var(--navy);}
.rev-desc{font-size:12px;color:var(--text3);margin-top:1px;}
.notes-ta{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:11px;color:var(--text);font-family:var(--font);font-size:14px;padding:14px;outline:none;resize:vertical;min-height:200px;line-height:1.7;transition:border-color .15s;}
.notes-ta:focus{border-color:var(--blue);}
.btn{background:var(--navy);color:#fff;border:none;border-radius:10px;font-family:var(--font);font-size:14px;font-weight:600;padding:10px 20px;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:6px;text-decoration:none;}
.btn:hover{background:#0f2040;transform:translateY(-1px);}
.btn.g{background:var(--green);}.btn.g:hover{background:#00a878;}
.btn.o{background:none;border:1.5px solid var(--border);color:var(--text2);}.btn.o:hover{border-color:var(--navy);color:var(--navy);}
.btn.sm{font-size:13px;padding:8px 15px;}
.modal-bg{position:fixed;inset:0;background:rgba(10,22,40,0.48);z-index:9999;display:none;align-items:center;justify-content:center;padding:20px;}
.modal-bg.on{display:flex;}
.modal{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;width:100%;max-width:540px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.13);}
.modal-hd{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border);}
.modal-hd h3{font-size:16px;font-weight:800;color:var(--navy);}
.modal-x{background:var(--bg);border:1px solid var(--border);border-radius:7px;color:var(--text2);font-family:var(--font);font-size:12px;padding:5px 11px;cursor:pointer;}
.modal-x:hover{border-color:var(--red);color:var(--red);}
.modal-bd{padding:22px;overflow-y:auto;flex:1;}
.modal-ft{padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:9px;}
.fg{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;}
.fg label{font-size:12px;font-weight:600;color:var(--text2);}
.fg input,.fg select,.fg textarea{background:var(--bg);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-family:var(--font);font-size:13px;padding:9px 12px;outline:none;width:100%;transition:border-color .15s;}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--blue);}
.fg-2{display:grid;grid-template-columns:1fr 1fr;gap:11px;}
.empty{text-align:center;padding:44px 20px;color:var(--text3);}
.empty .ei{font-size:38px;margin-bottom:10px;}
.empty h3{font-size:15px;font-weight:700;color:var(--text2);margin-bottom:5px;}
.empty p{font-size:13px;}
.toast{position:fixed;bottom:26px;right:26px;background:var(--navy);color:#fff;padding:12px 20px;border-radius:11px;font-size:13px;font-weight:600;display:none;z-index:99999;box-shadow:0 6px 20px rgba(0,0,0,0.15);}
@media(max-width:820px){.layout{grid-template-columns:1fr;}.sidenav{position:static;display:flex;overflow-x:auto;gap:5px;padding:10px;}.sn-label,.sn-hr,.sn-prog{display:none;}.sn-a{white-space:nowrap;flex-shrink:0;}.ov-grid{grid-template-columns:repeat(2,1fr);}.h-stats{display:none;}}
@media(max-width:480px){.hero{padding:28px 18px 24px;}.layout{padding:16px 14px 60px;}.ov-grid{grid-template-columns:repeat(2,1fr);}.fg-2{grid-template-columns:1fr;}}
` }} />
      </Head>

      <Nav />

      {/* PAGE HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div>
            <div className="h-label">My Dashboard</div>
            <div className="h-title">My <span>Application</span></div>
            <div className="h-sub">Track your documents, jobs, application stages and progress — all in one place.</div>
          </div>
          <div className="h-stats">
            <div className="h-stat" onClick={() => window.showSec && window.showSec('documents')}><div className="h-stat-n" id="hDocs">0</div><div className="h-stat-l">Documents</div></div>
            <div className="h-stat" onClick={() => window.showSec && window.showSec('jobs')}><div className="h-stat-n" id="hJobs">0</div><div className="h-stat-l">Jobs Applied</div></div>
            <div className="h-stat" onClick={() => window.showSec && window.showSec('tracker')}><div className="h-stat-n" id="hStages">0/7</div><div className="h-stat-l">Stages Done</div></div>
            <div className="h-stat" onClick={() => window.showSec && window.showSec('review')}><div className="h-stat-n" id="hReview">0/10</div><div className="h-stat-l">Review Done</div></div>
          </div>
        </div>
      </div>

      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidenav">
          <div className="sn-prog">
            <div className="sn-prog-row"><span>Overall Progress</span><span id="sidePct">0%</span></div>
            <div className="sn-prog-track"><div className="sn-prog-fill" id="sideFill" style={{width:'0%'}}></div></div>
          </div>
          <div className="sn-label">My Application</div>
          <div className="sn-a on" id="sn-overview" onClick={() => window.showSec && window.showSec('overview')}><span>📊</span>Overview</div>
          <div className="sn-a" id="sn-documents" onClick={() => window.showSec && window.showSec('documents')}><span>📄</span>My Documents<span className="sn-n" id="snDocs">0</span></div>
          <div className="sn-a" id="sn-jobs" onClick={() => window.showSec && window.showSec('jobs')}><span>💼</span>Applied Jobs<span className="sn-n" id="snJobs">0</span></div>
          <div className="sn-a" id="sn-tracker" onClick={() => window.showSec && window.showSec('tracker')}><span>🎯</span>Stage Tracker</div>
          <div className="sn-a" id="sn-review" onClick={() => window.showSec && window.showSec('review')}><span>✅</span>Self-Review<span className="sn-n" id="snReview">0/10</span></div>
          <div className="sn-a" id="sn-notes" onClick={() => window.showSec && window.showSec('notes')}><span>📝</span>My Notes</div>
          <div className="sn-hr"></div>
          <div className="sn-label">Tools</div>
          <Link href="/generator" className="sn-a"><span>⚡</span>Generate Docs</Link>
          <Link href="/jobs" className="sn-a"><span>🔍</span>Job Finder</Link>
          <Link href="/embassy" className="sn-a"><span>🗺️</span>Embassy Finder</Link>
          <Link href="/checklist" className="sn-a"><span>📋</span>Doc Checklist</Link>
        </aside>

        {/* CONTENT */}
        <div>
          {/* OVERVIEW */}
          <div className="sec on" id="sec-overview">
            <div className="sec-title">📊 Overview</div>
            <p className="sec-sub">Your Ausbildung application at a glance.</p>
            <div className="prog-bar-card">
              <div className="pbc-row"><span className="pbc-label">🎯 Overall Application Progress</span><span className="pbc-pct" id="ovPct">0%</span></div>
              <div className="pbc-track"><div className="pbc-fill" id="ovFill" style={{width:'0%'}}></div></div>
            </div>
            <div className="ov-grid">
              <div className="ov-c" onClick={() => window.showSec && window.showSec('documents')}><div className="ov-icon">📄</div><div className="ov-num" id="ovDocs" style={{color:'var(--blue)'}}>0</div><div className="ov-lbl">Documents</div></div>
              <div className="ov-c" onClick={() => window.showSec && window.showSec('jobs')}><div className="ov-icon">💼</div><div className="ov-num" id="ovJobs" style={{color:'var(--gold)'}}>0</div><div className="ov-lbl">Jobs Applied</div></div>
              <div className="ov-c" onClick={() => window.showSec && window.showSec('tracker')}><div className="ov-icon">🎯</div><div className="ov-num" id="ovStages" style={{color:'var(--green)'}}>0/7</div><div className="ov-lbl">Stages Done</div></div>
              <div className="ov-c" onClick={() => window.showSec && window.showSec('review')}><div className="ov-icon">✅</div><div className="ov-num" id="ovReview" style={{color:'#7b5ef7'}}>0/10</div><div className="ov-lbl">Review Done</div></div>
            </div>
            <div className="notebox">⚠️ <strong>Always review your generated documents before sending.</strong> You know your story best — correct any errors and add a personal touch.</div>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <Link href="/generator" className="btn">📄 Generate Documents</Link>
              <Link href="/jobs" className="btn o">🔍 Find Jobs</Link>
              <button onClick={() => window.showSec && window.showSec('documents')} className="btn o">📁 My Documents</button>
            </div>
            <div style={{marginTop:'24px',background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:'14px',padding:'20px 24px'}}>
              <div style={{fontSize:'14px',fontWeight:800,color:'var(--navy)',marginBottom:'14px'}}>How to use this tracker</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}}>
                <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}><span style={{fontSize:'20px',flexShrink:0}}>📄</span><div><div style={{fontSize:'13px',fontWeight:700,color:'var(--navy)'}}>My Documents</div><div style={{fontSize:'12px',color:'var(--text3)'}}>Upload your CV, cover letter, and certificates. AI-generated docs are saved here automatically.</div></div></div>
                <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}><span style={{fontSize:'20px',flexShrink:0}}>💼</span><div><div style={{fontSize:'13px',fontWeight:700,color:'var(--navy)'}}>Applied Jobs</div><div style={{fontSize:'12px',color:'var(--text3)'}}>Log every position you apply for. Track status from Applied → Interview → Accepted.</div></div></div>
                <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}><span style={{fontSize:'20px',flexShrink:0}}>🎯</span><div><div style={{fontSize:'13px',fontWeight:700,color:'var(--navy)'}}>Stage Tracker</div><div style={{fontSize:'12px',color:'var(--text3)'}}>Mark progress through 7 key stages: job search, documents, application, interview, visa, acceptance.</div></div></div>
                <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}><span style={{fontSize:'20px',flexShrink:0}}>✅</span><div><div style={{fontSize:'13px',fontWeight:700,color:'var(--navy)'}}>Self-Review</div><div style={{fontSize:'12px',color:'var(--text3)'}}>10-point checklist to verify your application meets German employer standards before sending.</div></div></div>
              </div>
              <p style={{fontSize:'12px',color:'var(--text3)',marginTop:'14px'}}>💾 All data is saved privately in your browser — nothing is uploaded to any server.</p>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="sec" id="sec-documents">
            <div className="sec-title">📄 My Documents</div>
            <p className="sec-sub">Upload your own files or save AI-generated documents — everything in one place.</p>
            <div className="upzone" id="upZone" onClick={() => document.getElementById('fi').click()} onDragOver={(e) => window.dOver && window.dOver(e)} onDragLeave={() => window.dLeave && window.dLeave()} onDrop={(e) => window.dDrop && window.dDrop(e)}>
              <div className="up-icon">📤</div>
              <div className="up-title">Upload Your Documents</div>
              <div className="up-sub">Drag &amp; drop files here, or click to browse<br /><span style={{fontSize:'11px'}}>Supports PDF, Word (.docx), Text (.txt), Images</span></div>
              <button className="up-btn" onClick={(e) => e.stopPropagation()}>Browse Files</button>
              <input type="file" id="fi" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" style={{display:'none'}} onChange={(e) => window.onFiles && window.onFiles(e)} />
            </div>
            <div id="docsOut"></div>
          </div>

          {/* JOBS */}
          <div className="sec" id="sec-jobs">
            <div className="sec-title">💼 Applied Jobs</div>
            <p className="sec-sub">Track every Ausbildung position you have applied for and keep your status up to date.</p>
            <button onClick={() => window.openJobM && window.openJobM()} className="btn" style={{marginBottom:'22px'}}>+ Add Job Application</button>
            <div id="jobsOut"></div>
          </div>

          {/* TRACKER */}
          <div className="sec" id="sec-tracker">
            <div className="sec-title">🎯 Application Stages</div>
            <p className="sec-sub">Click each stage to mark it complete. Track your full journey from search to acceptance.</p>
            <div className="stages-grid" id="stagesOut"></div>
          </div>

          {/* REVIEW */}
          <div className="sec" id="sec-review">
            <div className="sec-title">✅ Self-Review Checklist</div>
            <p className="sec-sub">Check every point before submitting your application. German employers notice every detail!</p>
            <div className="notebox">💡 <strong>Tip:</strong> Ask a friend or family member to read your documents too — a fresh pair of eyes always catches things you missed!</div>
            <div className="card">
              <div id="revOut"></div>
              <div style={{marginTop:'14px',paddingTop:'14px',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:'13px',color:'var(--text3)'}}>Progress: <strong id="revProg">0 / 10</strong> checked</span>
                <button onClick={() => window.resetRev && window.resetRev()} className="btn o sm">↺ Reset</button>
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div className="sec" id="sec-notes">
            <div className="sec-title">📝 My Notes</div>
            <p className="sec-sub">Write reminders, contacts, important dates, and anything you need to remember.</p>
            <div className="card">
              <textarea className="notes-ta" id="notesTA" placeholder={"Write your notes here...\n\nExamples:\n· Interview with Lidl Berlin on 15.04.2026 at 10:00\n· Contact: Frau Schmidt, 030-123456\n· German B1 exam booked for 20.03.2026"}></textarea>
              <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
                <button onClick={() => window.saveNotes && window.saveNotes()} className="btn g">💾 Save Notes</button>
                <button onClick={() => window.clearNotes && window.clearNotes()} className="btn o">🗑️ Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doc viewer modal */}
      <div className="modal-bg" id="docM">
        <div className="modal">
          <div className="modal-hd"><h3 id="docMTitle">Document</h3><button className="modal-x" onClick={() => window.closeM && window.closeM('docM')}>✕ Close</button></div>
          <div className="modal-bd" id="docMBody"></div>
          <div className="modal-ft">
            <button className="btn sm" onClick={() => window.copyMDoc && window.copyMDoc()}>📋 Copy Text</button>
            <button className="btn o sm" onClick={() => window.closeM && window.closeM('docM')}>Close</button>
          </div>
        </div>
      </div>

      {/* Add Job modal */}
      <div className="modal-bg" id="jobM">
        <div className="modal">
          <div className="modal-hd"><h3>➕ Add Job Application</h3><button className="modal-x" onClick={() => window.closeM && window.closeM('jobM')}>✕</button></div>
          <div className="modal-bd">
            <div className="fg-2">
              <div className="fg"><label>Job Title *</label><input id="nj1" placeholder="e.g. Kaufmann im Einzelhandel" /></div>
              <div className="fg"><label>Company *</label><input id="nj2" placeholder="e.g. Lidl GmbH" /></div>
              <div className="fg"><label>Location</label><input id="nj3" placeholder="e.g. Berlin" /></div>
              <div className="fg"><label>Date Applied</label><input id="nj4" type="date" /></div>
              <div className="fg"><label>Status</label>
                <select id="nj5">
                  <option value="applied">📨 Applied</option>
                  <option value="interview">🎤 Interview Scheduled</option>
                  <option value="accepted">✅ Accepted</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
              </div>
              <div className="fg"><label>Reference No.</label><input id="nj6" placeholder="Optional" /></div>
            </div>
            <div className="fg"><label>Notes</label><textarea id="nj7" style={{minHeight:'60px',resize:'vertical'}} placeholder="Any notes..."></textarea></div>
          </div>
          <div className="modal-ft">
            <button className="btn" onClick={() => window.saveJob && window.saveJob()}>💾 Save Job</button>
            <button className="btn o" onClick={() => window.closeM && window.closeM('jobM')}>Cancel</button>
          </div>
        </div>
      </div>

      <div className="toast" id="toastEl"></div>
    </>
  );
}
