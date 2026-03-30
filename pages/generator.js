import Head from 'next/head';
import Script from 'next/script';
import Nav from '../components/Nav';
import { useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

export default function Generator() {
  const { lang } = useLang();
  const currentDocRef = useRef('cv');
  const currentModeRef = useRef('form');
  const chatStepRef = useRef(0);
  const chatDataRef = useRef({});
  const generatedTextRef = useRef('');
  const uploadedPhotoRef = useRef(null);
  const uploadedPhotoTypeRef = useRef(null);

  useEffect(() => {
    const chatQuestions = [
      { key: 'name', q: "What's your full name?" },
      { key: 'dob', q: "What's your date of birth? (e.g. 15 March 1998)" },
      { key: 'nationality', q: "What's your nationality and current country?" },
      { key: 'contact', q: "What's your email address and phone number?" },
      { key: 'education', q: "What's your highest education level and where did you study?" },
      { key: 'workExp', q: "Do you have any work experience? If yes, briefly describe it. If no, just say 'No experience yet'." },
      { key: 'skills', q: "What are your skills? (e.g. computer skills, languages, driving license, sports, cooking)" },
      { key: 'germanLevel', q: "What is your German language level? (A1, A2, B1, B2, C1, C2, or Native)" },
      { key: 'ausbildungTarget', q: "Which Ausbildung are you applying for, and at which company (if you know)?" },
      { key: 'motivation', q: "Why do you want this Ausbildung? Tell me in a few sentences — this will go in your cover letter." },
    ];

    window.selectDoc = function(type) {
      currentDocRef.current = type;
      document.querySelectorAll('.doc-card').forEach(c => c.classList.remove('selected'));
      document.getElementById('card-' + type).classList.add('selected');
      const personal = document.getElementById('section-personal');
      const education = document.getElementById('section-education');
      const work = document.getElementById('section-work');
      const skills = document.getElementById('section-skills');
      const target = document.getElementById('section-target');
      const btn = document.getElementById('generateBtn');
      if (type === 'cv') {
        personal.style.display = 'block';
        education.style.display = 'block';
        work.style.display = 'block';
        skills.style.display = 'block';
        target.style.display = 'block';
        btn.textContent = '✨ Lebenslauf generieren';
      } else if (type === 'cover') {
        personal.style.display = 'block';
        education.style.display = 'none';
        work.style.display = 'none';
        skills.style.display = 'block';
        target.style.display = 'block';
        btn.textContent = '✨ Bewerbungsschreiben generieren';
      } else if (type === 'interview') {
        personal.style.display = 'none';
        education.style.display = 'none';
        work.style.display = 'none';
        skills.style.display = 'none';
        target.style.display = 'block';
        btn.textContent = '✨ Interview Vorbereitung generieren';
      }
    };

    window.setMode = function(mode) {
      currentModeRef.current = mode;
      document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + mode).classList.add('active');
      document.getElementById('form-mode').classList.toggle('hidden', mode !== 'form');
      document.getElementById('chat-mode').classList.toggle('hidden', mode !== 'chat');
    };

    window.generateFromForm = async function() {
      const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        nationality: document.getElementById('nationality').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        eduLevel: document.getElementById('eduLevel').value,
        schoolName: document.getElementById('schoolName').value,
        gradYear: document.getElementById('gradYear').value,
        fieldOfStudy: document.getElementById('fieldOfStudy').value,
        workExp: document.getElementById('workExp').value,
        skills: document.getElementById('skills').value,
        germanLevel: document.getElementById('germanLevel').value,
        otherLangs: document.getElementById('otherLangs').value,
        ausbildungTarget: document.getElementById('ausbildungTarget').value,
        companyName: document.getElementById('companyName').value,
        motivation: document.getElementById('motivation').value,
      };
      if (currentDocRef.current !== 'interview' && (!data.firstName || !data.lastName)) {
        alert('Please at least enter your first and last name!');
        return;
      }
      await window.generateDocuments(data);
    };

    function addChatMsg(role, text) {
      const container = document.getElementById('chatMessages');
      const div = document.createElement('div');
      div.className = 'chat-msg ' + role;
      div.innerHTML = `<div class="chat-avatar ${role}">${role === 'bot' ? '🎓' : '👤'}</div><div class="chat-bubble">${text}</div>`;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    window.sendChat = function() {
      const input = document.getElementById('chatInput');
      const text = input.value.trim();
      if (!text) return;
      addChatMsg('user', text);
      input.value = '';
      if (chatStepRef.current < chatQuestions.length) {
        chatDataRef.current[chatQuestions[chatStepRef.current].key] = text;
        chatStepRef.current++;
        setTimeout(() => {
          if (chatStepRef.current < chatQuestions.length) {
            addChatMsg('bot', chatQuestions[chatStepRef.current].q);
          } else {
            addChatMsg('bot', "Perfect! I have everything I need. 🎉 Click the button below to generate your documents!");
            document.getElementById('chatGenerateBtn').classList.remove('hidden');
            document.getElementById('chatSendBtn').disabled = true;
            input.disabled = true;
          }
        }, 500);
      }
    };

    window.generateFromChat = async function() {
      await window.generateDocuments(chatDataRef.current);
    };

    window.generateDocuments = async function(data) {
      const resultSection = document.getElementById('resultSection');
      const resultContent = document.getElementById('resultContent');
      const loadingIndicator = document.getElementById('loadingIndicator');
      const btn = document.getElementById(currentModeRef.current === 'form' ? 'generateBtn' : 'chatGenerateBtn');
      resultSection.classList.add('visible');
      loadingIndicator.classList.remove('hidden');
      resultContent.textContent = '';
      resultContent.style.display = 'none';
      document.getElementById('interviewTips').classList.add('hidden');
      btn.disabled = true;
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const uniqueSeed = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const prompts = {
        cv: `Du bist ein erfahrener HR-Experte und Karriereberater in Deutschland mit 20 Jahren Erfahrung. Du schreibst Lebensläufe, die klingen als wären sie von einem echten Menschen geschrieben — nicht von einer KI.

WICHTIG — ANTI-KI-REGELN (strikt einzuhalten):
- Verwende KEINE generischen Formulierungen wie "motiviert", "teamfähig", "zuverlässig", "kommunikativ", "lernbereit" als leere Worthülsen
- Keine aufgeblasenen, blumigen Sätze
- Keine Aufzählung von Eigenschaften ohne konkreten Kontext
- Jeder Satz muss spezifisch für DIESE Person und DIESEN Hintergrund sein
- Der Lebenslauf muss sich von allen anderen unterscheiden — einzigartig (Seed: ${uniqueSeed})
- Schreibe natürlich, klar und menschlich — wie ein Mensch das über sich schreiben würde
- Verwende aktive, präzise Sprache
- Vermeide Wiederholungen
- Überprüfe auf Grammatik und Rechtschreibung — null Fehler

ABSOLUT VERBOTEN — NIEMALS ERFINDEN:
- Füge KEINE Informationen hinzu die nicht angegeben wurden
- Erfinde KEINE Hobbys, Interessen, Vereinsmitgliedschaften oder ehrenamtliche Tätigkeiten
- Erfinde KEINE zusätzlichen Kenntnisse oder Fähigkeiten
- Erfinde KEINE Berufserfahrung oder Praktika
- Erfinde KEINE Kurse, Zertifikate oder Weiterbildungen
- Wenn ein Feld leer ist — lasse es leer oder schreibe "–" (KEIN Erfinden)
- Wenn keine Hobbys angegeben wurden — lasse den Abschnitt komplett weg
- Verwende NUR die exakten Informationen die der Bewerber angegeben hat
- Formatiere und präsentiere die echten Informationen professionell — aber FÜGE NICHTS HINZU

FORMAT (strikt einhalten):
[BEWERBUNGSFOTO]                    (oben rechts Platzhalter)

LEBENSLAUF

Persönliche Daten:
Name: [vollständiger Name direkt — kein zweites Label danach]
Geschlecht: [nur das Geschlecht]
Geburtsdatum: [nur das Datum — kein zweites Label, weglassen wenn nicht angegeben]
Nationalität: [nur die Nationalität — kein zweites Label]
Anschrift: [nur die Adresse direkt — z.B. "Lagos, Nigeria" — NIEMALS Label wiederholen]
Telefon: [nur die Nummer, weglassen wenn nicht angegeben]
E-Mail: [nur die E-Mail-Adresse, weglassen wenn nicht angegeben]

WICHTIG: Nach dem Doppelpunkt kommt direkt der Wert — KEINE Wiederholung des Labels.

Ausbildung:
[Nur die angegebene Ausbildung — NICHTS erfinden]

Berufserfahrung: (NUR wenn angegeben, sonst Abschnitt weglassen)
[Nur die angegebene Erfahrung]

Kenntnisse und Fähigkeiten:
[Nur die angegebenen Kenntnisse — NICHTS hinzufügen]

Sprachkenntnisse:
[Nur die angegebenen Sprachen]

Hobbys und Interessen: (NUR wenn vom Bewerber angegeben, sonst komplett weglassen)

Angaben zur Person:
Name: ${data.firstName || ''} ${data.lastName || ''} ${data.name || ''}
Geschlecht: ${data.gender === 'male' ? 'Männlich' : data.gender === 'female' ? 'Weiblich' : data.gender === 'diverse' ? 'Divers' : 'Nicht angegeben'}
Geburtsdatum: ${data.dob || 'nicht angegeben'}
Nationalität: ${data.nationality || ''}
Kontakt: ${data.email || 'nicht angegeben'} | ${data.phone || 'nicht angegeben'} | ${data.contact || ''}
Adresse: ${data.address || ''}
Schulabschluss/Studium: ${data.eduLevel || ''} - ${data.schoolName || ''} (${data.gradYear || ''}) - ${data.fieldOfStudy || ''} ${data.education || ''}
Berufserfahrung: ${data.workExp || 'Keine bisherige Berufserfahrung angegeben'}
Kenntnisse: ${data.skills || 'Keine angegeben'}
Deutschkenntnisse: ${data.germanLevel || 'nicht angegeben'}
Weitere Sprachen: ${data.otherLangs || 'keine weiteren angegeben'}
Angestrebte Ausbildung: ${data.ausbildungTarget || ''}

GRAMMATIK-HINWEIS: ${data.gender === 'male' ? 'Der Bewerber ist männlich — verwende männliche Formen: "der Bewerber", "er", "sein"' : data.gender === 'female' ? 'Die Bewerberin ist weiblich — verwende weibliche Formen: "die Bewerberin", "sie", "ihr"' : 'Verwende geschlechtsneutrale Sprache wo möglich'}

Erstelle den Lebenslauf NUR mit den oben angegebenen Informationen. Formatiere sie professionell — aber ERFINDE NICHTS DAZU.`,

        cover: `Du bist ein erfahrener Bewerbungsberater in Deutschland. Du schreibst Bewerbungsschreiben, die klingen wie von einem echten, engagierten Menschen — nicht wie KI-generierter Text.

WICHTIG — ANTI-KI-REGELN (strikt einzuhalten):
- KEINE generischen Phrasen: "Hiermit bewerbe ich mich", "Mit großem Interesse", "Ich bin eine motivierte Person", "teamfähig und zuverlässig"
- Beginne den Brief NICHT mit "Ich" — finde einen originellen, spezifischen Einstieg
- Jeder Satz muss konkret und spezifisch für diese Person, dieses Unternehmen und diese Stelle sein
- Zeige echte Persönlichkeit — nicht eine Schablone
- Der Brief muss bei einem deutschen Personalchef Interesse wecken — nicht langweilen
- Maximal eine Seite, präzise, kein Fülltext
- Einzigartig (Seed: ${uniqueSeed}) — kein anderer Brief soll so aussehen
- Überprüfe auf Grammatik und Rechtschreibung — null Fehler
- Verwende natürliche, menschliche Sprache

ABSOLUT VERBOTEN — NIEMALS ERFINDEN:
- ERFINDE KEINE Erfahrungen in Deutschland die nicht angegeben wurden
- ERFINDE KEINE Besuche in Deutschland, keine Einkäufe in deutschen Geschäften, keine Reisen nach Deutschland
- ERFINDE KEINE Praktika, Kurse oder Veranstaltungen die nicht angegeben wurden
- ERFINDE KEINE Kontakte oder Verbindungen zu Deutschland
- Verwende NUR die Informationen die der Bewerber angegeben hat
- Wenn die Person noch nie in Deutschland war — das ist normal und in Ordnung, schreibe trotzdem einen überzeugenden Brief ohne Lügen
- Motivation darf aus dem Herkunftsland kommen: z.B. Interesse am deutschen Berufsbildungssystem, Karriereziele, persönliche Stärken

Angaben:
Name: ${data.firstName || ''} ${data.lastName || ''} ${data.name || ''}
Geschlecht: ${data.gender === 'male' ? 'Männlich' : data.gender === 'female' ? 'Weiblich' : data.gender === 'diverse' ? 'Divers' : 'Nicht angegeben'}
Nationalität: ${data.nationality || ''}
Wohnort: ${data.address || 'Heimatland des Bewerbers'}
Ausbildung: ${data.eduLevel || ''} ${data.education || ''}
Kenntnisse: ${data.skills || ''}
Berufserfahrung: ${data.workExp || 'Keine bisherige Berufserfahrung'}
Deutschkenntnisse: ${data.germanLevel || ''}
Angestrebte Stelle: ${data.ausbildungTarget || ''}
Unternehmen: ${data.companyName || ''}
Persönliche Motivation: ${data.motivation || ''}

GRAMMATIK-HINWEIS: ${data.gender === 'male' ? 'Der Bewerber ist männlich — Anrede: "Sehr geehrte Damen und Herren," oder wenn Ansprechpartner bekannt "Sehr geehrter Herr [Name]". Verwende männliche Formen im Text.' : data.gender === 'female' ? 'Die Bewerberin ist weiblich — Anrede: "Sehr geehrte Damen und Herren," oder wenn Ansprechpartner bekannt "Sehr geehrte Frau [Name]". Verwende weibliche Formen im Text.' : 'Verwende "Sehr geehrte Damen und Herren," als Anrede. Verwende geschlechtsneutrale Sprache.'}

Schreibe ein authentisches, ehrliches und überzeugendes Bewerbungsschreiben. NUR auf Basis der echten Angaben — NICHTS erfinden.`,

        interview: `Du bist ein erfahrener Karrierecoach in Deutschland, der Menschen auf Vorstellungsgespräche vorbereitet. Schreibe realistische, praxisnahe Vorbereitungsunterlagen auf Deutsch.

WICHTIG:
- Fragen und Antworten müssen spezifisch für diese Ausbildung sein — nicht generisch
- Antwortbeispiele müssen zu dieser Person passen (Nationalität, Hintergrund)
- Kulturelle Tipps müssen konkret und praxisnah sein
- Keine leeren Phrasen — alles muss verwertbar sein
- Einzigartig (Seed: ${uniqueSeed})

Angestrebte Ausbildung: ${data.ausbildungTarget || 'allgemeine Ausbildung'}
Hintergrund des Bewerbers: ${data.nationality || ''}, ${data.education || data.eduLevel || ''}

Erstelle:
1. DIE 10 WICHTIGSTEN FRAGEN MIT BEISPIELANTWORTEN
2. 5 KULTURELLE TIPPS FÜR DAS GESPRÄCH IN DEUTSCHLAND
3. WAS MAN UNBEDINGT VERMEIDEN SOLLTE
4. FRAGEN DIE DER BEWERBER STELLEN SOLLTE

Alles auf Deutsch, praxisnah und authentisch.`
      };

      const titles = {
        cv: '📋 Your Lebenslauf (CV)',
        cover: '✉️ Your Bewerbungsschreiben (Cover Letter)',
        interview: '🎤 Your Interview Preparation Guide'
      };
      document.getElementById('resultTitle').textContent = titles[currentDocRef.current];

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: `Du bist ein erfahrener deutscher HR-Experte und Karriereberater mit 20 Jahren Erfahrung. Du erstellst Bewerbungsunterlagen die:
1. Authentisch und menschlich klingen — KEINE KI-Sprache
2. Grammatikalisch einwandfrei sind
3. Spezifisch auf die Person und Stelle zugeschnitten sind
4. Sich von allen anderen Bewerbungen unterscheiden
5. Bei deutschen Personalchefs positiv auffallen
6. Keine Klischees oder leere Worthülsen enthalten
Die Eingabe kann auf Englisch oder Deutsch sein. Du antwortest IMMER auf Deutsch.`,
            messages: [{ role: 'user', content: prompts[currentDocRef.current] }]
          })
        });
        const responseData = await response.json();
        generatedTextRef.current = responseData.content?.map(b => b.text || '').join('') || 'Error generating document.';
        loadingIndicator.classList.add('hidden');
        resultContent.style.display = 'block';
        resultContent.textContent = generatedTextRef.current;
      } catch (err) {
        loadingIndicator.classList.add('hidden');
        resultContent.style.display = 'block';
        resultContent.textContent = 'Error generating document. Please try again.';
      }
      btn.disabled = false;
    };

    window.copyResult = function() {
      navigator.clipboard.writeText(generatedTextRef.current).then(() => alert('Copied to clipboard!'));
    };

    window.saveToMyApplication = function() {
      if (!generatedTextRef.current) { alert('No document generated yet!'); return; }
      const titles = { cv: 'Lebenslauf', cover: 'Bewerbungsschreiben', interview: 'Interview Vorbereitung' };
      const name = titles[currentDocRef.current] + ' — ' + new Date().toLocaleDateString('de-DE');
      try {
        localStorage.setItem('pending_save', JSON.stringify({ name, type: currentDocRef.current, content: generatedTextRef.current }));
        alert('✅ Saved! Opening My Application...');
        window.open('/myapplication', '_blank');
      } catch (e) {
        alert('Could not save. Please copy the document manually.');
      }
    };

    window.previewPhoto = function(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { alert('Photo too large. Please use an image under 5MB.'); return; }
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('photoPreview');
        preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />`;
        preview.style.border = '2px solid var(--success)';
        uploadedPhotoRef.current = e.target.result;
        uploadedPhotoTypeRef.current = file.type.includes('png') ? 'PNG' : 'JPEG';
        document.getElementById('photoStatus').textContent = '✅ Photo uploaded — will appear in PDF';
        document.getElementById('photoStatus').style.color = 'var(--success)';
        document.getElementById('removePhotoBtn').style.display = 'inline-block';
      };
      reader.readAsDataURL(file);
    };

    window.removePhoto = function() {
      uploadedPhotoRef.current = null;
      uploadedPhotoTypeRef.current = null;
      const preview = document.getElementById('photoPreview');
      preview.innerHTML = `<div style="text-align:center;color:var(--text-muted);"><div style="font-size:28px;">📸</div><div style="font-size:11px;margin-top:4px;">Click to upload</div></div>`;
      preview.style.border = '2px dashed var(--border)';
      document.getElementById('photoStatus').textContent = 'No photo uploaded yet';
      document.getElementById('photoStatus').style.color = 'var(--text-muted)';
      document.getElementById('removePhotoBtn').style.display = 'none';
      document.getElementById('photoInput').value = '';
    };

    window.downloadPDF = function() {
      if (!generatedTextRef.current) { alert('Please generate a document first!'); return; }
      if (!window.jspdf) { alert('PDF library still loading, please try again in a moment.'); return; }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW = 210, pageH = 297, marginL = 20, marginR = 20, marginT = 20;
      const contentW = pageW - marginL - marginR;
      const titles = { cv: 'Lebenslauf', cover: 'Bewerbungsschreiben', interview: 'Interview Vorbereitung' };
      const fileName = titles[currentDocRef.current] || 'Dokument';
      const hasPhoto = uploadedPhotoRef.current && currentDocRef.current === 'cv';
      const photoW = 35, photoH = 45;
      const photoX = pageW - marginR - photoW;
      const photoY = marginT;
      if (hasPhoto) {
        try {
          doc.addImage(uploadedPhotoRef.current, uploadedPhotoTypeRef.current || 'JPEG', photoX, photoY, photoW, photoH);
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3);
          doc.rect(photoX, photoY, photoW, photoH);
        } catch(e) { console.warn('Photo error:', e); }
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(10, 22, 40);
      const textAreaW = hasPhoto ? contentW - photoW - 8 : contentW;
      doc.text(fileName, marginL, marginT + 8);
      doc.setDrawColor(26, 86, 255);
      doc.setLineWidth(0.8);
      doc.line(marginL, marginT + 12, marginL + textAreaW, marginT + 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      let y = marginT + 20;
      const lines = generatedTextRef.current.split('\n');
      lines.forEach(line => {
        if (y > pageH - 20) { doc.addPage(); y = marginT; doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(40, 40, 40); }
        const trimmed = line.trim();
        if (trimmed && (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && !/^\d/.test(trimmed)) || /^[A-ZÄÖÜ][^a-z]+:$/.test(trimmed)) {
          y += 3;
          doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(10, 22, 40);
          doc.text(trimmed, marginL, y);
          y += 1;
          doc.setDrawColor(220, 228, 240); doc.setLineWidth(0.3);
          doc.line(marginL, y + 1, marginL + contentW, y + 1);
          y += 5;
          doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(40, 40, 40);
          return;
        }
        if (/^[A-ZÄÖÜa-zäöü\s]+:\s/.test(trimmed) && trimmed.length < 60) {
          const colonIdx = trimmed.indexOf(':');
          const label = trimmed.substring(0, colonIdx + 1);
          const value = trimmed.substring(colonIdx + 1).trim();
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(10, 22, 40);
          doc.text(label, marginL, y);
          doc.setFont('helvetica', 'normal'); doc.setTextColor(40, 40, 40);
          if (value) doc.text(value, marginL + doc.getTextWidth(label) + 2, y);
          y += 6; return;
        }
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('·')) {
          const bulletText = '• ' + trimmed.replace(/^[•\-·]\s*/, '');
          const wrapped = doc.splitTextToSize(bulletText, contentW - 5);
          wrapped.forEach((wl, wi) => { if (y > pageH - 20) { doc.addPage(); y = marginT; } doc.text(wi === 0 ? wl : '  ' + wl.trim(), marginL + 3, y); y += 5; });
          return;
        }
        if (trimmed.includes('[BEWERBUNGSFOTO]') || trimmed.includes('[PHOTO]')) return;
        if (!trimmed) { y += 3; return; }
        const maxW = (hasPhoto && y < photoY + photoH + 5) ? textAreaW : contentW;
        const wrapped = doc.splitTextToSize(trimmed, maxW);
        wrapped.forEach(wl => { if (y > pageH - 20) { doc.addPage(); y = marginT; } doc.text(wl, marginL, y); y += 5; });
      });
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(160, 160, 160);
        doc.text(`${fileName} — Erstellt mit AusbildungInGermany.org`, marginL, pageH - 8);
        if (totalPages > 1) doc.text(`${i} / ${totalPages}`, pageW - marginR, pageH - 8, { align: 'right' });
      }
      doc.save(fileName + '.pdf');
    };

    // Share bar
    window.shareWhatsApp = function() { window.open('https://wa.me/?text=' + encodeURIComponent('Check out AusbildungInGermany.org — the free platform to find Ausbildung in Germany! ' + window.location.href), '_blank'); };
    window.shareFacebook = function() { window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank'); };
    window.copyLink = function() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const b = document.querySelector('[title="Copy link"]');
        const orig = b.textContent; b.textContent = '✅'; b.style.background = '#00c48c';
        setTimeout(() => { b.textContent = orig; b.style.background = '#0a1628'; }, 2000);
      });
    };
    window.toggleFeedback = function() { const p = document.getElementById('feedbackPanel'); p.style.display = p.style.display === 'none' ? 'block' : 'none'; };
    window.submitFeedback = function() {
      const type = document.getElementById('fbType').value;
      const text = document.getElementById('fbText').value.trim();
      if (!text) { alert('Please write your feedback!'); return; }
      console.log('Feedback:', type, text);
      document.getElementById('feedbackPanel').innerHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:32px;margin-bottom:10px;">🙏</div><strong style="font-family:Outfit,sans-serif;font-size:16px;color:#0a1628;">Thank you!</strong><p style="font-size:13px;color:#718096;margin-top:8px;">Your feedback helps us improve AusbildungInGermany for everyone.</p></div>';
      setTimeout(() => { document.getElementById('feedbackPanel').style.display = 'none'; }, 3000);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Free German CV &amp; Cover Letter Generator – AI-Powered</title>
        <meta name="description" content="Generate a professional German Lebenslauf (CV) and Bewerbungsschreiben (cover letter) for Ausbildung in seconds using AI." />
        <meta name="keywords" content="German CV generator, Lebenslauf erstellen, Bewerbungsschreiben Ausbildung, German cover letter, Ausbildung application documents" />
        <meta property="og:title" content="Free German CV & Cover Letter Generator – AI-Powered" />
        <meta property="og:description" content="Generate a professional German Lebenslauf (CV) and Bewerbungsschreiben (cover letter) for Ausbildung in seconds using AI." />
        <meta property="og:url" content="https://ausbildungingermany.org/generator" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://ausbildungingermany.org/generator" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Ausbildung CV & Cover Letter Generator",
  "url": "https://ausbildungingermany.org/generator",
  "description": "Generate a professional German Lebenslauf (CV) and Bewerbungsschreiben (cover letter) for Ausbildung in seconds using AI.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"},
  "publisher": {"@type": "Organization", "name": "AusbildungInGermany.org", "url": "https://ausbildungingermany.org"}
}` }} />
        <style dangerouslySetInnerHTML={{ __html: `
:root {
  --bg: #f8faff; --surface: #ffffff; --surface2: #f1f5fd;
  --border: #e2e8f0; --accent: #1a56ff; --accent2: #f5a623;
  --text: #0a1628; --text-muted: #718096; --success: #00c48c;
  --danger: #ff4757; --radius: 16px;
  --navy: #0a1628; --blue: #1a56ff;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { padding-top: 68px; background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; font-size: 15px; line-height: 1.6; min-height: 100vh; }
main { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
.page-title { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
.page-title span { color: var(--accent); }
.page-subtitle { color: var(--text-muted); font-size: 15px; margin-bottom: 36px; }
.mode-tabs { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 4px; margin-bottom: 32px; width: fit-content; }
.mode-tab { background: none; border: none; border-radius: 10px; color: var(--text-muted); font-family: 'Outfit', sans-serif; font-size: 14px; padding: 10px 20px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 8px; }
.mode-tab.active { background: var(--accent); color: #fff; }
.doc-selector { display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
.doc-card { flex: 1; min-width: 200px; background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius); padding: 20px; cursor: pointer; transition: all 0.15s; text-align: center; }
.doc-card:hover { border-color: var(--accent); }
.doc-card.selected { border-color: var(--accent); background: rgba(79,142,247,0.08); }
.doc-card .icon { font-size: 32px; margin-bottom: 8px; }
.doc-card h3 { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.doc-card p { font-size: 12px; color: var(--text-muted); }
.form-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; margin-bottom: 20px; }
.form-section h2 { font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: 1 / -1; }
label { font-size: 13px; font-weight: 500; color: var(--text-muted); }
input, textarea, select { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'Outfit', sans-serif; font-size: 14px; padding: 10px 14px; outline: none; transition: border-color 0.15s; width: 100%; }
input:focus, textarea:focus, select:focus { border-color: var(--accent); }
textarea { resize: vertical; min-height: 80px; }
.chat-mode { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.chat-messages { height: 400px; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
.chat-msg { display: flex; gap: 10px; animation: fadeUp 0.3s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.chat-msg.user { flex-direction: row-reverse; }
.chat-avatar { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.chat-avatar.bot { background: linear-gradient(135deg, var(--accent), #7b5ef7); }
.chat-avatar.user { background: var(--surface2); border: 1px solid var(--border); }
.chat-bubble { padding: 10px 14px; border-radius: 12px; font-size: 14px; max-width: 500px; line-height: 1.6; }
.chat-msg.bot .chat-bubble { background: var(--surface2); border: 1px solid var(--border); border-top-left-radius: 4px; }
.chat-msg.user .chat-bubble { background: #1a2540; border: 1px solid rgba(79,142,247,0.2); border-top-right-radius: 4px; }
.chat-input-row { display: flex; gap: 8px; padding: 14px; border-top: 1px solid var(--border); background: var(--surface2); }
.chat-input-row input { flex: 1; border-radius: 10px; }
.chat-send { width: 38px; height: 38px; background: var(--accent); border: none; border-radius: 10px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
.chat-send:hover { background: #6aa0f9; }
.chat-send:disabled { background: var(--border); cursor: not-allowed; }
.generate-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, var(--accent), #7b5ef7); border: none; border-radius: var(--radius); color: #fff; font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 20px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
.generate-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.result-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; margin-top: 24px; display: none; }
.result-section.visible { display: block; }
.result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.result-header h2 { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; }
.result-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.action-btn { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'Outfit', sans-serif; font-size: 13px; padding: 8px 16px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
.action-btn:hover { border-color: var(--accent); color: var(--accent); }
.action-btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.action-btn.primary:hover { background: #6aa0f9; }
.result-content { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 24px; white-space: pre-wrap; font-size: 14px; line-height: 1.8; max-height: 500px; overflow-y: auto; }
.loading { display: flex; align-items: center; gap: 10px; color: var(--text-muted); font-size: 14px; padding: 20px 0; }
.spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.hidden { display: none !important; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .form-group.full { grid-column: 1; } }
` }} />
      </Head>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="lazyOnload" />
      <Nav />

      <main>
        <div className="page-title">📄 {t(lang,'generator.title')}</div>
        <p className="page-subtitle">{t(lang,'generator.sub')}</p>

        {/* Document type */}
        <div className="doc-selector">
          <div className="doc-card selected" onClick={() => window.selectDoc && window.selectDoc('cv')} id="card-cv">
            <div className="icon">📋</div>
            <h3>Lebenslauf (CV)</h3>
            <p>German-style resume</p>
          </div>
          <div className="doc-card" onClick={() => window.selectDoc && window.selectDoc('cover')} id="card-cover">
            <div className="icon">✉️</div>
            <h3>Bewerbungsschreiben</h3>
            <p>Cover letter in German</p>
          </div>
          <div className="doc-card" onClick={() => window.selectDoc && window.selectDoc('interview')} id="card-interview">
            <div className="icon">🎤</div>
            <h3>Interview Prep</h3>
            <p>Questions &amp; answers</p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="mode-tabs">
          <button className="mode-tab active" onClick={() => window.setMode && window.setMode('form')} id="tab-form">📝 Form Mode</button>
          <button className="mode-tab" onClick={() => window.setMode && window.setMode('chat')} id="tab-chat">💬 Guided Chat</button>
        </div>

        {/* FORM MODE */}
        <div id="form-mode">
          <div className="form-section" id="section-personal">
            <h2>👤 Personal Information</h2>
            <div style={{display:'flex',alignItems:'flex-start',gap:'24px',marginBottom:'24px',padding:'20px',background:'var(--surface2)',border:'1.5px solid var(--border)',borderRadius:'14px'}}>
              <div>
                <div id="photoPreview" style={{width:'100px',height:'130px',border:'2px dashed var(--border)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',overflow:'hidden',cursor:'pointer',transition:'all 0.2s'}} onClick={() => document.getElementById('photoInput').click()}>
                  <div style={{textAlign:'center',color:'var(--text-muted)'}}>
                    <div style={{fontSize:'28px'}}>📸</div>
                    <div style={{fontSize:'11px',marginTop:'4px'}}>Click to upload</div>
                  </div>
                </div>
                <input type="file" id="photoInput" accept="image/*" style={{display:'none'}} onChange={(e) => window.previewPhoto && window.previewPhoto(e)} />
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:'14px',marginBottom:'6px',color:'var(--text)'}}>📸 Bewerbungsfoto (Application Photo)</div>
                <div style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:1.7}}>
                  A professional photo is <strong>required</strong> for German CVs.<br/>
                  ✅ Biometric style · White or neutral background<br/>
                  ✅ Professional clothing · Recent photo<br/>
                  <span style={{color:'var(--success)',fontSize:'12px'}} id="photoStatus">No photo uploaded yet</span>
                </div>
                <button onClick={() => document.getElementById('photoInput').click()} style={{marginTop:'10px',background:'var(--accent)',border:'none',borderRadius:'8px',color:'#fff',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:600,padding:'8px 16px',cursor:'pointer'}}>Upload Photo</button>
                <button onClick={() => window.removePhoto && window.removePhoto()} id="removePhotoBtn" style={{display:'none',marginTop:'10px',marginLeft:'8px',background:'none',border:'1.5px solid var(--border)',borderRadius:'8px',color:'var(--text-muted)',fontFamily:'Outfit,sans-serif',fontSize:'13px',padding:'7px 14px',cursor:'pointer'}}>✕ Remove</button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group"><label>First Name</label><input type="text" id="firstName" placeholder="e.g. Amara" /></div>
              <div className="form-group"><label>Last Name</label><input type="text" id="lastName" placeholder="e.g. Diallo" /></div>
              <div className="form-group"><label>Geschlecht (Gender)</label>
                <select id="gender">
                  <option value="">Select...</option>
                  <option value="male">Männlich (Male)</option>
                  <option value="female">Weiblich (Female)</option>
                  <option value="diverse">Divers (Non-binary)</option>
                </select>
              </div>
              <div className="form-group"><label>Date of Birth</label><input type="date" id="dob" /></div>
              <div className="form-group"><label>Nationality</label><input type="text" id="nationality" placeholder="e.g. Nigerian" /></div>
              <div className="form-group"><label>Email Address</label><input type="email" id="email" placeholder="your@email.com" /></div>
              <div className="form-group"><label>Phone Number</label><input type="text" id="phone" placeholder="+234 ..." /></div>
              <div className="form-group full"><label>Current Address</label><input type="text" id="address" placeholder="City, Country" /></div>
            </div>
          </div>

          <div className="form-section" id="section-education">
            <h2>🎓 Education</h2>
            <div className="form-grid">
              <div className="form-group full"><label>Highest Education Level</label>
                <select id="eduLevel">
                  <option value="">Select...</option>
                  <option>High School Diploma</option>
                  <option>Vocational Certificate</option>
                  <option>Bachelor&apos;s Degree</option>
                  <option>Master&apos;s Degree</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group"><label>School / University Name</label><input type="text" id="schoolName" placeholder="e.g. University of Lagos" /></div>
              <div className="form-group"><label>Graduation Year</label><input type="text" id="gradYear" placeholder="e.g. 2022" /></div>
              <div className="form-group full"><label>Field of Study / Major</label><input type="text" id="fieldOfStudy" placeholder="e.g. Electrical Engineering" /></div>
            </div>
          </div>

          <div className="form-section" id="section-work">
            <h2>💼 Work Experience <span style={{fontSize:'12px',color:'var(--text-muted)',fontWeight:400}}>(optional)</span></h2>
            <div className="form-grid">
              <div className="form-group full"><label>Previous Jobs (briefly describe)</label>
                <textarea id="workExp" placeholder="e.g. Worked as an electrician assistant for 2 years at ABC Company, Lagos."></textarea>
              </div>
            </div>
          </div>

          <div className="form-section" id="section-skills">
            <h2>🛠️ Skills &amp; Languages</h2>
            <div className="form-grid">
              <div className="form-group full"><label>Your Skills</label><input type="text" id="skills" placeholder="e.g. Computer skills, driving license, cooking, customer service" /></div>
              <div className="form-group"><label>German Language Level</label>
                <select id="germanLevel">
                  <option value="">Select...</option>
                  <option>A1 - Beginner</option>
                  <option>A2 - Elementary</option>
                  <option>B1 - Intermediate</option>
                  <option>B2 - Upper Intermediate</option>
                  <option>C1 - Advanced</option>
                  <option>C2 - Mastery</option>
                  <option>Native</option>
                </select>
              </div>
              <div className="form-group"><label>Other Languages</label><input type="text" id="otherLangs" placeholder="e.g. English (fluent), French (basic)" /></div>
            </div>
          </div>

          <div className="form-section" id="section-target">
            <h2>🎯 Ausbildung Target</h2>
            <div className="form-grid">
              <div className="form-group full"><label>Which Ausbildung are you applying for?</label><input type="text" id="ausbildungTarget" placeholder="e.g. Kaufmann im Einzelhandel (Retail Salesperson)" /></div>
              <div className="form-group full"><label>Company Name <span style={{color:'var(--text-muted)',fontWeight:400}}>(if known)</span></label><input type="text" id="companyName" placeholder="e.g. Lidl GmbH, Berlin" /></div>
              <div className="form-group full"><label>Why do you want this Ausbildung?</label>
                <textarea id="motivation" placeholder="e.g. I am passionate about retail and customer service..."></textarea>
              </div>
            </div>
          </div>

          <button className="generate-btn" onClick={() => window.generateFromForm && window.generateFromForm()} id="generateBtn">
            ✨ Generate My Documents
          </button>
        </div>

        {/* CHAT MODE */}
        <div id="chat-mode" className="hidden">
          <div className="chat-mode">
            <div className="chat-messages" id="chatMessages">
              <div className="chat-msg bot">
                <div className="chat-avatar bot">🎓</div>
                <div className="chat-bubble">Hi! I&apos;m going to help you create a professional German CV and cover letter. Let&apos;s start — what&apos;s your full name?</div>
              </div>
            </div>
            <div className="chat-input-row">
              <input type="text" id="chatInput" placeholder="Type your answer..." onKeyDown={(e) => { if (e.key === 'Enter') window.sendChat && window.sendChat(); }} />
              <button className="chat-send" onClick={() => window.sendChat && window.sendChat()} id="chatSendBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
          <button className="generate-btn hidden" onClick={() => window.generateFromChat && window.generateFromChat()} id="chatGenerateBtn">
            ✨ Generate My Documents Now
          </button>
        </div>

        {/* Result */}
        <div className="result-section" id="resultSection">
          <div className="result-header">
            <h2 id="resultTitle">📋 Your Lebenslauf</h2>
            <div className="result-actions">
              <button className="action-btn" onClick={() => window.copyResult && window.copyResult()}>📋 Copy</button>
              <button className="action-btn" onClick={() => window.saveToMyApplication && window.saveToMyApplication()} style={{background:'var(--success)',color:'#fff',borderColor:'var(--success)'}}>💾 Save to My Application</button>
              <button className="action-btn primary" onClick={() => window.downloadPDF && window.downloadPDF()}>⬇️ Download PDF</button>
            </div>
          </div>
          <div style={{background:'rgba(247,192,79,0.08)',border:'1px solid rgba(247,192,79,0.25)',borderRadius:'12px',padding:'16px',marginBottom:'16px',display:'flex',gap:'12px',alignItems:'flex-start'}}>
            <span style={{fontSize:'22px',flexShrink:0}}>⚠️</span>
            <div>
              <p style={{fontSize:'14px',fontWeight:600,color:'var(--accent2)',marginBottom:'4px'}}>Please review before sending!</p>
              <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:1.7}}>This document was generated based on the information you provided. <strong style={{color:'var(--text)'}}>Always read it carefully</strong> — check for accuracy, correct any errors, and make it truly yours.</p>
              <a href="/myapplication" style={{fontSize:'12px',color:'var(--accent)',textDecoration:'none',marginTop:'6px',display:'inline-block'}}>→ Open Self-Review Checklist in My Application</a>
            </div>
          </div>
          <div className="loading hidden" id="loadingIndicator">
            <div className="spinner"></div>
            Generating your document with AI...
          </div>
          <div className="result-content" id="resultContent"></div>
          <div id="interviewTips" className="hidden" style={{marginTop:'24px'}}>
            <h3 style={{fontFamily:'Outfit,sans-serif',fontSize:'16px',marginBottom:'12px'}}>🎤 Interview Preparation Tips</h3>
            <div id="tipsGrid"></div>
          </div>
        </div>
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
