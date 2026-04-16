import Head from 'next/head';
import { useEffect } from 'react';
import Nav from '../components/Nav';
import Script from 'next/script';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

export default function Jobs() {
  const { lang } = useLang();
  useEffect(() => {
    let currentPage = 1;
    let selectedJob = null;
    let generatedCV = '';
    let generatedCoverLetter = '';
    let currentDocShown = 'cv';

    window.quickSearch = function(keyword) {
      document.getElementById('searchKeyword').value = keyword;
      window.searchJobs();
    };

    window.searchJobs = async function(page = 1) {
      currentPage = page;
      window.closeApplyPanel && window.closeApplyPanel();
      const keyword = document.getElementById('searchKeyword').value.trim();
      const location = document.getElementById('searchLocation').value.trim();
      const sector = document.getElementById('searchSector').value;
      const searchTerm = keyword || sector || 'Ausbildung';
      const btn = document.getElementById('searchBtn');
      btn.disabled = true; btn.textContent = '⏳ Searching...';
      document.getElementById('resultsArea').innerHTML = '<div class="loading"><div class="spinner"></div>Searching real vacancies in Germany...</div>';
      try {
        const response = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'jobs', was: searchTerm, wo: location || undefined, page, size: 10 })
        });
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        window.displayResults && window.displayResults(data.stellenangebote || [], data.maxErgebnisse || 0, searchTerm, location, page);
      } catch (err) {
        window.showAIResults && window.showAIResults(searchTerm, location);
      }
      btn.disabled = false; btn.textContent = '🔍 Search';
    };

    window.displayResults = function(jobs, total, searchTerm, location, page) {
      if (jobs.length === 0) {
        document.getElementById('resultsArea').innerHTML = '<div class="empty-state"><div class="icon">😕</div><h3>No results found</h3><p>Try a different keyword or location.</p></div>';
        return;
      }
      let html = `<div class="results-header"><div class="results-count">Found <span>${total.toLocaleString()}</span> Ausbildung vacancies</div></div>`;
      jobs.forEach((job) => {
        const title = job.titel || 'Ausbildung Position';
        const company = job.arbeitgeber || 'Company not specified';
        const loc = (job.arbeitsort?.ort || job.arbeitsort?.region || 'Germany') + (job.arbeitsort?.bundesland ? ', ' + job.arbeitsort.bundesland : '');
        const startDate = job.eintrittsdatum || '';
        const refnr = job.refnr || '';
        const applyUrl = refnr ? `https://www.arbeitsagentur.de/jobsuche/jobdetail/${refnr}` : 'https://www.arbeitsagentur.de';
        const safeData = btoa(unescape(encodeURIComponent(JSON.stringify({ title, company, location: loc, startDate, applyUrl }))));
        html += `<div class="job-card"><div class="job-header"><div><div class="job-title">${title}</div><div class="job-company">🏢 ${company}</div></div><button class="apply-btn" onclick="window.startApplication('${safeData}')">Apply with Help →</button></div><div class="job-meta"><span class="job-tag">📍 ${loc}</span>${startDate ? `<span class="job-tag">📅 ${startDate}</span>` : ''}<span class="job-tag highlight">🎓 Ausbildung</span></div></div>`;
      });
      const totalPages = Math.ceil(Math.min(total, 100) / 10);
      if (totalPages > 1) {
        html += '<div class="pagination">';
        if (page > 1) html += `<button class="page-btn" onclick="window.searchJobs(${page - 1})">← Prev</button>`;
        for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
          html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="window.searchJobs(${i})">${i}</button>`;
        }
        if (page < totalPages) html += `<button class="page-btn" onclick="window.searchJobs(${page + 1})">Next →</button>`;
        html += '</div>';
      }
      document.getElementById('resultsArea').innerHTML = html;
    };

    window.showAIResults = async function(keyword, location) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system: 'Return ONLY valid JSON array, no other text.', messages: [{ role: 'user', content: `List 8 realistic Ausbildung openings for "${keyword}" ${location ? 'in ' + location : 'in Germany'}. JSON array with: title, company, location, startDate, applyUrl (https://www.arbeitsagentur.de). No markdown.` }] })
        });
        const data = await response.json();
        const jobs = JSON.parse(data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim());
        let html = `<div class="results-header"><div class="results-count">Found <span>${jobs.length}</span> example vacancies <span style="font-size:11px;">(AI examples)</span></div></div>`;
        jobs.forEach(job => {
          const safeData = btoa(unescape(encodeURIComponent(JSON.stringify({ title: job.title, company: job.company, location: job.location, startDate: job.startDate, applyUrl: job.applyUrl }))));
          html += `<div class="job-card"><div class="job-header"><div><div class="job-title">${job.title}</div><div class="job-company">🏢 ${job.company}</div></div><button class="apply-btn" onclick="window.startApplication('${safeData}')">Apply with Help →</button></div><div class="job-meta"><span class="job-tag">📍 ${job.location}</span>${job.startDate ? `<span class="job-tag">📅 ${job.startDate}</span>` : ''}<span class="job-tag highlight">🎓 Ausbildung</span></div></div>`;
        });
        document.getElementById('resultsArea').innerHTML = html;
      } catch (err) {
        document.getElementById('resultsArea').innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><h3>Search unavailable</h3><p>Visit <a href="https://www.arbeitsagentur.de" target="_blank" style="color:var(--accent);">www.arbeitsagentur.de</a> directly.</p></div>';
      }
    };

    window.startApplication = async function(safeData) {
      selectedJob = JSON.parse(decodeURIComponent(escape(atob(safeData))));
      document.getElementById('applyJobTitle').textContent = `📋 Applying for: ${selectedJob.title}`;
      document.getElementById('applyJobSubtitle').textContent = `🏢 ${selectedJob.company} — 📍 ${selectedJob.location}`;
      document.getElementById('officialApplyLink').href = selectedJob.applyUrl;
      document.getElementById('applyPanel').style.display = 'block';
      document.getElementById('applyPanel').scrollIntoView({ behavior: 'smooth' });
      window.goToStep(1);
      window.loadJobOverview();
    };

    window.loadJobOverview = async function() {
      document.getElementById('jobOverview').innerHTML = '<div class="loading"><div class="spinner"></div>Loading job details...</div>';
      try {
        const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system: 'You are a helpful Ausbildung career advisor. Respond in English.',
            messages: [{ role: 'user', content: `Give a helpful overview of this Ausbildung: "${selectedJob.title}" at ${selectedJob.company} in ${selectedJob.location}. Include: 1) What it involves day-to-day, 2) Duration, 3) Monthly salary range, 4) Career prospects, 5) Why it is great for someone from abroad. Max 200 words.` }] }) });
        const d = await r.json();
        document.getElementById('jobOverview').textContent = d.content?.map(b => b.text || '').join('') || '';
      } catch (e) { document.getElementById('jobOverview').textContent = 'Could not load job details. Please continue.'; }
    };

    window.loadRequirements = async function() {
      const el = document.getElementById('requirementsContent');
      el.innerHTML = '<div class="loading"><div class="spinner"></div>Loading requirements...</div>';
      try {
        const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system: 'You are a helpful Ausbildung career advisor. Respond in English.',
            messages: [{ role: 'user', content: `List typical requirements for "${selectedJob.title}" Ausbildung in Germany. Include: education, German language level, age, specific skills. Under 150 words.` }] }) });
        const d = await r.json();
        el.innerHTML = `<div class="ai-response">${d.content?.map(b => b.text || '').join('') || ''}</div>`;
      } catch (e) { el.innerHTML = '<div class="ai-response">Typical requirements: Secondary school diploma, German B1 minimum, motivation and interest in the field.</div>'; }
    };

    window.loadDocumentChecklist = function() {
      const docs = [
        { id: 'cv', label: '📋 Lebenslauf (CV)', desc: 'German-style resume — generated for you in Step 4', tip: 'A German Lebenslauf must be in German, include a professional photo, and follow a strict format. We generate this for you in Step 4!' },
        { id: 'cover', label: '✉️ Bewerbungsschreiben', desc: 'Cover letter in German — generated for you in Step 4', tip: 'Your cover letter must be in formal German. We generate this for you in Step 4!' },
        { id: 'diploma', label: '🎓 School Diploma / Zeugnis', desc: 'Your highest school certificate, translated to German if needed', tip: 'You need an official copy of your school diploma. If not in German, you need a certified translation.' },
        { id: 'passport', label: '🛂 Valid Passport', desc: 'Must be valid for at least 6 months beyond your planned stay', tip: 'Your passport must be valid throughout your Ausbildung period plus at least 6 months extra.' },
        { id: 'photo', label: '📸 Biometric Passport Photo', desc: 'Recent professional photo, white background, 35x45mm', tip: 'You need a recent biometric photo (35x45mm, white background, neutral expression).' },
        { id: 'language', label: '🗣️ German Language Certificate', desc: 'Goethe-Zertifikat or TestDaF, minimum B1 level', tip: 'Most Ausbildung programs require at least B1 German. Get certified at a Goethe Institut in your country.' },
        { id: 'contract', label: '📄 Ausbildungsvertrag', desc: 'Training contract from employer — received after acceptance', tip: 'The Ausbildungsvertrag is signed by you and the employer. You need this to apply for your visa.' },
        { id: 'insurance', label: '🏥 Health Insurance Proof', desc: 'Required for visa — German public health insurance', tip: 'Once you have the Ausbildungsvertrag, register with a German public health insurer like TK or AOK.' },
      ];
      document.getElementById('docChecklist').innerHTML = docs.map(doc => `
        <div class="check-item" id="check-${doc.id}" onclick="window.toggleCheck('${doc.id}', \`${doc.tip}\`)">
          <div class="check-box" id="box-${doc.id}"></div>
          <div style="flex:1;"><div class="check-label">${doc.label}</div><div class="check-desc">${doc.desc}</div></div>
          <span style="font-size:12px;color:var(--text-muted);">ℹ️</span>
        </div>`).join('');
    };

    window.toggleCheck = function(id, tip) {
      const item = document.getElementById('check-' + id);
      const box = document.getElementById('box-' + id);
      const isChecked = item.classList.contains('checked');
      item.classList.toggle('checked', !isChecked);
      box.textContent = !isChecked ? '✓' : '';
      const tipEl = document.getElementById('docTip');
      tipEl.style.display = 'block';
      tipEl.innerHTML = `<strong style="color:var(--accent);">ℹ️ Info:</strong> ${tip}`;
    };

    window.generateApplicationDocs = async function() {
      const name = document.getElementById('appName').value.trim();
      if (!name) { alert('Please enter your name!'); return; }
      const gender = document.getElementById('appGender').value;
      const nationality = document.getElementById('appNationality').value.trim();
      const education = document.getElementById('appEducation').value.trim();
      const german = document.getElementById('appGerman').value;
      const skills = document.getElementById('appSkills').value.trim();
      const motivation = document.getElementById('appMotivation').value.trim();
      const btn = document.getElementById('generateDocsBtn');
      btn.disabled = true; btn.textContent = '⏳ Generating CV...';
      const uniqueSeed = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const antiAISystem = `Du bist ein erfahrener deutscher HR-Experte. Du erstellst Bewerbungsunterlagen die authentisch klingen, grammatikalisch einwandfrei auf Deutsch sind, und spezifisch auf diese Person zugeschnitten sind. Keine leeren Phrasen.`;
      try {
        const cvR = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system: antiAISystem, messages: [{ role: 'user', content: `Erstelle einen Lebenslauf auf Deutsch (Seed: ${uniqueSeed}). Verwende NUR die angegebenen Informationen. Name: ${name}, Geschlecht: ${gender}, Nationalität: ${nationality}, Ausbildung: ${education||'nicht angegeben'}, Deutschkenntnisse: ${german||'nicht angegeben'}, Kenntnisse: ${skills||'nicht angegeben'}, Bewirbt sich für: ${selectedJob.title} bei ${selectedJob.company} in ${selectedJob.location}. Füge [BEWERBUNGSFOTO] oben rechts ein.` }] }) });
        const cvD = await cvR.json();
        generatedCV = cvD.content?.map(b => b.text || '').join('') || '';
        btn.textContent = '⏳ Generating Cover Letter...';
        const covR = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system: antiAISystem, messages: [{ role: 'user', content: `Schreibe ein Bewerbungsschreiben auf Deutsch (Seed: ${uniqueSeed}). NICHT mit "Hiermit bewerbe ich mich" beginnen. Verwende NUR echte Angaben. Name: ${name}, Nationalität: ${nationality}, Ausbildung: ${education}, Deutschkenntnisse: ${german}, Kenntnisse: ${skills}, Motivation: ${motivation||'Möchte eine Ausbildung in Deutschland absolvieren'}, Stelle: ${selectedJob.title}, Unternehmen: ${selectedJob.company}, Ort: ${selectedJob.location}` }] }) });
        const covD = await covR.json();
        generatedCoverLetter = covD.content?.map(b => b.text || '').join('') || '';
        document.getElementById('generatedDocs').style.display = 'block';
        window.showDoc('cv');
        document.getElementById('nextToStep5Btn').style.display = 'block';
        document.getElementById('generateDocsBtn').style.display = 'none';
      } catch (e) { alert('Error generating documents. Please try again.'); }
      btn.disabled = false; btn.textContent = '✨ Generate My Documents';
    };

    window.showDoc = function(type) {
      currentDocShown = type;
      document.getElementById('docContent').textContent = type === 'cv' ? generatedCV : generatedCoverLetter;
      const cvStyle = type === 'cv';
      document.getElementById('docTabCv').style.cssText = `background:${cvStyle?'var(--accent)':'var(--surface2)'};border:${cvStyle?'none':'1px solid var(--border)'};border-radius:8px;color:${cvStyle?'#fff':'var(--text)'};font-size:13px;padding:8px 16px;cursor:pointer;`;
      document.getElementById('docTabCover').style.cssText = `background:${!cvStyle?'var(--accent)':'var(--surface2)'};border:${!cvStyle?'none':'1px solid var(--border)'};border-radius:8px;color:${!cvStyle?'#fff':'var(--text)'};font-size:13px;padding:8px 16px;cursor:pointer;`;
    };

    window.copyDoc = function() {
      navigator.clipboard.writeText(currentDocShown === 'cv' ? generatedCV : generatedCoverLetter).then(() => alert('Copied!'));
    };

    window.loadSubmitInstructions = async function() {
      const el = document.getElementById('submitInstructions');
      el.innerHTML = '<div class="loading"><div class="spinner"></div>Loading submission guide...</div>';
      try {
        const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system: 'You are a helpful Ausbildung career advisor. Respond in English.',
            messages: [{ role: 'user', content: `Give a brief guide on how to submit an application for "${selectedJob.title}" at ${selectedJob.company}. Include: how to send, subject line, file format (PDF), tips for following up. Under 150 words.` }] }) });
        const d = await r.json();
        el.textContent = d.content?.map(b => b.text || '').join('') || '';
      } catch (e) { el.textContent = 'Send your documents as PDF by email or the company website. Subject line: "Bewerbung als [Job Title]". Follow up after 2 weeks if no response.'; }
    };

    window.goToStep = function(step) {
      for (let i = 1; i <= 5; i++) {
        document.getElementById('step-' + i).classList.toggle('active', i === step);
        const dot = document.getElementById('dot-' + i);
        dot.classList.remove('active', 'done');
        if (i === step) dot.classList.add('active');
        else if (i < step) dot.classList.add('done');
      }
      if (step === 2) window.loadRequirements();
      if (step === 3) window.loadDocumentChecklist();
      if (step === 5) window.loadSubmitInstructions();
      document.getElementById('applyPanel').scrollIntoView({ behavior: 'smooth' });
    };

    window.closeApplyPanel = function() {
      document.getElementById('applyPanel').style.display = 'none';
      selectedJob = null;
    };

    window.previewJobPhoto = function(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { alert('Photo too large. Please use an image under 5MB.'); return; }
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('jobPhotoPreview');
        preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />`;
        preview.style.border = '2px solid var(--success)';
        window.jobUploadedPhoto = e.target.result;
        window.jobUploadedPhotoType = file.type.includes('png') ? 'PNG' : 'JPEG';
        document.getElementById('jobPhotoStatus').textContent = '✅ Photo ready — will appear in PDF';
        document.getElementById('jobPhotoStatus').style.color = 'var(--success)';
        document.getElementById('removeJobPhotoBtn').style.display = 'inline-block';
      };
      reader.readAsDataURL(file);
    };

    window.removeJobPhoto = function() {
      window.jobUploadedPhoto = null;
      const preview = document.getElementById('jobPhotoPreview');
      preview.innerHTML = '<div style="text-align:center;color:var(--text-muted);"><div style="font-size:20px;">📸</div><div style="font-size:10px;margin-top:2px;">Upload</div></div>';
      preview.style.border = '2px dashed var(--border)';
      document.getElementById('jobPhotoStatus').textContent = 'No photo uploaded yet';
      document.getElementById('jobPhotoStatus').style.color = '';
      document.getElementById('removeJobPhotoBtn').style.display = 'none';
      document.getElementById('jobPhotoInput').value = '';
    };

    window.downloadJobPDF = function() {
      const text = currentDocShown === 'cv' ? generatedCV : generatedCoverLetter;
      if (!text) { alert('Please generate documents first!'); return; }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW = 210, pageH = 297, marginL = 20, marginR = 20, marginT = 20;
      const contentW = pageW - marginL - marginR;
      const fileName = currentDocShown === 'cv' ? 'Lebenslauf' : 'Bewerbungsschreiben';
      const hasPhoto = window.jobUploadedPhoto && currentDocShown === 'cv';
      const photoW = 35, photoH = 45, photoX = pageW - marginR - photoW, photoY = marginT;
      if (hasPhoto) {
        try { doc.addImage(window.jobUploadedPhoto, window.jobUploadedPhotoType || 'JPEG', photoX, photoY, photoW, photoH); } catch(e) {}
      }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(10, 22, 40);
      const textAreaW = hasPhoto ? contentW - photoW - 8 : contentW;
      doc.text(fileName, marginL, marginT + 8);
      doc.setDrawColor(26, 86, 255); doc.setLineWidth(0.8);
      doc.line(marginL, marginT + 12, marginL + textAreaW, marginT + 12);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(40, 40, 40);
      let y = marginT + 20;
      text.split('\n').forEach(line => {
        if (y > pageH - 20) { doc.addPage(); y = marginT; }
        const trimmed = line.trim();
        if (trimmed.includes('[BEWERBUNGSFOTO]') || trimmed.includes('[PHOTO]')) return;
        if (!trimmed) { y += 3; return; }
        if ((trimmed === trimmed.toUpperCase() && trimmed.length > 2 && !/^\d/.test(trimmed)) || /^[A-ZÄÖÜ][^a-z]+:$/.test(trimmed)) {
          y += 3; doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(10,22,40);
          doc.text(trimmed, marginL, y); y += 1;
          doc.setDrawColor(220,228,240); doc.setLineWidth(0.3); doc.line(marginL, y+1, marginL+contentW, y+1); y += 5;
          doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(40,40,40); return;
        }
        doc.splitTextToSize(trimmed, contentW).forEach(wl => {
          if (y > pageH - 20) { doc.addPage(); y = marginT; }
          doc.text(wl, marginL, y); y += 5;
        });
      });
      doc.save(fileName + '.pdf');
    };

    // Share bar
    window.shareWhatsApp = function() { window.open('https://wa.me/?text=' + encodeURIComponent('Check out AusbildungInGermany.org — the free platform to find Ausbildung in Germany! ' + window.location.href), '_blank'); };
    window.shareFacebook = function() { window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank'); };
    window.copyLink = function() { navigator.clipboard.writeText(window.location.href).then(() => { const b = document.querySelector('[title="Copy link"]'); const orig = b.textContent; b.textContent = '✅'; b.style.background = '#00c48c'; setTimeout(() => { b.textContent = orig; b.style.background = '#0a1628'; }, 2000); }); };
    window.toggleFeedback = function() { const p = document.getElementById('feedbackPanel'); p.style.display = p.style.display === 'none' ? 'block' : 'none'; };
    window.submitFeedback = function() {
      const text = document.getElementById('fbText').value.trim();
      if (!text) { alert('Please write your feedback!'); return; }
      document.getElementById('feedbackPanel').innerHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:32px;margin-bottom:10px;">🙏</div><strong>Thank you!</strong></div>';
      setTimeout(() => { document.getElementById('feedbackPanel').style.display = 'none'; }, 3000);
    };
  }, []);

  const jsonLd = `{"@context":"https://schema.org","@type":"WebApplication","name":"Ausbildung Job Search","url":"https://www.ausbildungingermany.org/jobs","description":"Search thousands of real Ausbildung vacancies from Germany's official job database.","applicationCategory":"JobSearchApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"EUR"},"publisher":{"@type":"Organization","name":"AusbildungInGermany.org","url":"https://ausbildungingermany.org"}}`;

  const css = `
:root{--bg:#f8faff;--surface:#ffffff;--surface2:#f1f5fd;--border:#e2e8f0;--accent:#1a56ff;--accent2:#f5a623;--text:#0a1628;--text-muted:#718096;--success:#00c48c;--danger:#ff4757;--radius:16px;--navy:#0a1628;--blue:#1a56ff;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{padding-top:68px;background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;font-size:15px;line-height:1.6;min-height:100vh;}
main{max-width:900px;margin:0 auto;padding:40px 24px 80px;}
.page-title{font-family:'Outfit',sans-serif;font-size:32px;font-weight:800;letter-spacing:-0.5px;margin-bottom:8px;}
.page-title span{color:var(--accent);}
.page-subtitle{color:var(--text-muted);font-size:15px;margin-bottom:32px;}
.search-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:24px;}
.search-grid{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end;}
.search-group{display:flex;flex-direction:column;gap:6px;}
label{font-size:13px;font-weight:500;color:var(--text-muted);}
input,select,textarea{background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'Outfit',sans-serif;font-size:14px;padding:10px 14px;outline:none;transition:border-color 0.15s;width:100%;}
input:focus,select:focus,textarea:focus{border-color:var(--accent);}
textarea{resize:vertical;min-height:80px;}
.search-btn{background:linear-gradient(135deg,var(--accent),#7b5ef7);border:none;border-radius:10px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;padding:10px 24px;cursor:pointer;white-space:nowrap;height:42px;}
.search-btn:disabled{opacity:0.5;cursor:not-allowed;}
.quick-searches{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;}
.quick-chip{background:var(--surface2);border:1px solid var(--border);border-radius:20px;color:var(--text-muted);font-family:'Outfit',sans-serif;font-size:12px;padding:5px 12px;cursor:pointer;transition:all 0.15s;}
.quick-chip:hover{background:var(--accent);border-color:var(--accent);color:#fff;}
.results-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;}
.results-count{font-size:14px;color:var(--text-muted);}
.results-count span{color:var(--accent);font-weight:600;}
.job-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:12px;transition:all 0.15s;}
.job-card:hover{border-color:var(--accent);}
.job-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;}
.job-title{font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;}
.job-company{font-size:14px;color:var(--accent);margin-bottom:6px;}
.job-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;}
.job-tag{background:var(--surface2);border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text-muted);padding:3px 10px;}
.job-tag.highlight{border-color:rgba(26,86,255,0.3);color:var(--accent);background:rgba(26,86,255,0.08);}
.apply-btn{background:var(--accent);border:none;border-radius:8px;color:#fff;font-family:'Outfit',sans-serif;font-size:13px;padding:8px 18px;cursor:pointer;white-space:nowrap;transition:all 0.15s;flex-shrink:0;}
.apply-btn:hover{background:#6aa0f9;}
.apply-panel{background:var(--surface);border:2px solid var(--accent);border-radius:var(--radius);padding:28px;margin-top:24px;animation:fadeUp 0.3s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.apply-panel-title{font-family:'Outfit',sans-serif;font-size:20px;font-weight:800;margin-bottom:4px;}
.apply-panel-subtitle{color:var(--text-muted);font-size:14px;margin-bottom:24px;}
.steps-bar{display:flex;gap:4px;margin-bottom:28px;}
.step-dot{flex:1;height:4px;background:var(--border);border-radius:4px;transition:background 0.3s;}
.step-dot.active{background:var(--accent);}
.step-dot.done{background:var(--success);}
.step-content{display:none;}
.step-content.active{display:block;}
.step-title{font-family:'Outfit',sans-serif;font-size:17px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.checklist{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
.check-item{display:flex;align-items:center;gap:12px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 16px;cursor:pointer;transition:all 0.15s;}
.check-item:hover{border-color:var(--accent);}
.check-item.checked{border-color:var(--success);background:rgba(0,196,140,0.08);}
.check-box{width:20px;height:20px;border:2px solid var(--border);border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;transition:all 0.15s;}
.check-item.checked .check-box{background:var(--success);border-color:var(--success);color:#fff;}
.check-label{font-size:14px;flex:1;}
.check-desc{font-size:12px;color:var(--text-muted);margin-top:2px;}
.action-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;}
.btn-primary{background:linear-gradient(135deg,var(--accent),#7b5ef7);border:none;border-radius:10px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;padding:12px 24px;cursor:pointer;flex:1;transition:all 0.15s;}
.btn-primary:hover{opacity:0.9;}
.btn-primary:disabled{opacity:0.5;cursor:not-allowed;}
.btn-secondary{background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'Outfit',sans-serif;font-size:14px;padding:12px 20px;cursor:pointer;transition:all 0.15s;}
.btn-secondary:hover{border-color:var(--accent);color:var(--accent);}
.btn-success{background:var(--success);border:none;border-radius:10px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;padding:12px 24px;cursor:pointer;flex:1;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;}
.ai-response{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:20px;font-size:14px;line-height:1.8;white-space:pre-wrap;max-height:400px;overflow-y:auto;margin-bottom:16px;}
.loading{display:flex;align-items:center;gap:12px;color:var(--text-muted);font-size:14px;padding:20px 0;}
.spinner{width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.empty-state{text-align:center;padding:60px 20px;color:var(--text-muted);}
.empty-state .icon{font-size:48px;margin-bottom:16px;}
.empty-state h3{font-family:'Outfit',sans-serif;font-size:18px;color:var(--text);margin-bottom:8px;}
.pagination{display:flex;justify-content:center;gap:8px;margin-top:24px;flex-wrap:wrap;}
.page-btn{background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text-muted);font-family:'Outfit',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer;transition:all 0.15s;}
.page-btn:hover,.page-btn.active{background:var(--accent);border-color:var(--accent);color:#fff;}
@media(max-width:640px){.search-grid{grid-template-columns:1fr;}.job-header{flex-direction:column;}}
`;

  return (
    <>
      <Head>
        <title>Search Ausbildung Jobs in Germany – Free Job Finder</title>
        <meta name="description" content="Search thousands of real Ausbildung vacancies from Germany's official job database. Find your apprenticeship and apply with AI-powered guidance." />
        <meta property="og:title" content="Search Ausbildung Jobs in Germany – Free Job Finder" />
        <meta property="og:description" content="Search thousands of real Ausbildung vacancies from Germany's official job database." />
        <meta property="og:url" content="https://www.ausbildungingermany.org/jobs" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.ausbildungingermany.org/icon-512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.ausbildungingermany.org/jobs" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </Head>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="lazyOnload" />
      <Nav />

      <main>
        <div className="page-title">🔍 {t(lang,'jobs.title')}</div>
        <p className="page-subtitle">{t(lang,'jobs.sub')}</p>

        <div className="search-box">
          <div className="search-grid">
            <div className="search-group">
              <label>{t(lang,'jobs.placeholder')}</label>
              <input type="text" id="searchKeyword" placeholder="e.g. Kaufmann, IT, Koch..." onKeyDown={e => { if(e.key==='Enter') window.searchJobs && window.searchJobs(); }} />
            </div>
            <div className="search-group">
              <label>{t(lang,'jobs.location_ph')}</label>
              <input type="text" id="searchLocation" placeholder="e.g. Berlin, München..." onKeyDown={e => { if(e.key==='Enter') window.searchJobs && window.searchJobs(); }} />
            </div>
            <div className="search-group">
              <label>{t(lang,'jobs.filter_sector')}</label>
              <select id="searchSector">
                <option value="">All Sectors</option>
                <option value="IT">💻 IT &amp; Technology</option>
                <option value="Kaufmann">🛒 Retail &amp; Commerce</option>
                <option value="Pflege">🏥 Healthcare &amp; Nursing</option>
                <option value="Koch">🍳 Hospitality &amp; Cooking</option>
                <option value="Elektro">⚡ Electrical</option>
                <option value="Mechatroniker">🔧 Mechatronics</option>
                <option value="Büro">📋 Office &amp; Administration</option>
                <option value="Logistik">🚚 Logistics</option>
                <option value="Bau">🏗️ Construction</option>
                <option value="Friseur">✂️ Hairdressing</option>
              </select>
            </div>
            <button className="search-btn" onClick={() => window.searchJobs && window.searchJobs()} id="searchBtn">{t(lang,'common.search')}</button>
          </div>
          <div className="quick-searches">
            <span style={{fontSize:'12px',color:'var(--text-muted)',marginRight:'4px'}}>Popular:</span>
            <button className="quick-chip" onClick={() => window.quickSearch && window.quickSearch('Kaufmann')}>🛒 Kaufmann</button>
            <button className="quick-chip" onClick={() => window.quickSearch && window.quickSearch('Fachinformatiker')}>💻 Fachinformatiker</button>
            <button className="quick-chip" onClick={() => window.quickSearch && window.quickSearch('Krankenpflege')}>🏥 Krankenpflege</button>
            <button className="quick-chip" onClick={() => window.quickSearch && window.quickSearch('Koch')}>🍳 Koch</button>
            <button className="quick-chip" onClick={() => window.quickSearch && window.quickSearch('Elektriker')}>⚡ Elektriker</button>
            <button className="quick-chip" onClick={() => window.quickSearch && window.quickSearch('Mechatroniker')}>🔧 Mechatroniker</button>
            <button className="quick-chip" onClick={() => window.quickSearch && window.quickSearch('Logistik')}>🚚 Logistik</button>
          </div>
        </div>

        <div id="resultsArea">
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>Search for Ausbildung Jobs</h3>
            <p>Enter a keyword or sector above to find real Ausbildung vacancies in Germany.</p>
          </div>
        </div>

        {/* Application Panel */}
        <div className="apply-panel" id="applyPanel" style={{display:'none'}}>
          <div className="apply-panel-title" id="applyJobTitle"></div>
          <div className="apply-panel-subtitle" id="applyJobSubtitle"></div>
          <div className="steps-bar">
            <div className="step-dot active" id="dot-1"></div>
            <div className="step-dot" id="dot-2"></div>
            <div className="step-dot" id="dot-3"></div>
            <div className="step-dot" id="dot-4"></div>
            <div className="step-dot" id="dot-5"></div>
          </div>

          <div className="step-content active" id="step-1">
            <div className="step-title">📋 Step 1 — Job Overview</div>
            <div id="jobOverview" className="ai-response"></div>
            <div className="action-row">
              <button className="btn-primary" onClick={() => window.goToStep && window.goToStep(2)}>I&apos;m Interested — Start Application →</button>
              <button className="btn-secondary" onClick={() => window.closeApplyPanel && window.closeApplyPanel()}>← Back to Results</button>
            </div>
          </div>

          <div className="step-content" id="step-2">
            <div className="step-title">✅ Step 2 — Requirements Check</div>
            <div id="requirementsContent"></div>
            <div className="action-row">
              <button className="btn-primary" onClick={() => window.goToStep && window.goToStep(3)}>I Meet the Requirements →</button>
              <button className="btn-secondary" onClick={() => window.goToStep && window.goToStep(1)}>← Back</button>
            </div>
          </div>

          <div className="step-content" id="step-3">
            <div className="step-title">📁 Step 3 — Prepare Your Documents</div>
            <p style={{color:'var(--text-muted)',fontSize:'14px',marginBottom:'16px'}}>Click each item to learn more about it. Check it off when ready.</p>
            <div className="checklist" id="docChecklist"></div>
            <div id="docTip" style={{display:'none',background:'rgba(26,86,255,0.08)',border:'1px solid rgba(26,86,255,0.2)',borderRadius:'10px',padding:'14px',marginBottom:'16px',fontSize:'14px',lineHeight:'1.7'}}></div>
            <div className="action-row">
              <button className="btn-primary" onClick={() => window.goToStep && window.goToStep(4)}>Next — Generate Documents →</button>
              <button className="btn-secondary" onClick={() => window.goToStep && window.goToStep(2)}>← Back</button>
            </div>
          </div>

          <div className="step-content" id="step-4">
            <div className="step-title">✍️ Step 4 — Generate Your Application Documents</div>
            <p style={{color:'var(--text-muted)',fontSize:'14px',marginBottom:'20px'}}>We will generate a tailored Lebenslauf and Bewerbungsschreiben for this specific job — completely in German.</p>
            <div style={{display:'flex',alignItems:'flex-start',gap:'16px',marginBottom:'16px',padding:'16px',background:'var(--surface2)',border:'1.5px solid var(--border)',borderRadius:'12px'}}>
              <div id="jobPhotoPreview" onClick={() => document.getElementById('jobPhotoInput').click()} style={{width:'72px',height:'94px',border:'2px dashed var(--border)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',overflow:'hidden',cursor:'pointer',flexShrink:0}}>
                <div style={{textAlign:'center',color:'var(--text-muted)'}}><div style={{fontSize:'20px'}}>📸</div><div style={{fontSize:'10px',marginTop:'2px'}}>Upload</div></div>
              </div>
              <input type="file" id="jobPhotoInput" accept="image/*" style={{display:'none'}} onChange={e => window.previewJobPhoto && window.previewJobPhoto(e.nativeEvent)} />
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:'13px',marginBottom:'4px'}}>📸 Bewerbungsfoto <span style={{color:'var(--danger)',fontSize:'11px',fontWeight:400}}>Required for German CV</span></div>
                <div style={{fontSize:'12px',color:'var(--text-muted)',lineHeight:'1.6'}}>Professional · White background · JPG/PNG · Max 5MB<br /><span id="jobPhotoStatus">No photo uploaded yet</span></div>
                <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                  <button onClick={() => document.getElementById('jobPhotoInput').click()} style={{background:'var(--accent)',border:'none',borderRadius:'6px',color:'#fff',fontSize:'12px',padding:'5px 12px',cursor:'pointer'}}>Upload Photo</button>
                  <button onClick={() => window.removeJobPhoto && window.removeJobPhoto()} id="removeJobPhotoBtn" style={{display:'none',background:'none',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text-muted)',fontSize:'12px',padding:'4px 10px',cursor:'pointer'}}>✕ Remove</button>
                </div>
              </div>
            </div>
            <div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'20px',marginBottom:'16px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}><label>Your Full Name</label><input type="text" id="appName" placeholder="e.g. Amara Diallo" /></div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}><label>Geschlecht (Gender)</label>
                  <select id="appGender"><option value="">Select...</option><option value="male">Männlich (Male)</option><option value="female">Weiblich (Female)</option><option value="diverse">Divers</option></select>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}><label>Your Nationality</label><input type="text" id="appNationality" placeholder="e.g. Nigerian" /></div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}><label>Highest Education</label><input type="text" id="appEducation" placeholder="e.g. High School Diploma" /></div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}><label>German Level</label>
                  <select id="appGerman"><option value="">Select...</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px',gridColumn:'1/-1'}}><label>Your Skills &amp; Experience</label><textarea id="appSkills" placeholder="e.g. Computer skills, customer service..."></textarea></div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px',gridColumn:'1/-1'}}><label>Why do you want this Ausbildung?</label><textarea id="appMotivation" placeholder="e.g. I am passionate about this field..."></textarea></div>
              </div>
            </div>
            <div id="generatedDocs" style={{display:'none'}}>
              <div style={{display:'flex',gap:'8px',marginBottom:'12px',flexWrap:'wrap'}}>
                <button onClick={() => window.showDoc && window.showDoc('cv')} id="docTabCv" style={{background:'var(--accent)',border:'none',borderRadius:'8px',color:'#fff',fontSize:'13px',padding:'8px 16px',cursor:'pointer'}}>📋 Lebenslauf</button>
                <button onClick={() => window.showDoc && window.showDoc('cover')} id="docTabCover" style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'8px',color:'var(--text)',fontSize:'13px',padding:'8px 16px',cursor:'pointer'}}>✉️ Bewerbungsschreiben</button>
              </div>
              <div className="ai-response" id="docContent"></div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'12px'}}>
                <button onClick={() => window.copyDoc && window.copyDoc()} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'10px',color:'var(--text)',fontSize:'13px',padding:'8px 16px',cursor:'pointer'}}>📋 Copy</button>
                <button onClick={() => window.downloadJobPDF && window.downloadJobPDF()} style={{background:'var(--accent)',border:'none',borderRadius:'10px',color:'#fff',fontSize:'13px',fontWeight:600,padding:'8px 16px',cursor:'pointer'}}>⬇️ Download PDF</button>
              </div>
            </div>
            <div className="action-row">
              <button className="btn-primary" onClick={() => window.generateApplicationDocs && window.generateApplicationDocs()} id="generateDocsBtn">✨ Generate My Documents</button>
              <button className="btn-secondary" onClick={() => window.goToStep && window.goToStep(3)}>← Back</button>
            </div>
            <button className="btn-primary" onClick={() => window.goToStep && window.goToStep(5)} id="nextToStep5Btn" style={{display:'none',marginTop:'10px',width:'100%'}}>Documents Ready — Final Step →</button>
          </div>

          <div className="step-content" id="step-5">
            <div className="step-title">🚀 Step 5 — Submit Your Application</div>
            <p style={{color:'var(--text-muted)',fontSize:'14px',marginBottom:'20px'}}>You are ready! Here is how to submit your application.</p>
            <div id="submitInstructions" className="ai-response"></div>
            <div style={{background:'rgba(0,196,140,0.08)',border:'1px solid rgba(0,196,140,0.3)',borderRadius:'12px',padding:'20px',marginTop:'16px'}}>
              <p style={{fontSize:'14px',color:'var(--success)',fontWeight:600,marginBottom:'8px'}}>✅ Final Checklist Before Submitting</p>
              <ul style={{marginTop:'8px',paddingLeft:'20px',fontSize:'13px',color:'var(--text-muted)',lineHeight:2}}>
                <li>✅ Lebenslauf (CV) in German — generated above</li>
                <li>✅ Bewerbungsschreiben (Cover Letter) in German — generated above</li>
                <li>✅ Copies of your certificates and diplomas</li>
                <li>✅ Passport copy</li>
                <li>✅ German language certificate</li>
              </ul>
            </div>
            <div className="action-row" style={{marginTop:'20px'}}>
              <a href="#" id="officialApplyLink" target="_blank" className="btn-success">🚀 Go to Official Application Page →</a>
              <button className="btn-secondary" onClick={() => window.goToStep && window.goToStep(4)}>← Back</button>
            </div>
          </div>
        </div>
      </main>

      {/* Share Bar */}
      <div id="shareBar" style={{position:'fixed',bottom:'24px',left:'24px',zIndex:8888,display:'flex',flexDirection:'column',gap:'8px'}}>
        <button onClick={() => window.shareWhatsApp && window.shareWhatsApp()} title="Share on WhatsApp" onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#25D366',color:'#fff',fontSize:'20px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',transition:'all .2s'}}>💬</button>
        <button onClick={() => window.shareFacebook && window.shareFacebook()} title="Share on Facebook" onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#1877F2',color:'#fff',fontSize:'18px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',transition:'all .2s'}}>f</button>
        <button onClick={() => window.copyLink && window.copyLink()} title="Copy link" onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#0a1628',color:'#fff',fontSize:'18px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',transition:'all .2s'}}>🔗</button>
        <button onClick={() => window.toggleFeedback && window.toggleFeedback()} title="Send feedback" onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} style={{width:'44px',height:'44px',borderRadius:'50%',border:'none',background:'#f5a623',color:'#fff',fontSize:'18px',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',transition:'all .2s'}}>💡</button>
      </div>
      <div id="feedbackPanel" style={{display:'none',position:'fixed',bottom:'24px',left:'76px',zIndex:8889,background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:'16px',padding:'20px',width:'300px',boxShadow:'0 8px 32px rgba(0,0,0,0.12)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
          <strong style={{fontFamily:'Outfit,sans-serif',fontSize:'15px',color:'#0a1628'}}>💡 Send Feedback</strong>
          <button onClick={() => window.toggleFeedback && window.toggleFeedback()} style={{background:'none',border:'none',fontSize:'18px',cursor:'pointer',color:'#718096'}}>×</button>
        </div>
        <select id="fbType" style={{width:'100%',background:'#f8faff',border:'1.5px solid #e2e8f0',borderRadius:'8px',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',padding:'8px 12px',outline:'none',marginBottom:'10px'}}>
          <option>🐛 Bug / Something broken</option><option>💡 Feature suggestion</option><option>✏️ Wrong information</option><option>🌍 Language issue</option><option>👍 General feedback</option>
        </select>
        <textarea id="fbText" placeholder="Describe the issue or idea..." style={{width:'100%',background:'#f8faff',border:'1.5px solid #e2e8f0',borderRadius:'8px',color:'#0a1628',fontFamily:'Outfit,sans-serif',fontSize:'13px',padding:'10px 12px',outline:'none',resize:'none',minHeight:'80px',marginBottom:'10px'}}></textarea>
        <button onClick={() => window.submitFeedback && window.submitFeedback()} style={{width:'100%',background:'#0a1628',color:'#fff',border:'none',borderRadius:'9px',fontFamily:'Outfit,sans-serif',fontSize:'14px',fontWeight:600,padding:'10px',cursor:'pointer'}}>Send Feedback</button>
      </div>
    </>
  );
}
