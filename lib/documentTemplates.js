// Professional German document templates for Ausbildung applications
// No AI required - pure template system

export function generateLebenslauf(data) {
  const {
    firstName = '',
    lastName = '',
    gender = '',
    dob = '',
    nationality = '',
    email = '',
    phone = '',
    address = '',
    eduLevel = '',
    schoolName = '',
    gradYear = '',
    fieldOfStudy = '',
    workExp = '',
    skills = '',
    germanLevel = '',
    otherLangs = '',
    ausbildungTarget = '',
    companyName = ''
  } = data;

  const fullName = `${firstName} ${lastName}`.trim();
  const genderText = gender === 'male' ? 'Männlich' : gender === 'female' ? 'Weiblich' : gender === 'diverse' ? 'Divers' : '';

  return `[BEWERBUNGSFOTO]
(Bitte hier ein professionelles Passfoto einfügen)


LEBENSLAUF

${fullName}


PERSÖNLICHE DATEN

${genderText ? `Geschlecht:\t\t${genderText}\n` : ''}${dob ? `Geburtsdatum:\t\t${dob}\n` : ''}${nationality ? `Nationalität:\t\t${nationality}\n` : ''}${address ? `Anschrift:\t\t${address}\n` : ''}${phone ? `Telefon:\t\t${phone}\n` : ''}${email ? `E-Mail:\t\t\t${email}\n` : ''}

SCHULBILDUNG

${gradYear || 'aktuell'}\t\t${eduLevel || 'Schulabschluss'}
\t\t\t${schoolName || ''}${fieldOfStudy ? `\n\t\t\tFachrichtung: ${fieldOfStudy}` : ''}

${workExp && workExp.toLowerCase() !== 'keine' && workExp.toLowerCase() !== 'no experience' && workExp.toLowerCase() !== 'no experience yet' ? `
BERUFSERFAHRUNG

${workExp}
` : ''}
KENNTNISSE UND FÄHIGKEITEN

${skills || 'Grundlegende Computer-Kenntnisse, Teamfähigkeit, Zuverlässigkeit'}


SPRACHKENNTNISSE

Deutsch:\t\t${germanLevel || 'Grundkenntnisse'}${otherLangs && otherLangs.toLowerCase() !== 'keine' && otherLangs.toLowerCase() !== 'none' ? `\n${otherLangs}` : ''}
${nationality && !otherLangs.includes(nationality.split(',')[0]) ? `\nMuttersprache:\t\t${nationality.split(',')[0].trim()}` : ''}


${ausbildungTarget ? `BERUFSZIEL

Ausbildung als ${ausbildungTarget}${companyName ? ` bei ${companyName}` : ''}
` : ''}


Ort, Datum\t\t\t\t\t\t\tUnterschrift


__________________\t\t\t\t\t\t____________________`;
}

export function generateBewerbungsschreiben(data) {
  const {
    firstName = '',
    lastName = '',
    address = '',
    email = '',
    phone = '',
    companyName = 'Sehr geehrte Damen und Herren',
    ausbildungTarget = 'die ausgeschriebene Ausbildungsstelle',
    motivation = '',
    germanLevel = '',
    skills = '',
    eduLevel = '',
    nationality = '',
    workExp = ''
  } = data;

  const fullName = `${firstName} ${lastName}`.trim();
  const today = new Date();
  const dateStr = today.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Generate personalized opening based on motivation
  let opening = `mit diesem Schreiben bewerbe ich mich bei Ihnen um einen Ausbildungsplatz als ${ausbildungTarget}.`;

  // Main body paragraphs
  let body1 = '';
  if (eduLevel) {
    body1 = `Zurzeit ${eduLevel.includes('Abitur') || eduLevel.includes('Studium') ? 'habe ich' : 'verfüge ich über'} ${eduLevel}${schoolName ? ` an ${schoolName}` : ''}. `;
  }

  if (germanLevel && (germanLevel.includes('B') || germanLevel.includes('C'))) {
    body1 += `Meine Deutschkenntnisse liegen auf dem Niveau ${germanLevel}, was mir ermöglicht, dem theoretischen Unterricht problemlos zu folgen und mich aktiv im Betrieb einzubringen. `;
  } else if (germanLevel) {
    body1 += `Derzeit lerne ich Deutsch und habe das Niveau ${germanLevel} erreicht. Ich arbeite kontinuierlich daran, meine Sprachkenntnisse zu verbessern. `;
  }

  let body2 = '';
  if (motivation && motivation.trim()) {
    body2 = motivation.trim();
    if (!body2.endsWith('.') && !body2.endsWith('!')) {
      body2 += '.';
    }
    body2 += ' ';
  } else {
    body2 = `Die Ausbildung als ${ausbildungTarget} interessiert mich besonders, weil ich in diesem Bereich meine berufliche Zukunft sehe. Ich bringe die Motivation und Lernbereitschaft mit, die für eine erfolgreiche Ausbildung notwendig sind. `;
  }

  if (skills) {
    body2 += `Zu meinen Stärken zählen ${skills.toLowerCase()}.`;
  }

  let body3 = '';
  if (workExp && workExp.toLowerCase() !== 'keine' && workExp.toLowerCase() !== 'no experience' && workExp.toLowerCase() !== 'no experience yet') {
    body3 = `\n\nDurch meine bisherigen Erfahrungen – ${workExp} – konnte ich bereits praktische Einblicke in die Arbeitswelt gewinnen. Diese Erfahrungen motivieren mich, den nächsten Schritt mit einer qualifizierten Ausbildung zu gehen.`;
  }

  const closing = `Über die Einladung zu einem persönlichen Vorstellungsgespräch würde ich mich sehr freuen. Gerne überzeuge ich Sie von meiner Motivation und Eignung für diese Ausbildung.`;

  return `${fullName}
${address || '[Ihre Adresse]'}
${email || '[E-Mail]'}${phone ? ` | ${phone}` : ''}


${companyName !== 'Sehr geehrte Damen und Herren' ? companyName : '[Name des Unternehmens]'}
${companyName !== 'Sehr geehrte Damen und Herren' ? '[Adresse des Unternehmens]' : '[Personalabteilung]\n[Anschrift]'}


${dateStr}


Bewerbung um einen Ausbildungsplatz als ${ausbildungTarget}


${companyName === 'Sehr geehrte Damen und Herren' ? 'Sehr geehrte Damen und Herren,' : `Sehr geehrte Damen und Herren,`}

${opening}

${body1}

${body2}${body3}

${closing}


Mit freundlichen Grüßen



____________________
${fullName}


Anlagen:
- Lebenslauf
- Schulzeugnisse
- Sprachzertifikat (Deutsch ${germanLevel || 'A2/B1'})
- ggf. Praktikumsnachweise`;
}

export function generateInterviewPrep(data) {
  const { ausbildungTarget = '', companyName = '', germanLevel = '', motivation = '' } = data;

  return `INTERVIEW-VORBEREITUNG
Ausbildung als ${ausbildungTarget}${companyName ? ` bei ${companyName}` : ''}

═══════════════════════════════════════════════════════════

HÄUFIGE FRAGEN UND MUSTERANTWORTEN

1. "Erzählen Sie uns etwas über sich."

Musterantwort:
"Mein Name ist [Name], ich bin [Alter] Jahre alt und komme aus [Land]. Zurzeit [Ihre aktuelle Situation - Schule/Studium/Arbeit]. Ich interessiere mich sehr für [Bereich] und möchte deshalb diese Ausbildung beginnen. In meiner Freizeit [1-2 Hobbys] und ich lerne kontinuierlich Deutsch, um mich gut zu integrieren."

2. "Warum möchten Sie diese Ausbildung machen?"

Musterantwort:
"Ich interessiere mich sehr für ${ausbildungTarget}, weil [konkreter Grund - z.B. 'ich gerne mit Menschen arbeite' / 'ich technisch interessiert bin' / 'ich praktisch arbeiten möchte']. Die duale Ausbildung in Deutschland kombiniert Theorie und Praxis auf ideale Weise. ${motivation ? motivation : 'Ich möchte in diesem Bereich Fachkraft werden und langfristig in Deutschland arbeiten.'}"

3. "Warum haben Sie sich bei unserem Unternehmen beworben?"

Musterantwort:
"Ihr Unternehmen hat einen sehr guten Ruf in der Branche${companyName ? `, und ich habe mich über ${companyName} informiert` : ''}. Mir gefällt [etwas Spezifisches über das Unternehmen - Größe, Produkte, Ausbildungsprogramm]. Ich glaube, dass ich hier sehr viel lernen kann und gute Entwicklungsmöglichkeiten habe."

4. "Wie gut sprechen Sie Deutsch?"

Musterantwort:
"Ich habe das Niveau ${germanLevel || 'B1'} erreicht und kann mich im Alltag gut verständigen. Im Unterricht der Berufsschule werde ich alles verstehen können, und im Betrieb kann ich Anweisungen folgen und mit Kollegen kommunizieren. Ich lerne weiter Deutsch und möchte mich ständig verbessern."

5. "Was sind Ihre Stärken?"

Musterantwort:
"Ich bin sehr zuverlässig und pünktlich. Wenn ich eine Aufgabe bekomme, erledige ich sie sorgfältig. Ich kann gut im Team arbeiten und bin auch bereit, Überstunden zu machen, wenn es nötig ist. Außerdem lerne ich gerne Neues und bin motiviert, mich in neue Themen einzuarbeiten."

6. "Was sind Ihre Schwächen?"

Musterantwort:
"Manchmal möchte ich Aufgaben zu perfekt machen und brauche dadurch länger. Ich arbeite daran, effizienter zu werden. Außerdem ist Deutsch nicht meine Muttersprache, aber ich lerne fleißig und meine Sprachkenntnisse werden jeden Tag besser."

7. "Wo sehen Sie sich in 5 Jahren?"

Musterantwort:
"Nach der Ausbildung möchte ich als Fachkraft in meinem Beruf arbeiten. Ich plane, in Deutschland zu bleiben und mich weiterzuentwickeln. Vielleicht mache ich später noch eine Weiterbildung zum Meister oder Techniker. Langfristig möchte ich ein wertvolles Teammitglied sein."

8. "Haben Sie Fragen an uns?"

GUTE FRAGEN ZUM STELLEN:
✓ "Wie ist die Ausbildung strukturiert? Wie oft bin ich im Betrieb und in der Berufsschule?"
✓ "Welche Abteilungen lerne ich während der Ausbildung kennen?"
✓ "Gibt es Weiterbildungsmöglichkeiten nach der Ausbildung?"
✓ "Wie groß ist das Ausbildungsteam? Wie viele Azubis gibt es?"
✓ "Wann kann ich mit einer Rückmeldung rechnen?"

SCHLECHTE FRAGEN:
✗ "Wie viel Urlaub habe ich?"
✗ "Wie viele Überstunden muss ich machen?"
✗ Fragen, die auf der Website stehen

═══════════════════════════════════════════════════════════

WICHTIGE TIPPS

VOR DEM INTERVIEW:
• Informieren Sie sich über das Unternehmen (Website, Produkte)
• Üben Sie die Antworten laut auf Deutsch
• Bereiten Sie Fragen vor
• Planen Sie die Anreise (15 Minuten früher ankommen)
• Kleidung: Ordentlich und sauber, nicht zu casual

WÄHREND DES INTERVIEWS:
• Pünktlich sein (lieber 10 Minuten zu früh)
• Höflich grüßen und Händedruck (nicht zu fest, nicht zu weich)
• Blickkontakt halten
• Deutlich und nicht zu schnell sprechen
• Bei Verständnisproblemen: "Entschuldigung, können Sie das bitte wiederholen?"
• Handy ausschalten!

KÖRPERSPRACHE:
✓ Aufrecht sitzen
✓ Hände auf dem Tisch oder Schoß
✓ Lächeln
✗ Nicht mit Stift spielen
✗ Nicht über den Tisch lehnen
✗ Nicht Arme verschränken

NACH DEM INTERVIEW:
• Danken Sie für das Gespräch
• Fragen Sie nach dem weiteren Ablauf
• Schicken Sie ggf. eine kurze Dankes-E-Mail (optional, aber positiv)

═══════════════════════════════════════════════════════════

WICHTIGE DEUTSCHE SÄTZE

"Guten Tag, mein Name ist [Name]. Ich habe einen Termin um [Uhrzeit]."
"Es freut mich, Sie kennenzulernen."
"Danke für die Einladung zum Vorstellungsgespräch."
"Das ist eine interessante Frage. Darf ich kurz nachdenken?"
"Entschuldigung, ich habe das nicht ganz verstanden. Können Sie das bitte wiederholen?"
"Vielen Dank für das Gespräch. Ich freue mich auf Ihre Rückmeldung."

VIEL ERFOLG! 🍀`;
}
