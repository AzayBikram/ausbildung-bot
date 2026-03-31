import Head from 'next/head';
import { useEffect } from 'react';
import Nav from '../components/Nav';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

export default function Chat() {
  const { lang } = useLang();
  useEffect(() => {
    const SYSTEM_PROMPT = `You are AusbildungBot, a friendly and expert assistant that helps people from all over the world find and apply for Ausbildung (vocational apprenticeship training) in Germany.

Your expertise covers:
- Explaining what Ausbildung is and how the dual education system works
- Helping users find suitable Ausbildung programs
- Guiding foreigners through visa requirements (Ausbildungsvisum §16a AufenthG), Sperrkonto, health insurance
- Explaining document requirements: Lebenslauf, Bewerbungsschreiben, certified translations
- Top job portals: Bundesagentur für Arbeit (www.arbeitsagentur.de), Ausbildung.de, Make it in Germany (www.make-it-in-germany.com)
- German language requirements by field: B1 minimum for most, B2 for healthcare/social work
- Ausbildungsvergütung: legal minimum €724/month (2026), average €1,133/month
- Application timeline and post-Ausbildung paths

Rules:
- Be warm, encouraging, and supportive
- Define every German term you use the first time
- Always cite official sources
- If the user writes in any language, respond in THAT same language
- Use short paragraphs and bullet points
- Never discourage applicants`;

    let conversationHistory = [];
    let currentLang = 'en';

    const langNames = { en: 'English', de: 'German', ar: 'Arabic', tr: 'Turkish', fr: 'French', es: 'Spanish', hi: 'Hindi', ur: 'Urdu', bn: 'Bengali', sw: 'Swahili', tl: 'Filipino' };

    const UI = {
      en: { welcome_h: 'Find Your <em>Ausbildung</em> in Germany', welcome_p: "I can help you understand the German dual-education system, find apprenticeship programs, and guide you through the application process — no matter where you're from.", chip1: '🇩🇪 What is Ausbildung?', chip2: '🌍 Can I apply from abroad?', chip3: '🗣️ Language requirements', chip4: '🔍 Where to search', chip5: '✍️ Write cover letter', chip6: '🎓 Ausbildung vs. Studium', t1: '🇩🇪 What is Ausbildung?', t2: '🔍 Find Programs', t3: '📝 How to Apply', t4: '✈️ Visa & Documents', t5: '💰 Salary & Benefits', t6: '🏭 Top Sectors', t7: '🗣️ German Requirements', t8: '🚀 Career After', new_chat: '🗑️ New Chat' },
      de: { welcome_h: 'Finde deine <em>Ausbildung</em> in Deutschland', welcome_p: 'Ich helfe dir, das duale Bildungssystem zu verstehen, Ausbildungsplätze zu finden und dich durch den Bewerbungsprozess zu führen.', chip1: '🇩🇪 Was ist Ausbildung?', chip2: '🌍 Kann ich mich aus dem Ausland bewerben?', chip3: '🗣️ Sprachanforderungen', chip4: '🔍 Wo suchen?', chip5: '✍️ Anschreiben schreiben', chip6: '🎓 Ausbildung vs. Studium', t1: '🇩🇪 Was ist Ausbildung?', t2: '🔍 Programme finden', t3: '📝 Wie bewerben?', t4: '✈️ Visum & Dokumente', t5: '💰 Gehalt & Vorteile', t6: '🏭 Top-Branchen', t7: '🗣️ Deutschkenntnisse', t8: '🚀 Karriere danach', new_chat: '🗑️ Neuer Chat' },
      ar: { welcome_h: 'ابحث عن <em>Ausbildung</em> في ألمانيا', welcome_p: 'يمكنني مساعدتك في فهم نظام التعليم المزدوج الألماني وإيجاد برامج التدريب المهني وإرشادك خلال عملية التقديم.', chip1: '🇩🇪 ما هو Ausbildung؟', chip2: '🌍 هل يمكنني التقديم من الخارج؟', chip3: '🗣️ متطلبات اللغة', chip4: '🔍 أين أبحث؟', chip5: '✍️ كتابة خطاب التقديم', chip6: '🎓 Ausbildung مقابل Studium', t1: '🇩🇪 ما هو Ausbildung؟', t2: '🔍 إيجاد البرامج', t3: '📝 كيفية التقديم', t4: '✈️ التأشيرة والوثائق', t5: '💰 الراتب والمزايا', t6: '🏭 أفضل القطاعات', t7: '🗣️ متطلبات الألمانية', t8: '🚀 المسيرة بعد التخرج', new_chat: '🗑️ دردشة جديدة' },
      tr: { welcome_h: "Almanya'da <em>Ausbildung</em>'ını Bul", welcome_p: "Alman ikili eğitim sistemini anlamanıza, çıraklık programları bulmanıza ve başvuru sürecinde size rehberlik etmeme yardımcı olabilirim.", chip1: '🇩🇪 Ausbildung nedir?', chip2: '🌍 Yurtdışından başvurabilir miyim?', chip3: '🗣️ Dil gereksinimleri', chip4: '🔍 Nerede aranır?', chip5: '✍️ Ön yazı yaz', chip6: '🎓 Ausbildung - Studium farkı', t1: '🇩🇪 Ausbildung nedir?', t2: '🔍 Program Bul', t3: '📝 Nasıl Başvurulur', t4: '✈️ Vize & Belgeler', t5: '💰 Maaş & Faydalar', t6: '🏭 Popüler Sektörler', t7: '🗣️ Almanca Gereksinimleri', t8: '🚀 Sonraki Kariyer', new_chat: '🗑️ Yeni Sohbet' },
      fr: { welcome_h: 'Trouvez votre <em>Ausbildung</em> en Allemagne', welcome_p: "Je peux vous aider à comprendre le système dual allemand, trouver des programmes d'apprentissage et vous guider tout au long du processus de candidature.", chip1: '🇩🇪 Qu\'est-ce que l\'Ausbildung?', chip2: '🌍 Puis-je postuler depuis l\'étranger?', chip3: '🗣️ Exigences linguistiques', chip4: '🔍 Où chercher?', chip5: '✍️ Écrire une lettre de motivation', chip6: '🎓 Ausbildung vs Studium', t1: '🇩🇪 Qu\'est-ce que l\'Ausbildung?', t2: '🔍 Trouver des programmes', t3: '📝 Comment postuler', t4: '✈️ Visa & Documents', t5: '💰 Salaire & Avantages', t6: '🏭 Meilleurs secteurs', t7: '🗣️ Exigences en allemand', t8: '🚀 Carrière après', new_chat: '🗑️ Nouveau chat' },
      es: { welcome_h: 'Encuentra tu <em>Ausbildung</em> en Alemania', welcome_p: 'Puedo ayudarte a entender el sistema de educación dual alemán, encontrar programas de aprendizaje y guiarte a través del proceso de solicitud.', chip1: '🇩🇪 ¿Qué es Ausbildung?', chip2: '🌍 ¿Puedo aplicar desde el extranjero?', chip3: '🗣️ Requisitos de idioma', chip4: '🔍 ¿Dónde buscar?', chip5: '✍️ Escribir carta de presentación', chip6: '🎓 Ausbildung vs Studium', t1: '🇩🇪 ¿Qué es Ausbildung?', t2: '🔍 Encontrar programas', t3: '📝 Cómo aplicar', t4: '✈️ Visa y documentos', t5: '💰 Salario y beneficios', t6: '🏭 Mejores sectores', t7: '🗣️ Requisitos de alemán', t8: '🚀 Carrera después', new_chat: '🗑️ Nuevo chat' },
      hi: { welcome_h: 'जर्मनी में अपना <em>Ausbildung</em> खोजें', welcome_p: 'मैं जर्मन दोहरी शिक्षा प्रणाली को समझने, प्रशिक्षुता कार्यक्रम खोजने और आवेदन प्रक्रिया में मदद कर सकता हूं।', chip1: '🇩🇪 Ausbildung क्या है?', chip2: '🌍 क्या मैं विदेश से आवेदन कर सकता हूं?', chip3: '🗣️ भाषा आवश्यकताएं', chip4: '🔍 कहां खोजें?', chip5: '✍️ कवर लेटर लिखें', chip6: '🎓 Ausbildung बनाम Studium', t1: '🇩🇪 Ausbildung क्या है?', t2: '🔍 प्रोग्राम खोजें', t3: '📝 आवेदन कैसे करें', t4: '✈️ वीज़ा और दस्तावेज़', t5: '💰 वेतन और लाभ', t6: '🏭 शीर्ष क्षेत्र', t7: '🗣️ जर्मन आवश्यकताएं', t8: '🚀 बाद में करियर', new_chat: '🗑️ नई चैट' },
      ur: { welcome_h: 'جرمنی میں اپنا <em>Ausbildung</em> تلاش کریں', welcome_p: 'میں جرمن دوہری تعلیمی نظام کو سمجھنے، تربیتی پروگرام تلاش کرنے اور درخواست کے عمل میں رہنمائی کر سکتا ہوں۔', chip1: '🇩🇪 Ausbildung کیا ہے؟', chip2: '🌍 کیا میں بیرون ملک سے درخواست دے سکتا ہوں؟', chip3: '🗣️ زبان کی ضروریات', chip4: '🔍 کہاں تلاش کریں؟', chip5: '✍️ کور لیٹر لکھیں', chip6: '🎓 Ausbildung بنام Studium', t1: '🇩🇪 Ausbildung کیا ہے؟', t2: '🔍 پروگرام تلاش کریں', t3: '📝 درخواست کیسے دیں', t4: '✈️ ویزا اور دستاویزات', t5: '💰 تنخواہ اور فوائد', t6: '🏭 اعلیٰ شعبے', t7: '🗣️ جرمن ضروریات', t8: '🚀 بعد میں کیریئر', new_chat: '🗑️ نئی چیٹ' },
      bn: { welcome_h: 'জার্মানিতে আপনার <em>Ausbildung</em> খুঁজুন', welcome_p: 'আমি জার্মান দ্বৈত শিক্ষা ব্যবস্থা বুঝতে, শিক্ষানবিশ প্রোগ্রাম খুঁজে পেতে এবং আবেদন প্রক্রিয়ায় গাইড করতে সাহায্য করতে পারি।', chip1: '🇩🇪 Ausbildung কী?', chip2: '🌍 আমি কি বিদেশ থেকে আবেদন করতে পারি?', chip3: '🗣️ ভাষার প্রয়োজনীয়তা', chip4: '🔍 কোথায় খুঁজবেন?', chip5: '✍️ কভার লেটার লিখুন', chip6: '🎓 Ausbildung বনাম Studium', t1: '🇩🇪 Ausbildung কী?', t2: '🔍 প্রোগ্রাম খুঁজুন', t3: '📝 কিভাবে আবেদন করবেন', t4: '✈️ ভিসা ও নথিপত্র', t5: '💰 বেতন ও সুবিধা', t6: '🏭 শীর্ষ সেক্টর', t7: '🗣️ জার্মান প্রয়োজনীয়তা', t8: '🚀 পরবর্তী ক্যারিয়ার', new_chat: '🗑️ নতুন চ্যাট' },
      sw: { welcome_h: 'Pata <em>Ausbildung</em> Yako Ujerumani', welcome_p: 'Ninaweza kukusaidia kuelewa mfumo wa elimu wa Ujerumani, kupata programu za mafunzo na kukuongoza kupitia mchakato wa maombi.', chip1: '🇩🇪 Ausbildung ni nini?', chip2: '🌍 Naweza kuomba kutoka nje ya nchi?', chip3: '🗣️ Mahitaji ya lugha', chip4: '🔍 Kutafuta wapi?', chip5: '✍️ Andika barua ya maombi', chip6: '🎓 Ausbildung dhidi ya Studium', t1: '🇩🇪 Ausbildung ni nini?', t2: '🔍 Pata Programu', t3: '📝 Jinsi ya Kuomba', t4: '✈️ Visa na Nyaraka', t5: '💰 Mshahara na Faida', t6: '🏭 Sekta Bora', t7: '🗣️ Mahitaji ya Kijerumani', t8: '🚀 Kazi Baadaye', new_chat: '🗑️ Mazungumzo Mapya' },
      tl: { welcome_h: 'Hanapin ang Iyong <em>Ausbildung</em> sa Germany', welcome_p: 'Matutulungan kita na maunawaan ang sistemang pang-edukasyon ng Germany, mahanap ang mga programa ng apprenticeship at gabayan ka sa proseso ng aplikasyon.', chip1: '🇩🇪 Ano ang Ausbildung?', chip2: '🌍 Maaari ba akong mag-apply mula sa ibang bansa?', chip3: '🗣️ Mga kinakailangan sa wika', chip4: '🔍 Saan maghanap?', chip5: '✍️ Sumulat ng cover letter', chip6: '🎓 Ausbildung kumpara sa Studium', t1: '🇩🇪 Ano ang Ausbildung?', t2: '🔍 Hanapin ang Mga Programa', t3: '📝 Paano Mag-apply', t4: '✈️ Visa at Mga Dokumento', t5: '💰 Sahod at Benepisyo', t6: '🏭 Nangungunang Sektor', t7: '🗣️ Mga Kinakailangan sa Aleman', t8: '🚀 Karera Pagkatapos', new_chat: '🗑️ Bagong Chat' },
    };

    window.setChatLang = function(lang) {
      currentLang = lang;
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      const btn = document.getElementById('lang-' + lang);
      if (btn) btn.classList.add('active');
      const u = UI[lang] || UI.en;
      const input = document.getElementById('userInput');
      if (input) input.placeholder = u.chip3.replace(/^[^\s]+\s/, '') + '…';
      // Update placeholder from chat key if available
      const placeholders = { en: 'Ask me anything about Ausbildung in Germany…', de: 'Frag mich alles über Ausbildung in Deutschland…', ar: 'اسألني أي شيء عن التدريب المهني في ألمانيا…', tr: "Almanya'daki Ausbildung hakkında her şeyi sorabilirsiniz…", fr: "Posez-moi des questions sur l'Ausbildung en Allemagne…", es: 'Pregúntame sobre la formación profesional en Alemania…', hi: 'जर्मनी में Ausbildung के बारे में कुछ भी पूछें…', ur: 'جرمنی میں Ausbildung کے بارے میں کچھ بھی پوچھیں…', bn: 'জার্মানিতে Ausbildung সম্পর্কে যেকোনো প্রশ্ন করুন…', sw: 'Uliza chochote kuhusu Ausbildung Ujerumani…', tl: 'Magtanong tungkol sa Ausbildung sa Germany…' };
      if (input) input.placeholder = placeholders[lang] || placeholders.en;
      // Update sidebar topic buttons
      const topics = document.querySelectorAll('.topic-btn[data-i]');
      topics.forEach(b => { const i = b.getAttribute('data-i'); if (u['t'+i]) b.textContent = u['t'+i]; });
      // Update clear button
      const clearBtn = document.querySelector('.clear-btn');
      if (clearBtn) clearBtn.innerHTML = u.new_chat || '🗑️ New Chat';
      // Update welcome screen if still visible
      const welcome = document.getElementById('welcome');
      if (welcome) {
        const h2 = welcome.querySelector('h2');
        const p = welcome.querySelector('p');
        if (h2) h2.innerHTML = u.welcome_h;
        if (p) p.textContent = u.welcome_p;
        const chips = welcome.querySelectorAll('.welcome-chip');
        ['chip1','chip2','chip3','chip4','chip5','chip6'].forEach((k,i) => { if (chips[i] && u[k]) chips[i].textContent = u[k]; });
      }
    };

    window.autoResize = function(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; };

    window.handleKey = function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.sendMessage(); } };

    window.sendPrompt = function(text) { document.getElementById('userInput').value = text; window.sendMessage(); };

    function hideWelcome() { const w = document.getElementById('welcome'); if (w) w.remove(); }

    window.clearChat = function() {
      conversationHistory = [];
      document.getElementById('messages').innerHTML = `
        <div class="welcome" id="welcome">
          <div class="welcome-icon">🎓</div>
          <h2>Find Your <em>Ausbildung</em> in Germany</h2>
          <p>I can help you understand the German dual-education system, find apprenticeship programs, and guide you through the application process — no matter where you're from.</p>
          <div class="welcome-chips">
            <button class="welcome-chip" onclick="window.sendPrompt('What is Ausbildung and how does it work?')">🇩🇪 What is Ausbildung?</button>
            <button class="welcome-chip" onclick="window.sendPrompt('I am from outside the EU. Can I do Ausbildung in Germany?')">🌍 Can I apply from abroad?</button>
            <button class="welcome-chip" onclick="window.sendPrompt('Which Ausbildung requires the least German language level?')">🗣️ Language requirements</button>
            <button class="welcome-chip" onclick="window.sendPrompt('Show me the best websites to search for Ausbildung programs')">🔍 Where to search</button>
            <button class="welcome-chip" onclick="window.sendPrompt('Help me write a cover letter for Ausbildung application')">✍️ Write cover letter</button>
            <button class="welcome-chip" onclick="window.sendPrompt('What is the difference between Ausbildung and Studium?')">🎓 Ausbildung vs. Studium</button>
          </div>
        </div>`;
    };

    function markdownToHtml(text) {
      const lines = text.split('\n');
      let html = '';
      let inUl = false;
      let inOl = false;
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code style="background:rgba(79,142,247,0.12);border-radius:4px;padding:1px 5px;font-size:13px;">$1</code>')
          .replace(/\[(.*?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        if (/^### (.+)$/.test(line)) {
          if (inUl) { html += '</ul>'; inUl = false; }
          if (inOl) { html += '</ol>'; inOl = false; }
          html += `<strong style="font-size:15px;display:block;margin-top:10px;">${line.replace(/^### /, '')}</strong>`;
        } else if (/^## (.+)$/.test(line)) {
          if (inUl) { html += '</ul>'; inUl = false; }
          if (inOl) { html += '</ol>'; inOl = false; }
          html += `<strong style="font-size:16px;display:block;margin-top:12px;color:var(--accent2)">${line.replace(/^## /, '')}</strong>`;
        } else if (/^- (.+)$/.test(line)) {
          if (inOl) { html += '</ol>'; inOl = false; }
          if (!inUl) { html += '<ul>'; inUl = true; }
          html += `<li>${line.replace(/^- /, '')}</li>`;
        } else if (/^\d+\. (.+)$/.test(line)) {
          if (inUl) { html += '</ul>'; inUl = false; }
          if (!inOl) { html += '<ol>'; inOl = true; }
          html += `<li>${line.replace(/^\d+\. /, '')}</li>`;
        } else {
          if (inUl) { html += '</ul>'; inUl = false; }
          if (inOl) { html += '</ol>'; inOl = false; }
          if (line.trim()) html += `<p>${line}</p>`;
        }
      }
      if (inUl) html += '</ul>';
      if (inOl) html += '</ol>';
      return html;
    }

    window.sendMessage = async function() {
      const input = document.getElementById('userInput');
      const text = input.value.trim();
      if (!text) return;
      const btn = document.getElementById('sendBtn');
      btn.disabled = true;
      input.value = ''; input.style.height = 'auto';

      // Append user message
      hideWelcome();
      const container = document.getElementById('messages');
      const userDiv = document.createElement('div');
      userDiv.className = 'msg user';
      userDiv.innerHTML = `<div class="avatar user">👤</div><div class="bubble"><p>${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p></div>`;
      container.appendChild(userDiv);
      container.scrollTop = container.scrollHeight;

      let userContent = text;
      if (currentLang !== 'en') userContent += `\n\n[Please respond in ${langNames[currentLang]}]`;
      conversationHistory.push({ role: 'user', content: userContent });

      // Streaming bot bubble
      const botDiv = document.createElement('div');
      botDiv.className = 'msg bot';
      botDiv.innerHTML = '<div class="avatar bot">🎓</div><div class="bubble"><span class="stream-cursor">▋</span></div>';
      container.appendChild(botDiv);
      const bubble = botDiv.querySelector('.bubble');
      container.scrollTop = container.scrollHeight;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system: SYSTEM_PROMPT, messages: conversationHistory, stream: true })
        });

        if (!response.ok || !response.body) {
          let errMsg = 'Something went wrong. Please try again.';
          if (response.status === 429) errMsg = 'Too many requests — please wait a moment.';
          bubble.innerHTML = `<p>⚠️ ${errMsg}</p>`;
          conversationHistory.pop();
          btn.disabled = false; input.focus(); return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = ''; let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (!data || data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
                fullText += json.delta.text;
                bubble.innerHTML = markdownToHtml(fullText) + '<span class="stream-cursor">▋</span>';
                container.scrollTop = container.scrollHeight;
              }
            } catch {}
          }
        }

        if (!fullText) {
          const errData = (() => { try { return JSON.parse(buffer); } catch { return null; } })();
          fullText = errData?.error?.message || 'No response received.';
        }
        bubble.innerHTML = markdownToHtml(fullText);
        conversationHistory.push({ role: 'assistant', content: fullText });

        // Follow-up chips
        const lower = text.toLowerCase();
        let chips = [];
        if (lower.includes('visa') || lower.includes('foreigner') || lower.includes('abroad')) chips = ['What documents do I need?', 'How long does the visa take?', 'Can I work while applying?'];
        else if (lower.includes('find') || lower.includes('search') || lower.includes('program')) chips = ['Top sectors for foreigners', 'IT Ausbildung options', 'Healthcare Ausbildung'];
        else if (lower.includes('apply') || lower.includes('application') || lower.includes('letter')) chips = ['Write my cover letter', 'CV tips for Germany', 'Interview preparation'];
        else if (lower.includes('salary') || lower.includes('pay') || lower.includes('money')) chips = ['Best paid Ausbildung sectors', 'Benefits after completing', 'Tax info for trainees'];
        if (chips.length > 0) {
          const chipRow = document.createElement('div');
          chipRow.className = 'chips';
          chips.forEach(c => { const b = document.createElement('button'); b.className = 'chip'; b.textContent = c; b.onclick = () => window.sendPrompt(c); chipRow.appendChild(b); });
          bubble.appendChild(chipRow);
        }

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-msg-btn'; copyBtn.innerHTML = '📋 Copy';
        copyBtn.onclick = () => { navigator.clipboard.writeText(fullText); copyBtn.innerHTML = '✅ Copied'; setTimeout(() => copyBtn.innerHTML = '📋 Copy', 2000); };
        bubble.appendChild(copyBtn);

      } catch (err) {
        bubble.innerHTML = '<p>⚠️ Connection error. Please check your internet connection.</p>';
        conversationHistory.pop();
      } finally {
        btn.disabled = false; input.focus();
      }
    };

    // Apply saved lang
    const saved = typeof localStorage !== 'undefined' ? (localStorage.getItem('aig_lang') || 'en') : 'en';
    window.setChatLang(saved);

    // Listen for lang changes from Nav
    const onLangChange = (e) => { if (window.setChatLang) window.setChatLang(e.detail.lang); };
    window.addEventListener('aig:langchange', onLangChange);
    return () => window.removeEventListener('aig:langchange', onLangChange);
  }, []);

  const jsonLd = `{"@context":"https://schema.org","@type":"WebApplication","name":"Ausbildung AI Chatbot","url":"https://ausbildungingermany.org/chat","description":"Ask our free AI chatbot anything about Ausbildung in Germany in your language.","applicationCategory":"ChatApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"EUR"},"publisher":{"@type":"Organization","name":"AusbildungInGermany.org","url":"https://ausbildungingermany.org"}}`;

  const css = `
:root{--bg:#0d0f14;--surface:#14171f;--surface2:#1c2030;--border:#252a38;--accent:#4f8ef7;--accent2:#f7c04f;--text:#e8eaf0;--text-muted:#737a96;--user-bubble:#1a2540;--bot-bubble:#181d2a;--success:#4fc87a;--radius:16px;--font-display:'Syne',sans-serif;--font-body:'DM Sans',sans-serif;}
.chat-page-wrap{position:fixed;top:68px;left:0;right:0;bottom:0;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:15px;line-height:1.6;}
header.chat-header{display:flex;align-items:center;gap:14px;padding:16px 24px;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0;}
.logo-chat{width:42px;height:42px;background:linear-gradient(135deg,var(--accent),#7b5ef7);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.header-text h1{font-size:18px;font-weight:800;letter-spacing:-0.3px;line-height:1.1;}
.header-text h1 span{color:var(--accent);}
.header-text p{font-size:12px;color:var(--text-muted);margin-top:1px;}
.status-pill{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;color:var(--success);background:rgba(79,200,122,0.1);border:1px solid rgba(79,200,122,0.2);border-radius:20px;padding:4px 12px;flex-shrink:0;}
.status-dot{width:6px;height:6px;border-radius:50%;background:var(--success);animation:pulse 2s ease infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.chat-wrapper{display:flex;flex:1;overflow:hidden;min-height:0;}
.sidebar{width:220px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:20px 16px;gap:6px;flex-shrink:0;overflow-y:auto;}
.sidebar-label{font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;padding-left:4px;}
.topic-btn{background:none;border:1px solid transparent;border-radius:10px;color:var(--text-muted);font-family:var(--font-body);font-size:13px;padding:9px 12px;text-align:left;cursor:pointer;transition:all 0.15s ease;display:flex;align-items:center;gap:8px;}
.topic-btn:hover{background:var(--surface2);color:var(--text);border-color:var(--border);}
.sidebar-divider{height:1px;background:var(--border);margin:10px 0;}
.lang-section{margin-top:auto;}
.lang-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;}
.lang-btn{background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text-muted);font-family:var(--font-body);font-size:12px;padding:6px 8px;cursor:pointer;transition:all 0.15s;text-align:center;}
.lang-btn:hover,.lang-btn.active{background:var(--accent);color:#fff;border-color:var(--accent);}
.chat-container{flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0;}
#messages{flex:1;overflow-y:auto;padding:24px 28px;display:flex;flex-direction:column;gap:20px;scroll-behavior:smooth;min-height:0;}
#messages::-webkit-scrollbar{width:4px;}
#messages::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
.msg{display:flex;gap:12px;max-width:720px;animation:fadeUp 0.3s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.msg.user{align-self:flex-end;flex-direction:row-reverse;}
.avatar{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;margin-top:2px;}
.avatar.bot{background:linear-gradient(135deg,var(--accent),#7b5ef7);}
.avatar.user{background:var(--surface2);border:1px solid var(--border);}
.bubble{padding:13px 17px;border-radius:var(--radius);line-height:1.65;font-size:14.5px;max-width:580px;}
.msg.bot .bubble{background:var(--bot-bubble);border:1px solid var(--border);border-top-left-radius:4px;}
.msg.user .bubble{background:var(--user-bubble);border:1px solid rgba(79,142,247,0.2);border-top-right-radius:4px;color:var(--text);}
.bubble p{margin-bottom:8px;}
.bubble p:last-child{margin-bottom:0;}
.bubble ul,.bubble ol{padding-left:20px;margin:8px 0;}
.bubble li{margin-bottom:4px;}
.bubble strong{color:var(--accent2);font-weight:600;}
.bubble a{color:var(--accent);text-decoration:none;border-bottom:1px dashed rgba(79,142,247,0.4);}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
.chip{background:var(--surface2);border:1px solid var(--border);border-radius:20px;color:var(--text);font-family:var(--font-body);font-size:12.5px;padding:6px 14px;cursor:pointer;transition:all 0.15s;}
.chip:hover{background:var(--accent);border-color:var(--accent);color:#fff;}
.input-area{padding:16px 28px 20px;background:var(--surface);border-top:1px solid var(--border);flex-shrink:0;}
.input-row{display:flex;align-items:flex-end;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;transition:border-color 0.2s;}
.input-row:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(79,142,247,0.08);}
#userInput{flex:1;background:none;border:none;color:var(--text);font-family:var(--font-body);font-size:14.5px;line-height:1.5;resize:none;max-height:120px;outline:none;}
#userInput::placeholder{color:var(--text-muted);}
.send-btn{width:38px;height:38px;border-radius:10px;background:var(--accent);border:none;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;flex-shrink:0;}
.send-btn:hover{background:#6aa0f9;transform:scale(1.05);}
.send-btn:disabled{background:var(--border);cursor:not-allowed;transform:none;}
.input-hint{font-size:11.5px;color:var(--text-muted);margin-top:8px;text-align:center;}
.welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;flex:1;padding:40px 24px;gap:16px;}
.welcome-icon{font-size:52px;margin-bottom:4px;}
.welcome h2{font-size:26px;font-weight:800;letter-spacing:-0.5px;}
.welcome h2 em{font-style:normal;color:var(--accent);}
.welcome p{color:var(--text-muted);font-size:14px;max-width:420px;line-height:1.7;}
.welcome-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:10px;max-width:560px;}
.welcome-chip{background:var(--surface2);border:1px solid var(--border);border-radius:22px;color:var(--text);font-family:var(--font-body);font-size:13px;padding:9px 18px;cursor:pointer;transition:all 0.15s;}
.welcome-chip:hover{background:var(--accent);border-color:var(--accent);color:#fff;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.stream-cursor{display:inline-block;animation:blink 1s ease infinite;color:var(--accent);font-weight:bold;margin-left:1px;}
.copy-msg-btn{display:inline-flex;align-items:center;gap:4px;margin-top:8px;background:none;border:1px solid rgba(255,255,255,0.08);border-radius:6px;color:var(--text-muted);font-family:var(--font-body);font-size:11px;padding:3px 8px;cursor:pointer;transition:all 0.15s;}
.copy-msg-btn:hover{background:var(--surface2);color:var(--text);}
.clear-btn{background:none;border:1px solid var(--border);border-radius:8px;color:var(--text-muted);font-family:var(--font-body);font-size:12px;padding:5px 12px;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:5px;white-space:nowrap;}
.clear-btn:hover{border-color:#ff4757;color:#ff4757;}
@media(max-width:640px){.sidebar{display:none;}#messages{padding:16px;}.input-area{padding:12px 16px 16px;}}
`;

  return (
    <>
      <Head>
        <title>AI Chatbot – Ask Anything About Ausbildung in Germany</title>
        <meta name="description" content="Ask our free AI chatbot anything about Ausbildung in Germany in your language. Get instant expert answers 24/7." />
        <meta property="og:title" content="AI Chatbot – Ask Anything About Ausbildung in Germany" />
        <meta property="og:description" content="Ask our free AI chatbot anything about Ausbildung in Germany in your language." />
        <meta property="og:url" content="https://ausbildungingermany.org/chat" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ausbildungingermany.org/icon-512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://ausbildungingermany.org/chat" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </Head>
      <Nav />

      <div className="chat-page-wrap">
        {/* Sub-header */}
        <div style={{background:'var(--surface)',borderBottom:'1px solid var(--border)',padding:'10px 20px',display:'flex',alignItems:'center',gap:'12px',position:'sticky',top:'68px',zIndex:99}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:'7px',background:'var(--surface2)',border:'1.5px solid var(--border)',borderRadius:'10px',color:'var(--text-muted)',fontSize:'13px',fontWeight:600,padding:'7px 16px',textDecoration:'none',transition:'all .15s'}}>← Home</a>
          <a href="/jobs" style={{display:'flex',alignItems:'center',gap:'6px',background:'var(--surface2)',border:'1.5px solid var(--border)',borderRadius:'10px',color:'var(--text-muted)',fontSize:'13px',fontWeight:500,padding:'7px 14px',textDecoration:'none',transition:'all .15s'}}>🔍 Jobs</a>
          <a href="/eligibility" style={{display:'flex',alignItems:'center',gap:'6px',background:'var(--surface2)',border:'1.5px solid var(--border)',borderRadius:'10px',color:'var(--text-muted)',fontSize:'13px',fontWeight:500,padding:'7px 14px',textDecoration:'none',transition:'all .15s'}}>🎯 Eligibility</a>
          <a href="/generator" style={{display:'flex',alignItems:'center',gap:'6px',background:'var(--surface2)',border:'1.5px solid var(--border)',borderRadius:'10px',color:'var(--text-muted)',fontSize:'13px',fontWeight:500,padding:'7px 14px',textDecoration:'none',transition:'all .15s'}}>📄 Generator</a>
          <span style={{fontSize:'13px',color:'var(--text-muted)',marginLeft:'4px'}}>🤖 AI Chatbot</span>
          <button className="clear-btn" onClick={() => window.clearChat && window.clearChat()} style={{marginLeft:'auto'}}>🗑️ New Chat</button>
        </div>

        <div className="chat-wrapper">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-label">Quick Topics</div>
            <button className="topic-btn" data-i="1" onClick={() => window.sendPrompt && window.sendPrompt('What is Ausbildung and how does it work?')}>🇩🇪 What is Ausbildung?</button>
            <button className="topic-btn" data-i="2" onClick={() => window.sendPrompt && window.sendPrompt('How do I find Ausbildung programs in Germany?')}>🔍 Find Programs</button>
            <button className="topic-btn" data-i="3" onClick={() => window.sendPrompt && window.sendPrompt('How do I apply for Ausbildung as a foreigner?')}>📝 How to Apply</button>
            <button className="topic-btn" data-i="4" onClick={() => window.sendPrompt && window.sendPrompt('What visa do I need for Ausbildung in Germany?')}>✈️ Visa &amp; Documents</button>
            <button className="topic-btn" data-i="5" onClick={() => window.sendPrompt && window.sendPrompt('What salary can I expect during Ausbildung?')}>💰 Salary &amp; Benefits</button>
            <button className="topic-btn" data-i="6" onClick={() => window.sendPrompt && window.sendPrompt('Which sectors have the most Ausbildung openings in Germany?')}>🏭 Top Sectors</button>
            <button className="topic-btn" data-i="7" onClick={() => window.sendPrompt && window.sendPrompt('What German language level do I need for Ausbildung?')}>🗣️ German Requirements</button>
            <button className="topic-btn" data-i="8" onClick={() => window.sendPrompt && window.sendPrompt('What happens after completing Ausbildung?')}>🚀 Career After</button>
            <div className="sidebar-divider"></div>
            <div className="sidebar-label">Tools</div>
            <a href="/jobs" className="topic-btn" style={{textDecoration:'none',background:'linear-gradient(135deg,rgba(79,200,122,0.15),rgba(79,142,247,0.15))',border:'1px solid rgba(79,200,122,0.3)'}}>🔍 Job Finder</a>
            <a href="/embassy" className="topic-btn" style={{textDecoration:'none',background:'linear-gradient(135deg,rgba(247,192,79,0.15),rgba(79,142,247,0.15))',border:'1px solid rgba(247,192,79,0.3)'}}>🗺️ Embassy Finder</a>
            <a href="/checklist" className="topic-btn" style={{textDecoration:'none',background:'linear-gradient(135deg,rgba(79,200,122,0.15),rgba(123,95,247,0.15))',border:'1px solid rgba(79,200,122,0.3)'}}>📋 Document Checklist</a>
            <a href="/generator" className="topic-btn" style={{textDecoration:'none',background:'linear-gradient(135deg,rgba(79,142,247,0.15),rgba(123,95,247,0.15))',border:'1px solid rgba(79,142,247,0.3)'}}>📄 Document Generator</a>
            <div className="sidebar-divider"></div>
            <div className="lang-section">
              <div className="sidebar-label">Language</div>
              <div className="lang-grid">
                <button className="lang-btn active" id="lang-en" onClick={() => window.setChatLang && window.setChatLang('en')}>🇬🇧 EN</button>
                <button className="lang-btn" id="lang-de" onClick={() => window.setChatLang && window.setChatLang('de')}>🇩🇪 DE</button>
                <button className="lang-btn" id="lang-ar" onClick={() => window.setChatLang && window.setChatLang('ar')}>🇸🇦 AR</button>
                <button className="lang-btn" id="lang-tr" onClick={() => window.setChatLang && window.setChatLang('tr')}>🇹🇷 TR</button>
                <button className="lang-btn" id="lang-fr" onClick={() => window.setChatLang && window.setChatLang('fr')}>🇫🇷 FR</button>
                <button className="lang-btn" id="lang-es" onClick={() => window.setChatLang && window.setChatLang('es')}>🇪🇸 ES</button>
                <button className="lang-btn" id="lang-hi" onClick={() => window.setChatLang && window.setChatLang('hi')}>🇮🇳 HI</button>
                <button className="lang-btn" id="lang-ur" onClick={() => window.setChatLang && window.setChatLang('ur')}>🇵🇰 UR</button>
                <button className="lang-btn" id="lang-bn" onClick={() => window.setChatLang && window.setChatLang('bn')}>🇧🇩 BN</button>
                <button className="lang-btn" id="lang-sw" onClick={() => window.setChatLang && window.setChatLang('sw')}>🌍 SW</button>
                <button className="lang-btn" id="lang-tl" onClick={() => window.setChatLang && window.setChatLang('tl')}>🇵🇭 TL</button>
              </div>
            </div>
          </aside>

          {/* Chat */}
          <div className="chat-container">
            <div id="messages">
              <div className="welcome" id="welcome">
                <div className="welcome-icon">🎓</div>
                <h2>Find Your <em>Ausbildung</em> in Germany</h2>
                <p>I can help you understand the German dual-education system, find apprenticeship programs, and guide you through the application process — no matter where you&apos;re from.</p>
                <div className="welcome-chips">
                  <button className="welcome-chip" onClick={() => window.sendPrompt && window.sendPrompt('What is Ausbildung and how does it work?')}>🇩🇪 What is Ausbildung?</button>
                  <button className="welcome-chip" onClick={() => window.sendPrompt && window.sendPrompt('I am from outside the EU. Can I do Ausbildung in Germany?')}>🌍 Can I apply from abroad?</button>
                  <button className="welcome-chip" onClick={() => window.sendPrompt && window.sendPrompt('Which Ausbildung requires the least German language level?')}>🗣️ Language requirements</button>
                  <button className="welcome-chip" onClick={() => window.sendPrompt && window.sendPrompt('Show me the best websites to search for Ausbildung programs')}>🔍 Where to search</button>
                  <button className="welcome-chip" onClick={() => window.sendPrompt && window.sendPrompt('Help me write a cover letter for Ausbildung application')}>✍️ Write cover letter</button>
                  <button className="welcome-chip" onClick={() => window.sendPrompt && window.sendPrompt('What is the difference between Ausbildung and Studium?')}>🎓 Ausbildung vs. Studium</button>
                </div>
              </div>
            </div>

            <div className="input-area">
              <div className="input-row">
                <textarea id="userInput" rows={1} placeholder="Ask me anything about Ausbildung in Germany…" onKeyDown={e => window.handleKey && window.handleKey(e.nativeEvent)} onInput={e => window.autoResize && window.autoResize(e.target)}></textarea>
                <button className="send-btn" id="sendBtn" onClick={() => window.sendMessage && window.sendMessage()} title="Send">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
              <div className="input-hint">AusbildungBot can make mistakes — always verify important info with official sources.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
