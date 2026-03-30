import Head from 'next/head';
import { useEffect, useRef } from 'react';
import Nav from '../components/Nav';

export default function Embassy() {
  const embassyDataRef = useRef(null);
  const selectedCountryRef = useRef('');
  const selectedGermanLevelRef = useRef('');

  useEffect(() => {
    window.quickFind = function(country, level) {
      document.getElementById('countrySelect').value = country;
      document.getElementById('germanLevel').value = level;
      window.findEmbassy();
    };

    window.findEmbassy = async function() {
      const country = document.getElementById('countrySelect').value;
      const level = document.getElementById('germanLevel').value;
      selectedCountryRef.current = country;
      selectedGermanLevelRef.current = level;
      if (!country) { alert('Please select your country!'); return; }

      const btn = document.getElementById('findBtn');
      btn.disabled = true; btn.textContent = '⏳ Finding...';
      document.getElementById('resultsArea').innerHTML = '';
      document.getElementById('embassyPanel').style.display = 'none';

      try {
        const response = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: 'You are an expert on German embassies and visa applications. Return ONLY valid JSON, no markdown, no other text.',
            messages: [{ role: 'user', content: `Provide complete German embassy/consulate information for ${country} for an Ausbildung visa application. Return ONLY this JSON:
{
  "country": "${country}",
  "flag": "flag emoji",
  "embassyName": "full official name in English",
  "city": "city",
  "address": "full street address",
  "phone": "phone with country code",
  "email": "official visa email",
  "website": "official embassy website URL",
  "appointmentUrl": "visa appointment URL (use https://videx-asia.diplo.de or https://www.tls-visaservices.com or country-specific URL)",
  "openingHours": "consular section opening hours",
  "processingTime": "typical processing time for Ausbildung visa",
  "consulates": ["other consulate cities if any"],
  "languageRequirement": "German level required (usually B1)",
  "languageCertificate": "accepted certificates e.g. Goethe-Zertifikat B1, TestDaF",
  "academicRequirement": "minimum education required",
  "ageRequirement": "age range",
  "financialRequirement": "proof of financial means required",
  "blockingAccount": "amount needed for blocked account in EUR",
  "visaFee": "visa application fee in EUR",
  "serviceFee": "any additional service/agency fee",
  "appointmentFee": "appointment booking fee if any",
  "totalEstimatedCost": "total estimated cost in EUR",
  "requiredDocuments": ["list of required documents"],
  "appointmentSteps": [
    {"step": "step title", "detail": "step description", "link": "URL if applicable"}
  ],
  "importantNote": "country-specific important note",
  "eligibilityTips": "tips specific to applicants from this country"
}` }]
          })
        });
        const data = await response.json();
        const text = data.content?.map(b => b.text || '').join('') || '{}';
        embassyDataRef.current = JSON.parse(text.replace(/```json|```/g, '').trim());
        const d = embassyDataRef.current;

        document.getElementById('panelTitle').textContent = `${d.flag || '🏛️'} ${d.embassyName}`;
        document.getElementById('panelSubtitle').textContent = `📍 ${d.city}, ${d.country} — Ausbildungsvisum §16a AufenthG`;
        document.getElementById('bookAppointmentBtn').href = d.appointmentUrl || 'https://www.auswaertiges-amt.de';
        document.getElementById('embassyPanel').style.display = 'block';
        document.getElementById('embassyPanel').scrollIntoView({ behavior: 'smooth' });
        window.goToStep(1);
      } catch (err) {
        document.getElementById('resultsArea').innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><h3>Could not load embassy info</h3><p>Please visit <a href="https://www.auswaertiges-amt.de" target="_blank" style="color:#1a56ff;">www.auswaertiges-amt.de</a> directly.</p></div>`;
      }
      btn.disabled = false; btn.textContent = '🗺️ Find Embassy';
    };

    window.renderEmbassyInfo = function() {
      const d = embassyDataRef.current;
      document.getElementById('embassyInfoGrid').innerHTML = `
        <div class="info-grid">
          <div class="info-card highlight"><div class="info-label">📍 Address</div><div class="info-value">${d.address || 'See official website'}</div></div>
          <div class="info-card"><div class="info-label">📞 Phone</div><div class="info-value">${d.phone || 'See official website'}</div></div>
          <div class="info-card"><div class="info-label">✉️ Email</div><div class="info-value">${d.email ? `<a href="mailto:${d.email}">${d.email}</a>` : 'See official website'}</div></div>
          <div class="info-card"><div class="info-label">🕐 Opening Hours</div><div class="info-value">${d.openingHours || 'Mon–Fri, check website'}</div></div>
          <div class="info-card"><div class="info-label">⏱️ Processing Time</div><div class="info-value">${d.processingTime || '4–12 weeks'}</div></div>
          <div class="info-card"><div class="info-label">🌐 Official Website</div><div class="info-value"><a href="${d.website || '#'}" target="_blank">${d.website || 'See official website'}</a></div></div>
        </div>
        ${d.consulates && d.consulates.length > 0 ? `<div style="margin-top:12px;padding:14px;background:#f1f5fd;border:1px solid #e2e8f0;border-radius:10px;"><div style="font-size:12px;color:#718096;margin-bottom:6px;">OTHER CONSULATES IN ${d.country.toUpperCase()}</div><div style="font-size:14px;">${d.consulates.join(' • ')}</div></div>` : ''}`;
    };

    window.renderRequirements = function() {
      const d = embassyDataRef.current;
      const level = selectedGermanLevelRef.current;
      const germanOk = level && ['B1','B2','C1','C2'].includes(level);
      const germanPartial = level === 'A2';
      let eligClass = germanOk ? 'eligible' : (germanPartial ? 'partial' : 'ineligible');
      let eligMsg = germanOk
        ? `✅ Your German level (${level}) meets the requirement for most Ausbildung programs. You are eligible to apply!`
        : germanPartial
        ? `⚠️ Your German level (A2) is below the typical B1 requirement. You should improve your German before applying.`
        : level
        ? `❌ Your German level (${level}) is too low for most Ausbildung programs. You need at least B1 to apply.`
        : `ℹ️ Select your German level above to check your eligibility.`;

      document.getElementById('requirementsContent').innerHTML = `
        <div class="req-list">
          <div class="req-item"><div class="req-icon">🗣️</div><div><div class="req-title">Language Requirement</div><div class="req-desc">Minimum: <strong>${d.languageRequirement || 'B1 German'}</strong><br/>Accepted certificates: ${d.languageCertificate || 'Goethe-Zertifikat B1, TestDaF, telc Deutsch B1'}</div></div></div>
          <div class="req-item"><div class="req-icon">🎓</div><div><div class="req-title">Academic Requirement</div><div class="req-desc">${d.academicRequirement || 'Minimum secondary school diploma. Diploma must be officially recognized or translated into German.'}</div></div></div>
          <div class="req-item"><div class="req-icon">📅</div><div><div class="req-title">Age Requirement</div><div class="req-desc">${d.ageRequirement || 'Typically 16–35 years old.'}</div></div></div>
          <div class="req-item"><div class="req-icon">💰</div><div><div class="req-title">Financial Requirement</div><div class="req-desc">${d.financialRequirement || 'A blocked account (Sperrkonto) with approximately €11,208 is typically required.'}</div></div></div>
          <div class="req-item"><div class="req-icon">📄</div><div><div class="req-title">Required Documents</div><div class="req-desc">${d.requiredDocuments ? d.requiredDocuments.map((doc, i) => `${i+1}. ${doc}`).join('<br/>') : '1. Valid passport<br/>2. Ausbildungsvertrag<br/>3. School diploma with translation<br/>4. German language certificate<br/>5. Biometric photos<br/>6. Proof of health insurance<br/>7. Blocked account proof<br/>8. Visa application form'}</div></div></div>
        </div>
        <div style="font-size:15px;font-weight:700;margin-bottom:12px;">🔍 Your Eligibility Check</div>
        <div class="elig-result ${eligClass}">
          <p style="font-size:15px;font-weight:600;margin-bottom:6px;">${eligMsg}</p>
          ${d.eligibilityTips ? `<p style="margin-top:8px;font-size:13px;color:#718096;">💡 Tip for ${d.country} applicants: ${d.eligibilityTips}</p>` : ''}
        </div>`;
    };

    window.renderFees = function() {
      const d = embassyDataRef.current;
      document.getElementById('feesContent').innerHTML = `
        <table class="fee-table">
          <thead><tr><th>Fee Type</th><th>Amount</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>🇩🇪 Visa Application Fee</td><td class="fee-amount">${d.visaFee || '€75'}</td><td>Paid at embassy, non-refundable</td></tr>
            <tr><td>🏦 Blocked Account (Sperrkonto)</td><td class="fee-amount">${d.blockingAccount ? '€' + d.blockingAccount : '~€11,208'}</td><td>Required for visa, refunded after Ausbildung starts</td></tr>
            <tr><td>📋 Service / Agency Fee</td><td class="fee-amount">${d.serviceFee || '€0 (no agent needed!)'}</td><td>You can apply directly — no agent required</td></tr>
            <tr><td>📅 Appointment Fee</td><td class="fee-amount">${d.appointmentFee || '€0 (free)'}</td><td>Most embassies offer free appointment booking</td></tr>
            <tr style="font-weight:600;"><td>💳 Total Estimated Cost</td><td class="fee-amount">${d.totalEstimatedCost || '~€11,283'}</td><td>Mostly refundable (blocked account)</td></tr>
          </tbody>
        </table>
        <div class="info-card success" style="margin-bottom:12px;"><div class="info-label">💡 Money Saving Tip</div><div class="info-value">You do NOT need to pay an agent to apply for your Ausbildung visa. Agents typically charge €200–€2,000 unnecessarily.</div></div>
        <div class="info-card warning"><div class="info-label">🏦 About the Blocked Account</div><div class="info-value">The blocked account (Sperrkonto) is NOT a fee — it is YOUR money. Once your Ausbildung training begins, you can withdraw it monthly. Recommended: <strong>Fintiba, Expatrio, or Deutsche Bank</strong>.</div></div>`;
    };

    window.renderAppointment = function() {
      const d = embassyDataRef.current;
      const steps = d.appointmentSteps || [
        { step: "Gather all required documents", detail: "Make sure you have: valid passport, Ausbildungsvertrag, school diploma (translated), German language certificate, biometric photos, health insurance proof, blocked account proof, and completed visa application form.", link: "" },
        { step: "Create an account on the appointment portal", detail: "Register on the embassy's visa appointment system.", link: d.appointmentUrl || "https://www.auswaertiges-amt.de" },
        { step: "Fill in the visa application form", detail: "Complete the official German visa application form (Antrag auf Erteilung eines nationalen Visums).", link: "https://www.auswaertiges-amt.de/en/visa-service/-/231148" },
        { step: "Book your appointment", detail: "Select 'National Visa' → 'Ausbildung/Vocational Training'. Book as early as possible as slots fill up quickly.", link: d.appointmentUrl || "https://www.auswaertiges-amt.de" },
        { step: "Attend your appointment", detail: `Arrive 10 minutes early at ${d.address || 'the embassy'}. Bring ALL original documents plus copies. Pay the visa fee (${d.visaFee || '€75'}) at the embassy.`, link: "" },
        { step: "Wait for decision and collect your visa", detail: `Processing typically takes ${d.processingTime || '4–12 weeks'}.`, link: "" }
      ];
      document.getElementById('appointmentContent').innerHTML = `
        <p style="color:#718096;font-size:14px;margin-bottom:20px;">Follow these steps to successfully book and attend your visa appointment at the German embassy in ${d.country}.</p>
        <div class="appt-steps">
          ${steps.map((s, i) => `<div class="appt-step"><div class="appt-num">${i+1}</div><div class="appt-text"><h4>${s.step}</h4><p>${s.detail}${s.link ? ` <a href="${s.link}" target="_blank">→ Open link</a>` : ''}</p></div></div>`).join('')}
        </div>
        ${d.importantNote ? `<div class="note-box">⚠️ <strong>Important for ${d.country} applicants:</strong> ${d.importantNote}</div>` : ''}`;
    };

    window.goToStep = function(step) {
      for (let i = 1; i <= 4; i++) {
        document.getElementById('step-' + i).classList.toggle('active', i === step);
        const dot = document.getElementById('dot-' + i);
        dot.classList.remove('active', 'done');
        if (i === step) dot.classList.add('active');
        else if (i < step) dot.classList.add('done');
      }
      if (step === 1) window.renderEmbassyInfo();
      if (step === 2) window.renderRequirements();
      if (step === 3) window.renderFees();
      if (step === 4) window.renderAppointment();
      document.getElementById('embassyPanel').scrollIntoView({ behavior: 'smooth' });
    };

    window.closePanel = function() {
      document.getElementById('embassyPanel').style.display = 'none';
    };

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
      const type = document.getElementById('fbType').value;
      const text = document.getElementById('fbText').value.trim();
      if (!text) { alert('Please write your feedback!'); return; }
      document.getElementById('feedbackPanel').innerHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:32px;margin-bottom:10px;">🙏</div><strong style="font-family:Outfit,sans-serif;font-size:16px;color:#0a1628;">Thank you!</strong><p style="font-size:13px;color:#718096;margin-top:8px;">Your feedback helps us improve AusbildungInGermany for everyone.</p></div>';
      setTimeout(() => { document.getElementById('feedbackPanel').style.display = 'none'; }, 3000);
    };
  }, []);

  return (
    <>
      <Head>
        <title>German Embassy Finder – Ausbildung Visa Guide</title>
        <meta name="description" content="Find your nearest German embassy, visa requirements, fees and step-by-step appointment booking for the Ausbildungsvisum." />
        <meta name="keywords" content="German embassy, Ausbildungsvisum, Germany training visa, German visa appointment, §16a AufenthG visa" />
        <meta property="og:title" content="German Embassy Finder – Ausbildung Visa Guide" />
        <meta property="og:description" content="Find your nearest German embassy, visa requirements, fees and step-by-step appointment booking for the Ausbildungsvisum." />
        <meta property="og:url" content="https://ausbildungingermany.org/embassy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://ausbildungingermany.org/embassy" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "German Embassy Finder for Ausbildung Visa",
  "url": "https://ausbildungingermany.org/embassy",
  "description": "Find your nearest German embassy, visa requirements, fees and step-by-step appointment booking for the Ausbildungsvisum.",
  "publisher": {"@type": "Organization", "name": "AusbildungInGermany.org", "url": "https://ausbildungingermany.org"},
  "about": {"@type": "Thing", "name": "Ausbildungsvisum", "description": "German apprenticeship visa (§16a AufenthG) for non-EU citizens"}
}` }} />
        <style dangerouslySetInnerHTML={{ __html: `
body { padding-top: 68px; }
:root { --bg:#f8faff;--surface:#fff;--surface2:#f1f5fd;--border:#e2e8f0;--accent:#1a56ff;--accent2:#f5a623;--text:#0a1628;--text-muted:#718096;--success:#00c48c;--radius:16px; }
main{max-width:960px;margin:0 auto;padding:40px 24px 80px;}
.page-title{font-size:32px;font-weight:800;letter-spacing:-0.5px;margin-bottom:8px;}
.page-title span{color:#1a56ff;}
.page-subtitle{color:#718096;font-size:15px;margin-bottom:32px;}
.search-box{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:24px;}
.search-row{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;}
.search-group{display:flex;flex-direction:column;gap:6px;flex:1;min-width:200px;}
label{font-size:13px;font-weight:500;color:#718096;}
select,input{background:#f1f5fd;border:1px solid #e2e8f0;border-radius:10px;color:#0a1628;font-family:'Outfit',sans-serif;font-size:14px;padding:10px 14px;outline:none;transition:border-color 0.15s;width:100%;}
select:focus,input:focus{border-color:#1a56ff;}
.find-btn{background:linear-gradient(135deg,#1a56ff,#7b5ef7);border:none;border-radius:10px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;padding:10px 24px;cursor:pointer;height:42px;white-space:nowrap;transition:all 0.15s;}
.find-btn:hover{opacity:0.9;}.find-btn:disabled{opacity:0.5;cursor:not-allowed;}
.regions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;}
.region-chip{background:#f1f5fd;border:1px solid #e2e8f0;border-radius:20px;color:#718096;font-family:'Outfit',sans-serif;font-size:12px;padding:5px 12px;cursor:pointer;transition:all 0.15s;}
.region-chip:hover{background:#1a56ff;border-color:#1a56ff;color:#fff;}
.steps-bar{display:flex;gap:4px;margin-bottom:28px;}
.step-dot{flex:1;height:4px;background:#e2e8f0;border-radius:4px;transition:background 0.3s;}
.step-dot.active{background:#1a56ff;}.step-dot.done{background:#00c48c;}
.step-content{display:none;}.step-content.active{display:block;}
.embassy-panel{background:#fff;border:2px solid #1a56ff;border-radius:16px;padding:28px;margin-top:8px;animation:fadeUp 0.3s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.panel-title{font-size:20px;font-weight:800;margin-bottom:4px;}
.panel-subtitle{color:#718096;font-size:14px;margin-bottom:24px;}
.step-title{font-size:17px;font-weight:700;margin-bottom:16px;}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
.info-card{background:#f1f5fd;border:1px solid #e2e8f0;border-radius:12px;padding:16px;}
.info-card .info-label{font-size:11px;color:#718096;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;}
.info-card .info-value{font-size:14px;color:#0a1628;line-height:1.5;}
.info-card a{color:#1a56ff;text-decoration:none;}
.info-card.highlight{border-color:rgba(79,142,247,0.4);background:rgba(79,142,247,0.06);}
.info-card.warning{border-color:rgba(247,192,79,0.4);background:rgba(247,192,79,0.06);}
.info-card.success{border-color:rgba(79,200,122,0.4);background:rgba(79,200,122,0.06);}
.req-list{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
.req-item{background:#f1f5fd;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start;}
.req-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
.req-title{font-size:14px;font-weight:600;margin-bottom:3px;}
.req-desc{font-size:13px;color:#718096;line-height:1.6;}
.elig-result{border-radius:12px;padding:16px;margin-top:16px;font-size:14px;line-height:1.7;}
.elig-result.eligible{background:rgba(79,200,122,0.1);border:1px solid rgba(79,200,122,0.3);}
.elig-result.ineligible{background:rgba(247,79,79,0.1);border:1px solid rgba(247,79,79,0.3);}
.elig-result.partial{background:rgba(247,192,79,0.1);border:1px solid rgba(247,192,79,0.3);}
.appt-steps{display:flex;flex-direction:column;gap:12px;margin-bottom:20px;}
.appt-step{display:flex;gap:14px;align-items:flex-start;background:#f1f5fd;border:1px solid #e2e8f0;border-radius:12px;padding:16px;}
.appt-num{width:32px;height:32px;background:#1a56ff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;color:#fff;}
.appt-text h4{font-size:14px;font-weight:600;margin-bottom:4px;}
.appt-text p{font-size:13px;color:#718096;line-height:1.6;}
.appt-text a{color:#1a56ff;text-decoration:none;}
.action-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;}
.btn-primary{background:linear-gradient(135deg,#1a56ff,#7b5ef7);border:none;border-radius:10px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;padding:12px 24px;cursor:pointer;flex:1;transition:all 0.15s;}
.btn-primary:hover{opacity:0.9;}
.btn-secondary{background:#f1f5fd;border:1px solid #e2e8f0;border-radius:10px;color:#0a1628;font-family:'Outfit',sans-serif;font-size:14px;padding:12px 20px;cursor:pointer;transition:all 0.15s;}
.btn-secondary:hover{border-color:#1a56ff;color:#1a56ff;}
.btn-book{background:#00c48c;border:none;border-radius:10px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;padding:12px 24px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;flex:1;transition:all 0.15s;}
.btn-book:hover{opacity:0.9;}
.fee-table{width:100%;border-collapse:collapse;margin-bottom:16px;}
.fee-table th{background:#f1f5fd;padding:10px 14px;text-align:left;font-size:12px;color:#718096;text-transform:uppercase;letter-spacing:0.8px;}
.fee-table td{padding:12px 14px;border-top:1px solid #e2e8f0;font-size:14px;}
.fee-table tr:hover td{background:rgba(79,142,247,0.04);}
.fee-amount{color:#f5a623;font-weight:600;}
.empty-state{text-align:center;padding:60px 20px;color:#718096;}
.empty-state .icon{font-size:48px;margin-bottom:16px;}
.empty-state h3{font-size:18px;color:#0a1628;margin-bottom:8px;}
.note-box{background:rgba(247,192,79,0.08);border:1px solid rgba(247,192,79,0.3);border-radius:10px;padding:14px;font-size:13px;color:#f5a623;margin-top:16px;line-height:1.7;}
@media(max-width:640px){.info-grid{grid-template-columns:1fr;}.search-row{flex-direction:column;}}
        ` }} />
      </Head>
      <Nav />

      <main>
        <div className="page-title">🗺️ German Embassy <span>Finder</span></div>
        <p className="page-subtitle">Find your nearest German embassy, check visa requirements and fees, verify your eligibility, and get step-by-step appointment guidance — all in one place.</p>

        <div className="search-box">
          <div className="search-row">
            <div className="search-group">
              <label>Your Country</label>
              <select id="countrySelect">
                <option value="">Select your country...</option>
                <optgroup label="🌍 Africa">
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                  <option value="Ghana">🇬🇭 Ghana</option>
                  <option value="Kenya">🇰🇪 Kenya</option>
                  <option value="Ethiopia">🇪🇹 Ethiopia</option>
                  <option value="Tanzania">🇹🇿 Tanzania</option>
                  <option value="Uganda">🇺🇬 Uganda</option>
                  <option value="Cameroon">🇨🇲 Cameroon</option>
                  <option value="Senegal">🇸🇳 Senegal</option>
                  <option value="Morocco">🇲🇦 Morocco</option>
                  <option value="Egypt">🇪🇬 Egypt</option>
                  <option value="South Africa">🇿🇦 South Africa</option>
                  <option value="Zimbabwe">🇿🇼 Zimbabwe</option>
                  <option value="Rwanda">🇷🇼 Rwanda</option>
                  <option value="Sudan">🇸🇩 Sudan</option>
                  <option value="Somalia">🇸🇴 Somalia</option>
                  <option value="Ivory Coast">🇨🇮 Ivory Coast</option>
                  <option value="Zambia">🇿🇲 Zambia</option>
                  <option value="Mali">🇲🇱 Mali</option>
                  <option value="Guinea">🇬🇳 Guinea</option>
                  <option value="Burkina Faso">🇧🇫 Burkina Faso</option>
                </optgroup>
                <optgroup label="🌏 Asia">
                  <option value="India">🇮🇳 India</option>
                  <option value="Pakistan">🇵🇰 Pakistan</option>
                  <option value="Bangladesh">🇧🇩 Bangladesh</option>
                  <option value="Nepal">🇳🇵 Nepal</option>
                  <option value="Sri Lanka">🇱🇰 Sri Lanka</option>
                  <option value="Philippines">🇵🇭 Philippines</option>
                  <option value="Vietnam">🇻🇳 Vietnam</option>
                  <option value="Indonesia">🇮🇩 Indonesia</option>
                  <option value="Thailand">🇹🇭 Thailand</option>
                  <option value="Myanmar">🇲🇲 Myanmar</option>
                  <option value="Cambodia">🇰🇭 Cambodia</option>
                  <option value="Afghanistan">🇦🇫 Afghanistan</option>
                </optgroup>
                <optgroup label="🌍 Middle East">
                  <option value="Syria">🇸🇾 Syria</option>
                  <option value="Iraq">🇮🇶 Iraq</option>
                  <option value="Yemen">🇾🇪 Yemen</option>
                  <option value="Jordan">🇯🇴 Jordan</option>
                  <option value="Lebanon">🇱🇧 Lebanon</option>
                  <option value="Iran">🇮🇷 Iran</option>
                  <option value="Turkey">🇹🇷 Turkey</option>
                </optgroup>
                <optgroup label="🌎 Latin America">
                  <option value="Brazil">🇧🇷 Brazil</option>
                  <option value="Colombia">🇨🇴 Colombia</option>
                  <option value="Peru">🇵🇪 Peru</option>
                  <option value="Bolivia">🇧🇴 Bolivia</option>
                  <option value="Ecuador">🇪🇨 Ecuador</option>
                  <option value="Venezuela">🇻🇪 Venezuela</option>
                  <option value="Honduras">🇭🇳 Honduras</option>
                  <option value="Guatemala">🇬🇹 Guatemala</option>
                  <option value="Haiti">🇭🇹 Haiti</option>
                </optgroup>
                <optgroup label="🌍 Eastern Europe & Central Asia">
                  <option value="Ukraine">🇺🇦 Ukraine</option>
                  <option value="Georgia">🇬🇪 Georgia</option>
                  <option value="Armenia">🇦🇲 Armenia</option>
                  <option value="Kazakhstan">🇰🇿 Kazakhstan</option>
                  <option value="Uzbekistan">🇺🇿 Uzbekistan</option>
                  <option value="Moldova">🇲🇩 Moldova</option>
                  <option value="Albania">🇦🇱 Albania</option>
                  <option value="Kosovo">🇽🇰 Kosovo</option>
                  <option value="Serbia">🇷🇸 Serbia</option>
                  <option value="Bosnia">🇧🇦 Bosnia</option>
                  <option value="North Macedonia">🇲🇰 North Macedonia</option>
                </optgroup>
              </select>
            </div>
            <div className="search-group" style={{maxWidth:'200px'}}>
              <label>Your German Level</label>
              <select id="germanLevel">
                <option value="">Select...</option>
                <option value="A1">A1 – Beginner</option>
                <option value="A2">A2 – Elementary</option>
                <option value="B1">B1 – Intermediate</option>
                <option value="B2">B2 – Upper Intermediate</option>
                <option value="C1">C1 – Advanced</option>
                <option value="C2">C2 – Mastery</option>
              </select>
            </div>
            <button className="find-btn" onClick={() => window.findEmbassy && window.findEmbassy()} id="findBtn">🗺️ Find Embassy</button>
          </div>
          <div className="regions">
            <span style={{fontSize:'12px',color:'#718096',marginRight:'4px'}}>Quick select:</span>
            {[['Nigeria','B1','🇳🇬'],['India','B1','🇮🇳'],['Pakistan','A2','🇵🇰'],['Philippines','B1','🇵🇭'],['Nepal','A2','🇳🇵'],['Ghana','B1','🇬🇭'],['Kenya','B1','🇰🇪'],['Vietnam','B1','🇻🇳'],['Morocco','B1','🇲🇦'],['Turkey','B2','🇹🇷']].map(([c, l, f]) => (
              <button key={c} className="region-chip" onClick={() => window.quickFind && window.quickFind(c, l)}>{f} {c}</button>
            ))}
          </div>
        </div>

        <div id="resultsArea">
          <div className="empty-state">
            <div className="icon">🗺️</div>
            <h3>Select Your Country</h3>
            <p>Choose your country above to find the German embassy, check requirements, verify eligibility, and get appointment guidance.</p>
          </div>
        </div>

        <div className="embassy-panel" id="embassyPanel" style={{display:'none'}}>
          <div className="panel-title" id="panelTitle"></div>
          <div className="panel-subtitle" id="panelSubtitle"></div>
          <div className="steps-bar">
            <div className="step-dot active" id="dot-1"></div>
            <div className="step-dot" id="dot-2"></div>
            <div className="step-dot" id="dot-3"></div>
            <div className="step-dot" id="dot-4"></div>
          </div>
          <div className="step-content active" id="step-1">
            <div className="step-title">🏛️ Step 1 — Embassy Information</div>
            <div id="embassyInfoGrid"></div>
            <div className="action-row">
              <button className="btn-primary" onClick={() => window.goToStep && window.goToStep(2)}>Check Requirements →</button>
              <button className="btn-secondary" onClick={() => window.closePanel && window.closePanel()}>← Back</button>
            </div>
          </div>
          <div className="step-content" id="step-2">
            <div className="step-title">📋 Step 2 — Requirements & Eligibility Check</div>
            <div id="requirementsContent"></div>
            <div className="action-row">
              <button className="btn-primary" onClick={() => window.goToStep && window.goToStep(3)}>Check Visa Fees →</button>
              <button className="btn-secondary" onClick={() => window.goToStep && window.goToStep(1)}>← Back</button>
            </div>
          </div>
          <div className="step-content" id="step-3">
            <div className="step-title">💰 Step 3 — Visa Fees & Financial Requirements</div>
            <div id="feesContent"></div>
            <div className="action-row">
              <button className="btn-primary" onClick={() => window.goToStep && window.goToStep(4)}>Book Appointment →</button>
              <button className="btn-secondary" onClick={() => window.goToStep && window.goToStep(2)}>← Back</button>
            </div>
          </div>
          <div className="step-content" id="step-4">
            <div className="step-title">📅 Step 4 — Book Your Appointment</div>
            <div id="appointmentContent"></div>
            <div className="action-row">
              <a href="#" id="bookAppointmentBtn" target="_blank" className="btn-book">📅 Book Appointment Now →</a>
              <button className="btn-secondary" onClick={() => window.goToStep && window.goToStep(3)}>← Back</button>
            </div>
            <div className="note-box">⚠️ Always verify embassy details at <a href="https://www.auswaertiges-amt.de" target="_blank" style={{color:'#f5a623'}}>www.auswaertiges-amt.de</a> — the official German Foreign Office website.</div>
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
