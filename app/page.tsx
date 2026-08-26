'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';

type Lens = 'stimmen' | 'zeit' | 'ethik' | 'negation';
type Part = { id: string; title: string; voice: string; time: string; anchor: string; claim: string; moves: string[]; tests: string[] };

const parts: Part[] = [
  {
    id: 'I', title: 'Beschädigte Gegenwart', voice: 'ICH', time: 'Jetzt', anchor: '„Wirklich, ich lebe in finsteren Zeiten!“',
    claim: 'Der Sprecher misst den Alltag an moralischen Ansprüchen und findet keinen unschuldigen Ort: Sprechen, Essen, Glück und Weisheit geraten in Widerspruch zur Not der anderen.',
    moves: ['Zeitdiagnose statt bloßer Stimmung', 'Die Bäume-Frage: Kunst und politisches Schweigen', 'Privileg als Zufall, nicht Verdienst', 'Essen als Verstrickung', 'Unmöglichkeit der alten Weisheit'],
    tests: ['Warum steht „wirklich“ am Anfang und am Ende?', 'Wo spricht der Text als Behauptung, wo als Frage?', 'Entlastet das Eingeständnis der Verstrickung den Sprecher?'],
  },
  {
    id: 'II', title: 'Bilanz einer Generation', voice: 'WIR', time: 'Lebenszeit', anchor: '„So verging meine Zeit“',
    claim: 'Der Blick weitet sich vom einzelnen Gewissen zur historischen Generation. Wiederholung und Nüchternheit verhindern die Pose des siegreichen Widerstandskämpfers.',
    moves: ['Stadt und Unordnung als Erfahrungsraum', 'Nähe zu Herrschenden ohne Zugehörigkeit', 'Klassenkampf als historische Praxis', 'Begrenzte Kräfte und entferntes Ziel'],
    tests: ['Wer darf im „wir“ mitsprechen – und wer fehlt?', 'Was leistet der Refrain außer Zusammenfassung?', 'Ist „geringe Kraft“ Diagnose, Bescheidenheit oder Selbstverteidigung?'],
  },
  {
    id: 'III', title: 'Gericht der Zukunft', voice: 'IHR', time: 'Danach', anchor: '„Ihr, die ihr auftauchen werdet“',
    claim: 'Die Zukunft wird angerufen, aber nicht garantiert. Die Nachgeborenen sollen die Härte der Handelnden historisch verstehen, ohne dass das Gedicht ihnen das Urteil abnimmt.',
    moves: ['Apostrophe: Abwesende werden Adressaten', 'Übergang über die gesellschaftliche Flut', 'Zorn als notwendige und beschädigende Kraft', 'Bitte um Nachsicht statt Anspruch auf Ruhm'],
    tests: ['Ist Nachsicht etwas anderes als Freispruch?', 'Warum entwirft der Text Helfen als Zukunftskriterium?', 'Spricht das Gedicht zu uns – oder durch uns hindurch?'],
  },
];

const context = [
  ['1898', 'Geboren in Augsburg. Brecht erlebt Kaiserreich, Weltkrieg und Revolution als frühe politische Erfahrungsräume.'],
  ['1933', 'Nach der nationalsozialistischen Machtübernahme beginnt das Exil. Der Schriftsteller verliert Ort, Publikum und institutionelle Sicherheit.'],
  ['1934–38', 'Entstehungszeit des Gedichts. Brecht lebt überwiegend im dänischen Exil bei Svendborg und arbeitet an den Svendborger Gedichten.'],
  ['1939', 'Veröffentlichung im Exil. Das Gedicht steht am Ende der Svendborger Gedichte und wirkt dort wie Bilanz und Sendung zugleich.'],
  ['1956', 'Brecht stirbt in Berlin. Seine politische Lyrik bleibt umstritten: Lehrgedicht, Gebrauchskunst, Propaganda – oder Schule dialektischen Denkens?'],
];

const formTools = [
  ['Freie Rhythmen', 'Kein regelmäßiges Versmaß beruhigt die Rede. Der Text klingt argumentierend, stockend, berichtend.'],
  ['Wiederholung', 'Leitmotive und Refrains machen Erfahrung erinnerbar, ohne sie harmonisch abzuschließen.'],
  ['Parataxe', 'Kurze, nebeneinandergestellte Sätze erzeugen den Ton eines Protokolls und lassen Widersprüche sichtbar stehen.'],
  ['Frage', 'Rhetorische Fragen organisieren keine Wissensabfrage, sondern ziehen den Leser in ein moralisches Problem hinein.'],
  ['Pronomenwechsel', 'Ich → wir → ihr verschiebt Reichweite, Verantwortung und Urteilsmacht.'],
  ['Zeitdeixis', 'Gegenwart, vergehende Lebenszeit und vorgestellte Zukunft sind nicht Kulisse, sondern Bauplan.'],
];

const tensions = [
  ['Überleben', 'Verstrickung', 'Der Sprecher lebt weiter und weiß, dass sein Weiterleben nicht gerecht verteilt ist.'],
  ['Weisheit', 'Eingreifen', 'Traditionelle Gelassenheit wird unter Gewaltbedingungen als unzureichend verworfen.'],
  ['Zorn', 'Freundlichkeit', 'Widerstand braucht Härte; dieselbe Härte beschädigt die Fähigkeit zu einer anderen Gesellschaft.'],
  ['Zeugnis', 'Selbstentlastung', 'Das Gedicht bekennt Begrenzung – aber entscheidet nicht selbst, ob das Bekenntnis genügt.'],
  ['Hoffnung', 'Ungewissheit', 'Die bessere Zukunft ist grammatisch adressierbar, historisch aber keineswegs gesichert.'],
];

const counterReadings = [
  ['Die Bitte um Nachsicht ist Selbstentlastung.', 'Dafür spricht: Der Sprecher rahmt sein Scheitern durch widrige Umstände. Dagegen spricht: Er fordert keinen Freispruch, sondern übergibt das Urteil an andere.'],
  ['Das „wir“ macht Unterschiede unsichtbar.', 'Dafür spricht: Eine Generation wird kollektiviert. Dagegen spricht: Das Wir ist weniger soziologische Vollständigkeit als eine strategische Zeugenposition.'],
  ['Der Text glaubt zu sicher an Fortschritt.', 'Dafür spricht: Die Nachgeborenen werden sprachlich vorausgesetzt. Dagegen spricht: Ihr Auftauchen bleibt Bedingung und Anrufung, nicht Prognose.'],
  ['Die berühmte Bäume-Stelle verbietet unpolitische Kunst.', 'Zu grob: Sie markiert die Schuldlosigkeit von Naturrede als historisch problematisch. Das Gedicht selbst bleibt Kunst und arbeitet mit Bildern – es schafft Ästhetik nicht ab.'],
];

const researchViews = [
  {
    scholar: 'H. R. Hays', field: 'Mehrdeutigkeit des Sprecher-Ichs',
    quote: '“a mixture of role-playing and soul baring, of fact and fantasy, of self-revelation and self-concealment”',
    source: 'The Poetry of Brecht, S. 112', href: 'https://library.oapen.org/bitstream/handle/20.500.12657/39857/9781469656854_WEB.pdf?isAllowed=y&sequence=1',
    use: 'Das Ich ist weder schlicht Brecht selbst noch eine bloße Kunstfigur. Prüfe bei jedem autobiografisch klingenden Satz, wie er sich zugleich öffentlich inszeniert.',
  },
  {
    scholar: 'Jan Knopf', field: 'Poetologische Bäume-Stelle',
    quote: '„vielfältig zitierten, oft aber mißverstandenen Zeilen“',
    source: 'Brecht-Handbuch, 1984; Zitat S. 113', href: 'https://sbc.org.pl/Content/499046/PDF/wortfolge_2017_01.pdf',
    use: 'Knopfs Warnung schützt vor der Kurzformel „Naturlyrik ist verboten“. Das „fast“ und das Problem des eingeschlossenen Schweigens müssen mitgelesen werden.',
  },
  {
    scholar: 'Elizabeth Boa', field: 'Poetische Autorität und Ohnmacht',
    quote: '“Assuaging the anxiety of impotence”',
    source: 'Brecht’s Poetry of Political Exile, Kap. 9, S. 153–171', href: 'https://assets.cambridge.org/97805211/54437/frontmatter/9780521154437_frontmatter.pdf',
    use: 'Schon der Kapitelbegriff öffnet eine produktive Frage: Gewinnt der politisch machtlose Dichter durch die Zukunftsadresse symbolische Autorität – und beruhigt er damit auch seine eigene Ohnmacht?',
  },
  {
    scholar: 'Karen Leeder', field: 'Rezeption und Nachleben',
    quote: '“Those born later read Brecht”',
    source: 'Brecht’s Poetry of Political Exile, Kap. 12, S. 211–240', href: 'https://www.mod-langs.ox.ac.uk/people/karen-leeder',
    use: 'Leeders Rezeptionsperspektive verschiebt die Frage: Nicht nur was das Gedicht 1939 bedeutete, sondern wie spätere Dichter ihre eigene Gegenwart an ihm prüfen, gehört zu seiner literarischen Wirkung.',
  },
];

const seminarSessions = [
  {
    date: '28.04.', title: 'Politische Lyrik I · Theorie',
    recap: 'Die Sitzung fragt nicht nach einer einzigen Form politischer Lyrik. Arbeitsfähig ist Dieter Lampings Minimaldefinition: Politisch wird Lyrik durch ihren Gegenstand oder durch ihre Perspektive. Zugleich steht sie unter besonderem Kommunikationsdruck – sie will in eine geteilte Wirklichkeit eingreifen.',
    brecht: 'Brechts Gedicht ist nicht nur wegen Nationalsozialismus, Exil und Klassenkampf politisch. Seine Perspektivwechsel bauen ein Verhältnis zwischen Individuum, Kollektiv und historischer Öffentlichkeit.',
    task: 'Markiere eine Stelle, deren Gegenstand nicht ausdrücklich politisch ist, deren Perspektive sie aber politisch macht.',
  },
  {
    date: '05.05.', title: 'Politische Lyrik II · Songs',
    recap: 'Songtexte können lyrisch gelesen werden, funktionieren aber im Medienverbund von Stimme, Musik, Aufführung und Publikum. Interpretation bleibt begründet plural; politische Bildung muss zugleich Wirkung, Instrumentalisierung und die eigene Position mitreflektieren.',
    brecht: 'Das Gedicht wurde vertont und ist als Autorenlesung überliefert. Lautstärke, Pausen und Tonfall verändern, ob die Rede wie Anklage, Bilanz oder Bitte wirkt.',
    task: 'Lies einen Abschnitt nüchtern und einen anklagend laut. Notiere, welche Wörter durch die Performance ihr Gewicht verändern.',
  },
  {
    date: '12.05.', title: 'Politische Lyrik III · Gedichte',
    recap: 'Im Zentrum steht die genaue Textarbeit: Form, Sprecherposition und historischer Kontext müssen gemeinsam erklären, wie politische Bedeutung erzeugt wird. Gegenwartsbezug ist eine Anschlussleistung, kein Ersatz für Analyse.',
    brecht: 'Das ist die direkte Seminarschiene für deinen Essay: zuerst am Gedicht zeigen, wie Zukunft, Verantwortung und Urteil gebaut werden; erst dann die fossile Gegenwart als Aktualisierung prüfen.',
    task: 'Formuliere einen Satz nach dem Muster: „Nicht nur X ist politisch; politisch ist vor allem, dass die Form Y bewirkt.“',
  },
];

const essayMap = [
  ['1', 'Hitze und die regierenden Fossilien', 'behalten', 'Als Gegenwartsstoß beginnen, aber innerhalb der ersten Sätze Brechts „finstere Zeiten“ als Prüfbegriff einführen.'],
  ['2', 'Trump, Putin, Merz als fossile Figuren', 'kürzen', 'Polemik bewahren; Figuren nicht zum neuen Hauptgegenstand werden lassen. Der Absatz muss die beschädigte Gegenwart aus Teil I erhellen.'],
  ['3', 'Banken, fossile Milliarden, Interessen', 'behalten', 'Als materielle Antwort auf Brechts Frage nach dem individuell richtigen Leben unter falschen Strukturen. Beleg stehen lassen.'],
  ['4', 'Opposition und systemische Macht', 'an Brecht binden', 'Mit dem Konflikt zwischen alter Weisheit und notwendigem Eingreifen verschalten.'],
  ['5', 'Vernichtete politische Möglichkeiten', 'verschieben', 'Übergang zu Teil II: Aus Gegenwartsdiagnose wird historische Bilanz.'],
  ['6', 'Der epistemische zweite Sieg', 'behalten', 'Zum Kern der Nachgeborenen-Perspektive machen: Wer bestimmt, welche Vergangenheit als mögliche Zukunft erinnert wird?'],
  ['7', 'Realsozialismus und asymmetrisches Scheitern', 'kürzen', 'Nur behalten, wenn die Passage die Gedächtnispolitik schärft; keine zweite Großdebatte eröffnen.'],
  ['8', 'Idealisten als lächerliche Außenseiter', 'an Brecht binden', 'Mit Zorn, Freundlichkeit und der nachträglichen Lesbarkeit widerständiger Lebensformen verbinden.'],
  ['9–11', 'Grüne Entwürfe, Wahlen, Infrastruktur', 'verdichten', 'Als heutige Probe auf Brechts Frage: Welche Bedingungen machen Helfen gesellschaftlich möglich?'],
  ['12', 'An die Nachgeborenen / Asche der Zukunft', 'neu rahmen', 'Nicht nur anspielen: Teil III genau lesen und den Schluss als Antwort auf die Bitte um Nachsicht zuspitzen.'],
];

const sources = [
  ['Volltext & Aufnahme', 'Lyrikline / Suhrkamp: autorisierter Text, bibliografische Angaben und Audio.', 'https://www.lyrikline.org/de/gedichte/die-nachgeborenen-740'],
  ['Forschung', 'Ronald Speirs (Hg.): Brecht’s Poetry of Political Exile. Cambridge University Press, 2000.', 'https://catalogue.nli.ie/Record/vtls000267840/TOC'],
  ['Forschung, frei zugänglich', 'H. R. Hays: The Poetry of Brecht. OAPEN; zur Mehrdeutigkeit des Gedichts.', 'https://library.oapen.org/bitstream/handle/20.500.12657/39857/9781469656854_WEB.pdf?isAllowed=y&sequence=1'],
  ['Seminarkontext', 'Handbuch Lyrik: Kapitel zur politischen Lyrik (Kursmaterial).', 'https://drive.google.com/file/d/1lvfOAH7bwaxXFDnJfKsUZucGKWaH1XzQ/view'],
  ['Seminarsitzung', 'Präsentation Politische Lyrik II: Songtexte (Kursmaterial).', 'https://drive.google.com/file/d/1hgJ_Ezmc2WxmqrjFY4fNZ0jzVOqlfToD/view'],
  ['Aufgabenbezug', 'Seminarplan Politische Literatur 2026 (Kursmaterial).', 'https://drive.google.com/file/d/1Jw2JHzjOFvivgvwDP_XUR_6AtjvR57TB/view'],
];

const lenses: Record<Lens, { label: string; pattern: RegExp }> = {
  stimmen: { label: 'Stimmen', pattern: /\b(ich|mich|mir|wir|uns|unser\w*|ihr|euch|euer\w*)\b/gi },
  zeit: { label: 'Zeit', pattern: /\b(zeit\w*|zeiten|damals|jetzt|noch|schon|später|verging|auftauchen|nachgeborenen)\b/gi },
  ethik: { label: 'Ethik', pattern: /\b(weise|weisheit|gut\w*|böse\w*|freundlich\w*|helfer\w*|nachsicht|hunger\w*|furcht\w*)\b/gi },
  negation: { label: 'Negation / Grenze', pattern: /\b(nicht|nichts|kein\w*|kaum|nur|kann|konnte|gering\w*)\b/gi },
};

function useStored(key: string, initial = '') {
  const [value, setValue] = useState(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setValue(window.localStorage.getItem(key) ?? initial);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [key, initial]);
  useEffect(() => {
    if (loaded) window.localStorage.setItem(key, value);
  }, [key, loaded, value]);
  return [value, setValue] as const;
}

function HighlightedText({ text, lens }: { text: string; lens: Lens }) {
  const pattern = new RegExp(lenses[lens].pattern.source, 'gi');
  const single = new RegExp(`^(?:${lenses[lens].pattern.source})$`, 'i');
  const chunks = text.split(pattern);
  return <div className="highlighted">{chunks.map((chunk, index) => single.test(chunk) ? <mark className={`mark-${lens}`} key={index}>{chunk}</mark> : <Fragment key={index}>{chunk}</Fragment>)}</div>;
}

function Reveal({ prompt, children, storageKey }: { prompt: string; children: React.ReactNode; storageKey: string }) {
  const [note, setNote] = useStored(`note-${storageKey}`);
  const [open, setOpen] = useState(false);
  return (
    <div className="reveal-box">
      <label>{prompt}</label>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Deine Beobachtung – gern unfertig, aber am Text begründet …" />
      <button onClick={() => setOpen(!open)} disabled={!note.trim()}>{open ? 'Gegenlesart schließen' : 'Gegenlesart öffnen'}</button>
      {open && <div className="reveal-content">{children}</div>}
    </div>
  );
}

export default function Home() {
  const [activePart, setActivePart] = useState(0);
  const [poem, setPoem] = useStored('brecht-fulltext');
  const [lens, setLens] = useState<Lens>('stimmen');
  const [dockOpen, setDockOpen] = useState(true);
  const [activeTension, setActiveTension] = useState(0);
  const [openCounter, setOpenCounter] = useState<number | null>(null);
  const [openSession, setOpenSession] = useState(2);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [statusesLoaded, setStatusesLoaded] = useState(false);
  const [quiz, setQuiz] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setStatuses(JSON.parse(window.localStorage.getItem('essay-statuses') ?? '{}')); } catch { /* local data only */ }
      setStatusesLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (statusesLoaded) window.localStorage.setItem('essay-statuses', JSON.stringify(statuses));
  }, [statuses, statusesLoaded]);

  const stats = useMemo(() => ({
    words: poem.trim() ? poem.trim().split(/\s+/).length : 0,
    parts: poem.match(/^\s*[123]\s*$/gm)?.length ?? 0,
  }), [poem]);

  const updateStatus = (id: string, value: string) => setStatuses((old) => ({ ...old, [id]: value }));

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#start"><span className="brand-mark">B</span><span>Brecht-Labor</span></a>
        <span className="course">An die Nachgeborenen · Politische Lyrik</span>
        <button className="dock-toggle" onClick={() => setDockOpen(!dockOpen)}>{dockOpen ? 'Text schließen' : 'Volltext öffnen'}</button>
      </header>

      <div className={`workspace ${dockOpen ? '' : 'dock-closed'}`}>
        <aside className="rail" aria-label="Lernmodule">
          <p className="eyebrow">Lernweg</p>
          {[
            ['01', 'Brecht', '#brecht'], ['02', 'Volltextlabor', '#volltext'], ['03', 'Architektur', '#architektur'], ['04', 'Form', '#form'],
            ['05', 'Zeit & Stimmen', '#zeit'], ['06', 'Ethik', '#ethik'], ['07', 'Politik', '#politik'], ['08', 'Forschung', '#forschung'],
            ['09', 'Stresstest', '#stresstest'], ['10', 'Umbauplan', '#umbau'], ['11', 'Seminar', '#seminar'], ['12', 'Selbsttest', '#selbsttest'], ['13', 'Quellen', '#quellen'],
          ].map(([num, label, href]) => <a key={href} href={href}><span>{num}</span>{label}</a>)}
          <div className="rail-note"><strong>Arbeitsprinzip</strong><p>Text → Beobachtung → Begriff → Gegenprobe → Transfer.</p></div>
        </aside>

        <div className="content">
          <section className="hero" id="start">
            <div className="kicker">Interaktives Leselabor · Priorität 1</div>
            <h1>Das Gedicht<br /><em>selbst denken.</em></h1>
            <p className="lede">Dieses Labor erklärt dir Brecht nicht weg. Du hältst den vollständigen Text daneben, formulierst zuerst selbst und vergleichst erst dann mit einer Gegenlesart. Ziel ist nicht die „richtige Interpretation“, sondern begründete Selbstständigkeit.</p>
            <div className="method-strip">
              {['beobachten', 'benennen', 'prüfen', 'übertragen'].map((word, i) => <div key={word}><b>{i + 1}</b><span>{word}</span></div>)}
            </div>
          </section>

          <section className="module" id="brecht">
            <header className="module-head"><div><span>01</span><p>Autor & Lage</p></div><h2>Brecht kennenlernen,<br />ohne ihn zum Denkmal zu machen</h2></header>
            <div className="intro-grid">
              <p className="big-copy">Brecht schreibt hier nicht aus sicherer Rückschau. Er ist ein marxistischer Autor im Exil, dessen Publikum zerschlagen und dessen Sprache politisch besetzt ist. Das Gedicht fragt deshalb zugleich: <em>Wie kann ein politischer Schriftsteller handeln, wenn Schreiben zu wenig und Schweigen falsch ist?</em></p>
              <aside className="fact-box"><strong>Werkort</strong><p>Das Gedicht bildet den Schluss der <i>Svendborger Gedichte</i>. Diese Stellung macht aus ihm nicht bloß einen Einzeltext, sondern eine Bilanz der Exillyrik.</p></aside>
            </div>
            <div className="timeline">
              {context.map(([year, text]) => <div key={year}><b>{year}</b><p>{text}</p></div>)}
            </div>
            <Reveal storageKey="brecht-position" prompt="Vorwissen prüfen: Was verändert Exil an der Sprechsituation eines politischen Gedichts?">
              <p>Exil ist mehr als biografischer Hintergrund. Es zerreißt die normale Beziehung zwischen Autor, Sprache, Ort und Publikum. Darum adressiert der Text eine zukünftige Leserschaft: Die gegenwärtige Öffentlichkeit ist beschädigt, die spätere wird sprachlich erst hergestellt.</p>
            </Reveal>
          </section>

          <section className="module text-lab-inline" id="volltext">
            <header className="module-head"><div><span>02</span><p>Am Wortlaut</p></div><h2>Volltextlabor</h2></header>
            <p>Dein eingefügter Text bleibt vollständig sichtbar. Die Markierungen sind Suchvorschläge, keine Interpretation: Du kannst die Linse wechseln und den Text selbst korrigieren.</p>
            {!poem ? <div className="empty-text"><b>Noch kein Volltext eingefügt.</b><p>Öffne rechts das Textexemplar oder nutze den autorisierten Text bei Lyrikline. Der Text wird nur lokal in deinem Browser gespeichert.</p></div> : <>
              <div className="lens-row">{(Object.keys(lenses) as Lens[]).map((key) => <button className={lens === key ? 'selected' : ''} key={key} onClick={() => setLens(key)}>{lenses[key].label}</button>)}</div>
              <HighlightedText text={poem} lens={lens} />
              <p className="machine-note">Automatisch gefunden: {poem.match(new RegExp(lenses[lens].pattern.source, 'gi'))?.length ?? 0} mögliche Treffer. Prüfe Fehl- und Mehrdeutigkeiten selbst.</p>
            </>}
          </section>

          <section className="module" id="architektur">
            <header className="module-head"><div><span>03</span><p>Großform</p></div><h2>Drei Teile,<br />drei Reichweiten des Sprechens</h2></header>
            <div className="part-tabs" role="tablist">
              {parts.map((part, i) => <button key={part.id} onClick={() => setActivePart(i)} className={activePart === i ? 'selected' : ''}><b>{part.id}</b><span>{part.voice}</span><small>{part.time}</small></button>)}
            </div>
            <article className="part-sheet">
              <div className="part-index">{parts[activePart].id}</div>
              <div>
                <p className="anchor">{parts[activePart].anchor}</p><h3>{parts[activePart].title}</h3><p className="claim">{parts[activePart].claim}</p>
                <div className="two-cols"><div><b>Bewegungen</b><ol>{parts[activePart].moves.map((x) => <li key={x}>{x}</li>)}</ol></div><div><b>Prüffragen</b><ul>{parts[activePart].tests.map((x) => <li key={x}>{x}</li>)}</ul></div></div>
              </div>
            </article>
            <Reveal storageKey={`architecture-${activePart}`} prompt={`Belege am Volltext: Wodurch ändert Teil ${parts[activePart].id} die Reichweite des Sprechens?`}>
              <p>Eine tragfähige Antwort braucht mindestens zwei Ebenen: ein sprachliches Signal – etwa Pronomen, Tempus, Wiederholung oder Anrede – und die politische Folge dieses Signals.</p>
            </Reveal>
          </section>

          <section className="module" id="form">
            <header className="module-head"><div><span>04</span><p>Machart</p></div><h2>Die Form argumentiert mit</h2></header>
            <div className="tool-grid">{formTools.map(([term, effect], i) => <article key={term}><span>{String(i + 1).padStart(2, '0')}</span><h3>{term}</h3><p>{effect}</p></article>)}</div>
            <div className="close-reading"><h3>Miniatur: Warum die Bäume-Frage kein Kunstverbot ist</h3><p>Der Satz stellt Natur und Politik nicht einfach gegeneinander. Seine paradoxe Form – ein harmloses Gespräch wird „fast“ zum Verbrechen – untersucht die historische Schuld einer Ästhetik, die ihre Umgebung ausblendet. Gleichzeitig beweist das Gedicht durch Metaphern, Rhythmus und Komposition, dass politische Dringlichkeit nicht auf Kunst verzichten muss.</p></div>
            <Reveal storageKey="form-proof" prompt="Wähle ein Formmittel und erkläre in zwei Schritten: Was sehe ich? Was bewirkt es politisch?">
              <p>Vermeide Etikettensammlungen. „Es gibt Wiederholungen“ ist erst der Befund. Analyse beginnt bei der Folge: Wiederholung verwandelt private Erinnerung in ein zitierbares, kollektives Protokoll.</p>
            </Reveal>
          </section>

          <section className="module" id="zeit">
            <header className="module-head"><div><span>05</span><p>Zeit & Stimme</p></div><h2>Das eigentliche Medium<br />ist historische Distanz</h2></header>
            <div className="time-machine">
              <div><b>ICH</b><span>beschädigte Gegenwart</span><small>erlebt & fragt</small></div><i>→</i><div><b>WIR</b><span>vergangene Lebenszeit</span><small>bilanziert & bezeugt</small></div><i>→</i><div><b>IHR</b><span>mögliche Zukunft</span><small>erinnert & urteilt</small></div>
            </div>
            <p className="big-copy">Der Titel ist eine Sprechhandlung: Er erzeugt Leser, die noch nicht da sind. So gewinnt eine politisch ohnmächtige Gegenwart eine zweite Öffentlichkeit in der Zukunft. Aber diese Zukunft muss das Gedicht erst voraussetzen – gerade darin liegt seine Hoffnung <em>und</em> seine Unsicherheit.</p>
            <Reveal storageKey="time-machine" prompt="Wer besitzt in jedem Teil Wissen, Handlungsmacht und Urteilsmacht? Unterscheide die drei Größen.">
              <p>Der Sprecher besitzt Erfahrung und historisches Wissen, aber begrenzte Handlungsmacht. Das zukünftige Ihr erhält Urteilsmacht, kennt die Erfahrung aber nur durch das überlieferte Gedicht. Formell verteilt Brecht Macht – keine Stimme besitzt alles.</p>
            </Reveal>
          </section>

          <section className="module" id="ethik">
            <header className="module-head"><div><span>06</span><p>Konflikte</p></div><h2>Keine reine Position,<br />sondern beschädigte Tugenden</h2></header>
            <div className="tension-layout">
              <div className="tension-list">{tensions.map(([left, right], i) => <button className={activeTension === i ? 'selected' : ''} onClick={() => setActiveTension(i)} key={left}><span>{left}</span><i>↔</i><span>{right}</span></button>)}</div>
              <article className="tension-detail"><p className="eyebrow">Dialektische Spannung</p><h3>{tensions[activeTension][0]} <i>und</i> {tensions[activeTension][1]}</h3><p>{tensions[activeTension][2]}</p><small>Aufgabe: Suche je einen Textbefund für beide Pole. Eine gute Analyse lässt keinen davon verschwinden.</small></article>
            </div>
          </section>

          <section className="module" id="politik">
            <header className="module-head"><div><span>07</span><p>Seminarbegriff</p></div><h2>Warum das politische Literatur ist</h2></header>
            <div className="definition"><span>Arbeitsdefinition</span><blockquote>Politisch wird Lyrik durch ihren Gegenstand <em>oder</em> durch ihre Perspektive.</blockquote><p>Nach Dieter Lamping, wie im Seminarhandbuch aufgegriffen.</p></div>
            <div className="politics-grid"><article><b>Gegenstand</b><p>Faschismus, Exil, Hunger, Klassenkampf, Herrschaft, Widerstand und historische Verantwortung.</p></article><article><b>Perspektive</b><p>Privates Essen erscheint als gesellschaftliches Verhältnis; individuelles Erleben wird zur Frage an Generationen.</p></article><article><b>Kommunikation</b><p>Das Gedicht entwirft eine Öffentlichkeit über die zerstörte Gegenwart hinaus und verlangt Erinnerung als Handlung.</p></article></div>
            <p className="thesis-callout">Nicht die Erwähnung politischer Begriffe macht den Text literarisch relevant. Entscheidend ist, dass seine Form Verantwortung, Reichweite und Urteilsmacht neu verteilt.</p>
          </section>

          <section className="module" id="forschung">
            <header className="module-head"><div><span>08</span><p>Literaturwissenschaft</p></div><h2>Das Gedicht im Feld<br />der Forschung</h2></header>
            <div className="classification">
              <article><b>Literaturgeschichtlich</b><h3>Exillyrik</h3><p>Entstanden 1934–1938, veröffentlicht 1939, Schlussstück der <i>Svendborger Gedichte</i>. Exil ist nicht nur Thema, sondern Kommunikationslage: Ort und gegenwärtiges Publikum sind verloren.</p></article>
              <article><b>Gattungsnah</b><h3>Rechenschaft & Elegie</h3><p>Ein lyrisches Triptychon mit Zügen von Bilanz, Verteidigungsrede, politischem Lehrgedicht und Klage. Keine dieser Bezeichnungen erklärt den ganzen Text.</p></article>
              <article><b>Poetologisch</b><h3>Kunst in finsteren Zeiten</h3><p>Der Text verhandelt seine eigene Möglichkeit: Darf Dichtung von Bäumen sprechen, wie kann sie politisch wirken, und welche Autorität besitzt ein ohnmächtiger Autor?</p></article>
              <article><b>Rezeptionsgeschichtlich</b><h3>Antwortgedicht</h3><p>Die Zukunftsadresse provozierte zahlreiche spätere Gegenreden. Celan, Enzensberger, Biermann und andere machten Brechts Zeilen zum Maßstab ihrer jeweils eigenen Gegenwart.</p></article>
            </div>
            <div className="research-grid">
              {researchViews.map((view, i) => <article key={view.scholar}>
                <div className="research-meta"><span>{String(i + 1).padStart(2, '0')}</span><b>{view.scholar}</b><small>{view.field}</small></div>
                <blockquote>{view.quote}</blockquote>
                <p>{view.use}</p>
                <a href={view.href} target="_blank" rel="noreferrer">{view.source} ↗</a>
              </article>)}
            </div>
            <Reveal storageKey="research-position" prompt="Wähle eine Forschungsposition: Wo bestätigt dein Volltext sie – und wo widersetzt er sich ihr?">
              <p>Forschung ist kein Endpunkt. Zitiere eine Position knapp, rekonstruiere ihre These in deinen Worten und prüfe sie anschließend an einem konkreten Formdetail. Erst diese Dreierbewegung macht aus einem Namen ein Argument.</p>
            </Reveal>
          </section>

          <section className="module" id="stresstest">
            <header className="module-head"><div><span>09</span><p>Gegenlesen</p></div><h2>Eine starke Deutung<br />überlebt Einwände</h2></header>
            <div className="counter-list">{counterReadings.map(([title, answer], i) => <article key={title}><button onClick={() => setOpenCounter(openCounter === i ? null : i)}><span>{String(i + 1).padStart(2, '0')}</span><b>{title}</b><i>{openCounter === i ? '−' : '+'}</i></button>{openCounter === i && <p>{answer}</p>}</article>)}</div>
            <Reveal storageKey="own-objection" prompt="Formuliere den stärksten Einwand gegen deine eigene fossile Aktualisierung. Kein Strohmann.">
              <p>Ein produktiver Einwand könnte lauten: Wenn „finstere Zeiten“ zu schnell auf jede Gegenwart übertragen werden, nivelliert man den historischen Unterschied zwischen NS-Terror, Exil und heutiger liberaler Demokratie. Die Aktualisierung muss deshalb über eine präzise Strukturähnlichkeit laufen – etwa Verstrickung, Zukunftsblockade oder Erinnerungspolitik – nicht über Gleichsetzung.</p>
            </Reveal>
          </section>

          <section className="module priority-two" id="umbau">
            <header className="module-head"><div><span>10</span><p>Priorität 2</p></div><h2>Deinen Essay umbauen,<br />nicht austauschen</h2></header>
            <p className="big-copy">Die politische Energie, Polemik und Gedankenfolge bleiben erkennbar deine. Neu ist die Statik: Jeder große Gegenwartsabschnitt bekommt eine analytische Verbindung zu Brechts Text. So wirkt der Essay wie eine ernsthafte Überarbeitung des vorhandenen Stücks – weil er genau das ist.</p>
            <div className="essay-arc"><div><b>I</b><span>Finstere Gegenwart</span><small>Hitze · Fossilien · Verstrickung</small></div><i>→</i><div><b>II</b><span>Vernichtete Möglichkeit</span><small>Geschichte · Erinnerung · zweiter Sieg</small></div><i>→</i><div><b>III</b><span>Urteil der Nachgeborenen</span><small>Nachsicht · Zukunft · Asche</small></div></div>
            <div className="remodel-table">
              {essayMap.map(([id, para, action, bridge]) => <article key={id}><span className="para-id">§ {id}</span><div><h3>{para}</h3><p>{bridge}</p></div><select value={statuses[id] ?? action} onChange={(e) => updateStatus(id, e.target.value)} aria-label={`Status Absatz ${id}`}><option>behalten</option><option>kürzen</option><option>verschieben</option><option>an Brecht binden</option><option>verdichten</option><option>neu rahmen</option><option>streichen</option></select></article>)}
            </div>
            <div className="guardrails"><h3>Unauffälliger, aber vor allem ehrlicher Umbau</h3><ul><li>Deine Originalabsätze bleiben der sprachliche Grundbestand.</li><li>Keine Brecht-Paraphrase vor den Text stellen: erst kurzes Originalsignal, dann genaue Beobachtung.</li><li>Historische Differenz explizit schützen; strukturell aktualisieren, nicht NS-Zeit und Gegenwart gleichsetzen.</li><li>Mindestens ein Einwand bleibt sichtbar – er stärkt statt entschärft die Polemik.</li></ul></div>
          </section>

          <section className="module priority-three" id="seminar">
            <header className="module-head"><div><span>11</span><p>Priorität 3</p></div><h2>Die drei Lyriksitzungen<br />in einem Zusammenhang</h2></header>
            <div className="session-list">{seminarSessions.map((session, i) => <article key={session.date}><button onClick={() => setOpenSession(openSession === i ? -1 : i)}><span>{session.date}</span><b>{session.title}</b><i>{openSession === i ? '−' : '+'}</i></button>{openSession === i && <div><h3>Rekapitulation</h3><p>{session.recap}</p><h3>Verbindung zu Brecht</h3><p>{session.brecht}</p><div className="session-task"><b>Selbstaufgabe</b>{session.task}</div></div>}</article>)}</div>
          </section>

          <section className="module" id="selbsttest">
            <header className="module-head"><div><span>12</span><p>Ohne KI</p></div><h2>Kannst du es selbst erklären?</h2></header>
            <div className="quiz">
              {[
                ['q1', 'Warum ist der Pronomenwechsel zentral?', ['Weil er Abwechslung schafft.', 'Weil er Erfahrung, Generation und Urteil auf verschiedene Sprecherpositionen verteilt.'], 'Weil er Erfahrung, Generation und Urteil auf verschiedene Sprecherpositionen verteilt.'],
                ['q2', 'Was ist die sauberste fossile Aktualisierung?', ['Trump und Putin sind genau wie der Nationalsozialismus.', 'Die historische Differenz bleibt bestehen; verglichen werden Strukturen der Verstrickung und Zukunftsblockade.'], 'Die historische Differenz bleibt bestehen; verglichen werden Strukturen der Verstrickung und Zukunftsblockade.'],
                ['q3', 'Wann wird ein Formbefund zur Analyse?', ['Wenn ein Fachbegriff genannt ist.', 'Wenn seine Funktion für Bedeutung, Wirkung oder Sprecherverhältnis erklärt wird.'], 'Wenn seine Funktion für Bedeutung, Wirkung oder Sprecherverhältnis erklärt wird.'],
              ].map(([id, question, choices, correct], idx) => <article key={id}><span>{idx + 1}</span><h3>{question}</h3>{(choices as string[]).map((choice) => <button key={choice} onClick={() => setQuiz((q) => ({ ...q, [id as string]: choice }))} className={quiz[id as string] === choice ? 'chosen' : ''}>{choice}</button>)}{quiz[id as string] && <p className={quiz[id as string] === correct ? 'right' : 'wrong'}>{quiz[id as string] === correct ? 'Tragfähig. Formuliere nun selbst ein Textbeispiel dazu.' : 'Noch zu kurz gegriffen. Prüfe, welche analytische Beziehung fehlt.'}</p>}</article>)}
            </div>
            <div className="independence-check"><h3>Du bist bereit für den Umbau, wenn du ohne Hilfe …</h3><label><input type="checkbox" /> die drei Teile in je zwei Sätzen erklären kannst.</label><label><input type="checkbox" /> drei Formmittel mit politischer Funktion am Text belegst.</label><label><input type="checkbox" /> Nachsicht und Freispruch unterscheiden kannst.</label><label><input type="checkbox" /> deine Aktualisierung gegen den Gleichsetzungseinwand verteidigst.</label><label><input type="checkbox" /> die klare Verbindung zur Sitzung vom 12.05. formulierst.</label></div>
          </section>

          <section className="module sources" id="quellen">
            <header className="module-head"><div><span>13</span><p>Nachprüfen</p></div><h2>Quellen & Arbeitsgrundlage</h2></header>
            {sources.map(([kind, title, href]) => <a href={href} target="_blank" rel="noreferrer" key={href}><span>{kind}</span><p>{title}</p><b>↗</b></a>)}
            <p className="source-note">Hinweis: Das Labor enthält aus Urheberrechtsgründen nicht den vollständigen Gedichttext. Dein eingefügtes Exemplar wird nur im lokalen Browser-Speicher abgelegt und verlässt das Gerät nicht.</p>
          </section>
        </div>

        {dockOpen && <aside className="text-dock" id="text-dock">
          <div className="dock-head"><div><p className="eyebrow">Dein Exemplar</p><h2>Volltext</h2></div><span>{stats.words} Wörter</span></div>
          <p className="privacy">Rechtmäßig bezogenen Text einfügen. Er bleibt lokal, wird nicht hochgeladen und nicht mit dem GitHub-Projekt veröffentlicht.</p>
          <textarea value={poem} onChange={(e) => setPoem(e.target.value)} placeholder={'1\n[Gedicht hier vollständig einfügen …]\n\n2\n…\n\n3\n…'} aria-label="Volltext des Gedichts" />
          <div className="dock-foot"><span>{stats.parts === 3 ? '✓ 3 Teile erkannt' : `${stats.parts}/3 Teile erkannt`}</span><a href="https://www.lyrikline.org/de/gedichte/die-nachgeborenen-740" target="_blank" rel="noreferrer">Text & Audio ↗</a></div>
        </aside>}
      </div>
    </main>
  );
}
