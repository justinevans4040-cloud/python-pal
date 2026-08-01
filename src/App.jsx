import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LESSONS, VALIDATORS, PROJECTS, BADGES } from './data/lessons.js';
import { loadState, saveState, requestPersist, todayISO, calcStreak, last5Days } from './utils/storage.js';

// ─── bilingual UI strings ───────────────────────────────────────────────────
const STR = {
  en: {
    greeting: 'Ready to build something?', sub: 'Small steps. Real Python. Lasting confidence.',
    continue: 'CONTINUE LEARNING', daily: 'DAILY GOAL', minutes: 'minutes',
    completed: 'completed', path: 'YOUR LEARNING PATH', foundations: 'Python Foundations',
    foundationSub: 'Syntax, variables, logic & loops', projects: 'Portfolio Projects',
    projectSub: 'Build useful programs from scratch', nav: ['Home','Learn','Code','Tutor','Me'],
    curriculum: 'Curriculum', curriculumSub: 'From first line to confident builder',
    all: 'All', current: 'Current', done: 'Complete', locked: 'Up next',
    lesson: 'LESSON', example: 'RUNNABLE EXAMPLE', tap: 'Tap a line to explain it',
    challenge: 'YOUR CHALLENGE', run: 'Run code', running: 'Running…', reset: 'Reset',
    hint: 'Hint', check: 'Check answer', output: 'OUTPUT', passed: 'Challenge complete!',
    tryAgain: 'Not quite yet', next: 'Next lesson', explain: 'EXPLAIN MODE',
    playground: 'Python Playground', playgroundSub: 'Experiment freely. You cannot break anything.',
    tutor: 'Pal Tutor', tutorSub: 'Your bilingual Python coach', ask: 'Ask about this code…',
    send: 'Send', quick: ['Explain simpler','Give me a hint','Find the bug','Quiz me'],
    stats: 'Your progress', mastery: 'MASTERY', streak: 'DAY STREAK', xp: 'TOTAL XP',
    achievements: 'Achievements', settings: 'Preferences', language: 'Learning language',
    install: 'Install Python Pal', installSub: 'Learn offline from your home screen',
    installBtn: 'Install app', iosHelp: 'On iPhone: tap Share, then Add to Home Screen.',
    welcome: 'Welcome to Python Pal', welcomeSub: 'Your path from zero experience to confident Python starts here.',
    choose: 'Choose your learning language', start: 'Start learning',
    noAccount: 'No account required · Progress stays on this device',
    levelLabel: 'BEGINNER → BUILDER', saved: 'Progress saved',
    codeReady: 'Python engine ready', codeLoading: 'Loading Python engine…',
    namePrompt: "What's your name? (optional)", namePlaceholder: 'Your name',
    corruptedWarning: 'Your saved progress could not be read. Starting fresh.',
    persistWarning: 'Private mode detected — progress may be lost when you close this tab.',
    projectStart: 'Open in editor',
  },
  es: {
    greeting: '¿Listo para construir algo?', sub: 'Pasos pequeños. Python real. Confianza duradera.',
    continue: 'CONTINUAR APRENDIENDO', daily: 'META DIARIA', minutes: 'minutos',
    completed: 'completado', path: 'TU RUTA DE APRENDIZAJE', foundations: 'Fundamentos de Python',
    foundationSub: 'Sintaxis, variables, lógica y bucles', projects: 'Proyectos de portafolio',
    projectSub: 'Crea programas útiles desde cero', nav: ['Inicio','Aprende','Código','Tutor','Yo'],
    curriculum: 'Plan de estudios', curriculumSub: 'De tu primera línea a programador seguro',
    all: 'Todo', current: 'Actual', done: 'Completa', locked: 'Siguiente',
    lesson: 'LECCIÓN', example: 'EJEMPLO EJECUTABLE', tap: 'Toca una línea para explicarla',
    challenge: 'TU DESAFÍO', run: 'Ejecutar', running: 'Ejecutando…', reset: 'Reiniciar',
    hint: 'Pista', check: 'Comprobar', output: 'SALIDA', passed: '¡Desafío completado!',
    tryAgain: 'Todavía no', next: 'Siguiente lección', explain: 'MODO EXPLICAR',
    playground: 'Laboratorio Python', playgroundSub: 'Experimenta libremente. No puedes romper nada.',
    tutor: 'Tutor Pal', tutorSub: 'Tu coach bilingüe de Python', ask: 'Pregunta sobre este código…',
    send: 'Enviar', quick: ['Explica más fácil','Dame una pista','Encuentra el error','Hazme una pregunta'],
    stats: 'Tu progreso', mastery: 'DOMINIO', streak: 'DÍAS SEGUIDOS', xp: 'XP TOTAL',
    achievements: 'Logros', settings: 'Preferencias', language: 'Idioma de aprendizaje',
    install: 'Instalar Python Pal', installSub: 'Aprende sin conexión desde tu pantalla de inicio',
    installBtn: 'Instalar app', iosHelp: 'En iPhone: toca Compartir y luego Agregar a inicio.',
    welcome: 'Bienvenido a Python Pal', welcomeSub: 'Tu camino de cero experiencia a Python con confianza comienza aquí.',
    choose: 'Elige tu idioma de aprendizaje', start: 'Empezar a aprender',
    noAccount: 'Sin cuenta · El progreso queda en este dispositivo',
    levelLabel: 'PRINCIPIANTE → CREADOR', saved: 'Progreso guardado',
    codeReady: 'Motor Python listo', codeLoading: 'Cargando motor Python…',
    namePrompt: '¿Cómo te llamas? (opcional)', namePlaceholder: 'Tu nombre',
    corruptedWarning: 'Tu progreso guardado no pudo leerse. Comenzando de nuevo.',
    persistWarning: 'Modo privado detectado — el progreso puede perderse al cerrar esta pestaña.',
    projectStart: 'Abrir en editor',
  },
};

// ─── line-by-line code explainer ────────────────────────────────────────────
function explainLine(code, lineIdx, lang) {
  const lines = code.split('\n');
  const line = (lines[Math.max(0, Math.min(lineIdx, lines.length - 1))] || '').trim();
  const indent = (lines[lineIdx] || '').length - (lines[lineIdx] || '').trimStart().length > 0
    ? (lang === 'en' ? ' Its indentation makes it part of the block above.' : ' Su sangría la hace parte del bloque anterior.')
    : '';
  if (!line) return lang === 'en' ? 'This blank line separates ideas. Python skips it.' : 'Esta línea en blanco separa ideas. Python la omite.';
  if (line.startsWith('#')) return lang === 'en' ? 'This is a comment. Python does not execute it.' : 'Este es un comentario. Python no lo ejecuta.';
  if (/^(async\s+)?def\s+/.test(line)) {
    const fn = line.match(/def\s+([A-Za-z_]\w*)/)?.[1] || 'this function';
    return lang === 'en' ? `Defines the reusable function ${fn}. The indented body runs when ${fn} is called.` : `Define la función reutilizable ${fn}. El cuerpo sangrado se ejecuta al llamarla.`;
  }
  if (/^class\s+/.test(line)) { const n = line.match(/^class\s+([A-Za-z_]\w*)/)?.[1] || 'this class'; return lang === 'en' ? `Defines ${n}, a blueprint for objects.` : `Define ${n}, un plano para objetos.`; }
  if (/^(from\s+\S+\s+)?import\s+/.test(line)) return lang === 'en' ? 'Imports existing Python tools for use by name.' : 'Importa herramientas de Python para usarlas por nombre.';
  if (/^if\s+/.test(line)) return (lang === 'en' ? 'Evaluates this condition. The indented block runs only when True.' : 'Evalúa esta condición. El bloque sangrado se ejecuta solo cuando es True.') + indent;
  if (/^for\s+/.test(line)) { const v = line.match(/^for\s+([A-Za-z_]\w*)\s+in/)?.[1] || 'item'; return lang === 'en' ? `Loops over each item, stores it in ${v}, and runs the indented block.` : `Itera sobre cada elemento, lo guarda en ${v} y ejecuta el bloque sangrado.`; }
  if (/^while\s+/.test(line)) return lang === 'en' ? 'Repeats its block while the condition is True.' : 'Repite el bloque mientras la condición sea True.';
  if (/^(return|yield)\b/.test(line)) return lang === 'en' ? `${line.startsWith('yield') ? 'yield pauses and produces' : 'return ends the function and sends back'} the value that follows.` : `${line.startsWith('yield') ? 'yield pausa y produce' : 'return termina la función y devuelve'} el valor que sigue.`;
  if (/^assert\s+/.test(line)) return lang === 'en' ? 'Checks an expectation — silent when True, raises AssertionError when False.' : 'Comprueba una expectativa — sin salida si es True, lanza AssertionError si es False.';
  if (/\bf["']/.test(line)) return lang === 'en' ? 'An f-string — builds text by replacing each {expression} with its value.' : 'Una f-string — crea texto reemplazando cada {expresión} con su valor.';
  if (/\bprint\s*\(/.test(line)) return (lang === 'en' ? 'Evaluates the expressions inside and displays their values.' : 'Evalúa las expresiones entre paréntesis y muestra sus valores.') + indent;
  const assign = line.match(/^([A-Za-z_]\w*(?:\[[^\]]+\])?)\s*([\+\-\*\/]?=)\s*(.+)$/);
  if (assign) return assign[2] === '=' ? (lang === 'en' ? `Evaluates the right side and stores the result in ${assign[1]}.` : `Evalúa el lado derecho y guarda el resultado en ${assign[1]}.`) + indent : (lang === 'en' ? `Updates ${assign[1]} using ${assign[2].slice(0,-1)}.` : `Actualiza ${assign[1]} usando ${assign[2].slice(0,-1)}.`) + indent;
  return (lang === 'en' ? 'Python evaluates this expression using the current program state.' : 'Python evalúa esta expresión con el estado actual del programa.') + indent;
}

// ─── challenge validator ─────────────────────────────────────────────────────
function checkConcept(lessonId, code, lang) {
  const v = VALIDATORS[lessonId];
  if (!v) return null;
  const allPass = (v.all || []).every(r => r.test(code));
  const anyPass = !v.any?.length || v.any.some(r => r.test(code));
  if (allPass && anyPass) return null;
  return lang === 'en'
    ? 'Your output matches, but the required Python concept is missing. Review the prompt and use the requested structure.'
    : 'La salida coincide, pero falta el concepto de Python requerido. Revisa el reto y usa la estructura solicitada.';
}

// ─── run Python in worker ────────────────────────────────────────────────────
function runPython(code) {
  return new Promise((resolve, reject) => {
    if (!window.Worker) { reject(new Error('ENGINE_UNAVAILABLE')); return; }
    const w = new Worker(import.meta.env.BASE_URL + 'python-worker.js');
    const timeout = setTimeout(() => { w.terminate(); reject(new Error('RUN_TIMEOUT')); }, 6000);
    w.onmessage = (e) => {
      const d = e.data || {};
      if (d.type === 'result') { clearTimeout(timeout); w.terminate(); d.error ? reject(new Error(d.error)) : resolve(String(d.stdout || '')); }
      if (d.type === 'error')  { clearTimeout(timeout); w.terminate(); reject(new Error(d.error || 'ENGINE_UNAVAILABLE')); }
    };
    w.onerror = () => { clearTimeout(timeout); w.terminate(); reject(new Error('ENGINE_UNAVAILABLE')); };
    w.postMessage({ type: 'run', code: code.slice(0, 12000) });
  });
}

function formatError(msg, lang) {
  const s = String(msg || '');
  if (s.includes('RUN_TIMEOUT')) return lang === 'en' ? 'Execution stopped after 6 seconds. Check for an infinite loop.' : 'La ejecución se detuvo después de 6 segundos. Revisa si hay un bucle infinito.';
  if (s.includes('ENGINE_UNAVAILABLE')) return lang === 'en' ? 'Python engine unavailable. Check your internet connection and try again.' : 'Motor Python no disponible. Verifica tu conexión e inténtalo de nuevo.';
  return s.split('\n').filter(Boolean).slice(-5).join('\n');
}

// ─── guided tutor responses ──────────────────────────────────────────────────
function guidedReply(text, lesson, code, lang) {
  const q = text.toLowerCase();
  if (q.includes('simpl') || q.includes('fácil')) return lang === 'en' ? `Simple version: ${lesson.concept.en.split('.')[0]}. Try changing one value, run it, and notice what changes.` : `Versión simple: ${lesson.concept.es.split('.')[0]}. Cambia un valor, ejecútalo y observa qué cambia.`;
  if (q.includes('hint') || q.includes('pista')) return lesson.hint[lang];
  if (q.includes('bug') || q.includes('error')) return lang === 'en' ? "Read the last error line first. Check spelling, punctuation, indentation, and that every name matches exactly. What looks different from the example?" : "Lee primero la última línea del error. Revisa ortografía, puntuación, sangría y que cada nombre coincida. ¿Qué se ve diferente al ejemplo?";
  if (q.includes('quiz') || q.includes('pregunta')) return lang === 'en' ? `Quick check: ${lesson.id < 4 ? 'what is the difference between a value and a variable?' : 'what will the first line of output be, and why?'}` : `Pregunta rápida: ${lesson.id < 4 ? '¿cuál es la diferencia entre un valor y una variable?' : '¿cuál será la primera línea de salida y por qué?'}`;
  return lang === 'en' ? `Let's connect that to ${lesson.title.en}. ${explainLine(code, 0, lang)} What value do you expect in the output?` : `Conectemos eso con ${lesson.title.es}. ${explainLine(code, 0, lang)} ¿Qué valor esperas ver en la salida?`;
}

// ─── initials from name ──────────────────────────────────────────────────────
function getInitials(name) {
  if (!name || !name.trim()) return 'JP';
  return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang]         = useState('en');
  const [view, setView]         = useState('home');
  const [lesson, setLesson]     = useState(LESSONS[0]);
  const [inLesson, setInLesson] = useState(false);
  const [filter, setFilter]     = useState('all');

  // progress
  const [completed, setCompleted]   = useState([]);
  const [attempts, setAttempts]     = useState({});
  const [drafts, setDrafts]         = useState({});
  const [activityDates, setActivity] = useState([]);
  const [onboarded, setOnboarded]   = useState(false);
  const [userName, setUserName]     = useState('');
  const [ready, setReady]           = useState(false);

  // lesson state
  const [code, setCode]       = useState(LESSONS[0].starter);
  const [output, setOutput]   = useState('');
  const [result, setResult]   = useState(null);   // 'pass' | 'fail' | null
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selLine, setSelLine]  = useState(null);

  // playground
  const [pgCode, setPgCode]   = useState('name = "Python Pal"\nfor step in range(1, 4):\n    print(step, name)');
  const [pgOut, setPgOut]     = useState('');
  const [pgRunning, setPgRunning] = useState(false);

  // tutor
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // toasts / banners
  const [toast, setToast]           = useState(null);
  const [persistBanner, setPersistBanner] = useState(false);

  // install PWA
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showIosHelp, setShowIosHelp]     = useState(false);

  const X = STR[lang];

  // ── boot ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = loadState(
      () => showToast(lang === 'en' ? STR.en.corruptedWarning : STR.es.corruptedWarning),
      () => setPersistBanner(true),
    );
    if (saved) {
      setLang(saved.lang);
      setCompleted(saved.completed);
      setAttempts(saved.attempts);
      setDrafts(saved.drafts);
      setActivity(saved.activityDates);
      setPgCode(saved.playgroundCode || pgCode);
      setOnboarded(saved.onboarded);
      setUserName(saved.userName || '');
      setMessages([{ role: 'pal', text: saved.lang === 'en'
        ? "Hi! I'm Pal. Ask me anything about the current lesson."
        : "¡Hola! Soy Pal. Pregúntame lo que quieras sobre la lección actual." }]);
    } else {
      setMessages([{ role: 'pal', text: "Hi! I'm Pal. Ask me anything about the current lesson." }]);
    }
    setReady(true);

    requestPersist(() => setPersistBanner(true));

    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

    return () => window.removeEventListener('beforeinstallprompt', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── persist state ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    saveState({ lang, completed, attempts, drafts, activityDates, onboarded, playgroundCode: pgCode, userName });
  }, [lang, completed, attempts, drafts, activityDates, onboarded, pgCode, userName, ready]);

  // ── save drafts while editing ──────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !inLesson) return;
    setDrafts(d => d[String(lesson.id)] === code ? d : { ...d, [String(lesson.id)]: code });
  }, [code, lesson.id, inLesson, ready]);

  // ── helpers ───────────────────────────────────────────────────────────────
  function showToast(msg, duration = 4000) {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }

  function openLesson(l) {
    setLesson(l);
    setCode(drafts[String(l.id)] || l.starter);
    setOutput('');
    setResult(null);
    setShowHint(false);
    setSelLine(null);
    setInLesson(true);
    setView('learn');
  }

  function markComplete() {
    if (!completed.includes(lesson.id)) setCompleted(c => [...c, lesson.id]);
    const today = todayISO();
    if (!activityDates.includes(today)) setActivity(d => [...d, today]);
  }

  async function handleRun(isChallenge = true, src = code) {
    setRunning(true);
    setResult(null);
    setAttempts(a => ({ ...a, [String(lesson.id)]: (a[String(lesson.id)] || 0) + 1 }));
    try {
      const out = (await runPython(src)).trimEnd();
      setOutput(out || (lang === 'en' ? 'Program finished with no output.' : 'El programa terminó sin salida.'));
      if (isChallenge) {
        const conceptErr = checkConcept(lesson.id, src, lang);
        const outputMatch = out.trim() === lesson.expected.trim();
        if (outputMatch && !conceptErr) { setResult('pass'); markComplete(); }
        else { setResult('fail'); if (outputMatch && conceptErr) setOutput(`${out}\n\n${conceptErr}`); }
      }
    } catch (err) {
      setOutput(formatError(err.message, lang));
      setResult(null);
    } finally {
      setRunning(false);
    }
  }

  async function handlePgRun() {
    setPgRunning(true);
    try {
      const out = (await runPython(pgCode)).trimEnd();
      setPgOut(out || (lang === 'en' ? 'Program finished with no output.' : 'El programa terminó sin salida.'));
    } catch (err) {
      setPgOut(formatError(err.message, lang));
    } finally {
      setPgRunning(false);
    }
  }

  function sendChat(text = chatInput) {
    const q = text.trim();
    if (!q) return;
    const reply = guidedReply(q, lesson, code, lang);
    setMessages(m => [...m, { role: 'user', text: q }, { role: 'pal', text: reply }]);
    setChatInput('');
  }

  // ── derived ───────────────────────────────────────────────────────────────
  const totalXP     = completed.reduce((s, id) => s + (LESSONS.find(l => l.id === id)?.xp || 0), 0);
  const pct         = Math.round(completed.length / LESSONS.length * 100);
  const nextLesson  = LESSONS.find(l => !completed.includes(l.id)) || LESSONS[LESSONS.length - 1];
  const streak      = calcStreak(activityDates);
  const days        = last5Days(lang);
  const initials    = getInitials(userName);
  const visibleLessons = LESSONS.filter(l =>
    filter === 'done' ? completed.includes(l.id) :
    filter === 'current' ? !completed.includes(l.id) && l.id <= Math.max(3, completed.length + 2) :
    true
  );

  // ── onboarding ────────────────────────────────────────────────────────────
  const [nameInput, setNameInput] = useState('');
  const [onboardLang, setOnboardLang] = useState('en');

  function finishOnboarding() {
    setLang(onboardLang);
    setUserName(nameInput.trim());
    setMessages([{ role: 'pal', text: onboardLang === 'en'
      ? "Hi! I'm Pal. Ask me anything about the current lesson."
      : "¡Hola! Soy Pal. Pregúntame lo que quieras sobre la lección actual." }]);
    setOnboarded(true);
  }

  if (!ready) return null;

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════
  return (
    <main className="app-shell">
      {/* ── Toast ── */}
      {toast && <div className="toast">{toast}</div>}

      {/* ── Persist banner ── */}
      {persistBanner && (
        <div className="persist-banner">
          <span>{X.persistWarning}</span>
          <button onClick={() => setPersistBanner(false)}>✕</button>
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="app-topbar">
        <button className="brand" onClick={() => { setInLesson(false); setView('home'); }}>
          <img src={import.meta.env.BASE_URL + 'icon-192.png'} alt="Python Pal" className="brand-icon" />
          <strong>PYTHON<em>PAL</em></strong>
        </button>
        <div className="top-actions">
          <span className="xp-pill">◆ {totalXP} XP</span>
          <a
            href="https://justinevans4040-cloud.github.io/wakecodex/forgefront-systems/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="ff-topbar-btn"
            aria-label="Forgefront Systems"
            title="Forgefront Systems"
          >
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <polygon points="11,1 21,6 21,16 11,21 1,16 1,6" stroke="url(#ffgt)" strokeWidth="1.6" fill="none"/>
              <polygon points="11,5 17,8.5 17,13.5 11,17 5,13.5 5,8.5" fill="url(#ffgt2)" opacity="0.3"/>
              <circle cx="11" cy="11" r="2.5" fill="url(#ffgt)"/>
              <defs>
                <linearGradient id="ffgt" x1="0" y1="0" x2="22" y2="22">
                  <stop offset="0%" stopColor="#00d4ff"/>
                  <stop offset="100%" stopColor="#7c3aed"/>
                </linearGradient>
                <linearGradient id="ffgt2" x1="0" y1="0" x2="22" y2="22">
                  <stop offset="0%" stopColor="#00d4ff"/>
                  <stop offset="100%" stopColor="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="ff-topbar-label">FORGEFRONT</span>
          </a>
          <button className="lang-button" aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
            onClick={() => setLang(l => l === 'en' ? 'es' : 'en')}>
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="app-content">
        {/* HOME */}
        {view === 'home' && !inLesson && (
          <div className="view-stack">
            {/* hero */}
            <section className="hero-card">
              <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
              <div className="eyebrow">{X.levelLabel}</div>
              <h1>{X.greeting}</h1>
              <p>{X.sub}</p>
              <div className="hero-bottom">
                <div className="mini-avatar">{initials}</div>
                <div className="level-copy">
                  <strong>Level {Math.max(1, completed.length + 1)}</strong>
                  <span>{totalXP} XP · {X.saved}</span>
                </div>
                <div className="level-badge">◆</div>
              </div>
            </section>

            {/* continue */}
            <button className="continue-card" onClick={() => openLesson(nextLesson)}>
              <div className="section-kicker">{X.continue}</div>
              <div className="continue-grid">
                <div className="lesson-number">{String(nextLesson.id).padStart(2, '0')}</div>
                <div><h2>{nextLesson.title[lang]}</h2><p>{nextLesson.subtitle[lang]}</p></div>
                <span className="round-button" aria-hidden="true">→</span>
              </div>
              <div className="progress-row">
                <div className="progress-track"><span style={{ width: `${Math.max(8, pct)}%` }} /></div>
                <strong>{pct}%</strong>
              </div>
            </button>

            {/* daily goal */}
            <section>
              <div className="section-head">
                <div><span className="section-kicker">{X.daily}</span><h2>20 {X.minutes}</h2></div>
                <span className="streak-pill">🔥 {streak} {lang === 'en' ? 'day streak' : 'días seguidos'}</span>
              </div>
              <div className="daily-grid">
                {days.map(d => (
                  <div key={d.key} className={`day-dot${activityDates.includes(d.key) ? ' active' : ''}`}>
                    <span>{d.label}</span><b>{activityDates.includes(d.key) ? '✓' : '·'}</b>
                  </div>
                ))}
              </div>
            </section>

            {/* paths */}
            <section>
              <div className="section-head">
                <div><span className="section-kicker">{X.path}</span><h2>{X.foundations}</h2></div>
                <button className="text-button" onClick={() => setView('learn')}>All →</button>
              </div>
              <button className="path-card path-blue" onClick={() => setView('learn')}>
                <div className="path-icon">{'{ }'}</div>
                <div>
                  <h3>{X.foundations}</h3>
                  <p>{X.foundationSub}</p>
                  <span>{completed.length}/{LESSONS.length} {X.completed}</span>
                </div>
                <b>→</b>
              </button>
              <button className="path-card path-gold" onClick={() => setView('learn')}>
                <div className="path-icon">⌁</div>
                <div>
                  <h3>{X.projects}</h3>
                  <p>{X.projectSub}</p>
                  <span>{PROJECTS.length} portfolio briefs</span>
                </div>
                <b>→</b>
              </button>
            </section>
          </div>
        )}

        {/* LEARN — curriculum list */}
        {view === 'learn' && !inLesson && (
          <div className="view-stack">
            <div className="view-title">
              <span className="section-kicker">{X.curriculum}</span>
              <h1>{X.foundations}</h1>
              <p>{X.curriculumSub}</p>
            </div>
            <div className="filter-pills">
              {['all','current','done'].map(f => (
                <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
                  {X[f]}
                </button>
              ))}
            </div>
            <div className="lesson-map">
              {visibleLessons.length === 0 && <p className="empty-state">{lang === 'en' ? 'No lessons match this filter.' : 'Ninguna lección coincide con este filtro.'}</p>}
              {visibleLessons.map(l => (
                <button key={l.id} className={`lesson-row${completed.includes(l.id) ? ' lesson-done' : ''}`}
                  onClick={() => openLesson(l)}>
                  <div className="map-number">{l.icon}</div>
                  <div className="map-copy">
                    <small>{l.level[lang]}</small>
                    <strong>{l.title[lang]}</strong>
                    <em>{l.subtitle[lang]}</em>
                  </div>
                  <div className="map-xp">{l.xp}<small>XP</small></div>
                </button>
              ))}
            </div>

            {/* Portfolio projects — ✅ FIX: cards now open lesson editor */}
            <div className="project-lab">
              <div className="section-head">
                <div><span className="section-kicker">{X.projects}</span><h2>{X.projectSub}</h2></div>
              </div>
              <div className="project-grid">
                {PROJECTS.map((p, i) => (
                  <article key={i} role="button" tabIndex={0}
                    style={{ cursor: 'pointer' }}
                    onClick={() => { openLesson(LESSONS[11]); /* open capstone */ }}
                    onKeyDown={(e) => e.key === 'Enter' && openLesson(LESSONS[11])}>
                    <span>{p.icon}</span>
                    <div>
                      <strong>{p[lang][0]}</strong>
                      <p>{p[lang][1]}</p>
                      <em style={{ color: 'var(--blue-bright)', fontSize: 9, fontWeight: 800 }}>
                        {X.projectStart} →
                      </em>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LESSON VIEW */}
        {inLesson && (
          <div className="view-stack">
            <button className="back-button" onClick={() => setInLesson(false)}>← {X.curriculum}</button>
            <div className="lesson-hero">
              <span className="section-kicker">{lesson.level[lang]}</span>
              <h1>{lesson.title[lang]}</h1>
              <p>{lesson.subtitle[lang]}</p>
              <div className="lesson-meta">
                <span>⏱ {lesson.minutes} {X.minutes}</span>
                <span>◆ {lesson.xp} XP</span>
                {completed.includes(lesson.id) && <span style={{ color: 'var(--green)' }}>✓ {X.done}</span>}
              </div>
            </div>

            {/* concept */}
            <div className="concept-card">
              <div className="concept-mark">{'{ }'}</div>
              <p>{lesson.concept[lang]}</p>
            </div>

            {/* example code */}
            <div className="code-card">
              <div className="code-dots">
                <i /><i /><i />
                <span>{X.example}</span>
              </div>
              <p className="tap-hint" style={{ padding: '6px 14px 0', margin: 0 }}>{X.tap}</p>
              <div className="code-lines">
                {lesson.code.split('\n').map((ln, i) => (
                  <button key={i} className={selLine === i ? 'selected-line' : ''} onClick={() => setSelLine(i)}>
                    <span>{i + 1}</span>
                    <code>{ln || ' '}</code>
                  </button>
                ))}
              </div>
              {selLine !== null && (
                <div className="explain-card">
                  <div className="explain-label">{X.explain}</div>
                  <p>{explainLine(lesson.code, selLine, lang)}</p>
                  <button onClick={() => { setView('tutor'); sendChat(lang === 'en' ? 'Explain simpler' : 'Explica más fácil'); }}>
                    {lang === 'en' ? 'Ask Pal →' : 'Preguntar a Pal →'}
                  </button>
                </div>
              )}
            </div>

            {/* challenge */}
            <div className="challenge-card">
              <span className="section-kicker">{X.challenge}</span>
              <h2>{lesson.challenge[lang]}</h2>
              <div className="editor-wrap">
                <div className="editor-top">
                  <div>
                    <button onClick={() => setCode(lesson.starter)}>{X.reset}</button>
                    <button onClick={() => setShowHint(h => !h)}>{X.hint}</button>
                  </div>
                  <span style={{ fontSize: 9 }}>challenge.py</span>
                </div>
                <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
              </div>
              {showHint && (
                <div className="hint-box"><b>HINT</b><p>{lesson.hint[lang]}</p></div>
              )}
              <button className="run-button" disabled={running} onClick={() => handleRun(true)}>
                {running ? X.running : X.check}
              </button>
              {output && (
                <div className={`output-box${result === 'pass' ? ' pass' : ''}`}>
                  <span>{X.output}</span>
                  <pre>{output}</pre>
                  {result === 'pass' && <strong>✓ {X.passed}</strong>}
                  {result === 'fail' && <strong>✗ {X.tryAgain}</strong>}
                </div>
              )}
              {result === 'pass' && (
                <button className="run-button complete-button"
                  onClick={() => { const idx = LESSONS.findIndex(l => l.id === lesson.id); if (idx < LESSONS.length - 1) openLesson(LESSONS[idx + 1]); else setInLesson(false); }}>
                  {X.next} →
                </button>
              )}
            </div>
          </div>
        )}

        {/* PLAYGROUND */}
        {view === 'code' && !inLesson && (
          <div className="view-stack">
            <div className="view-title"><h1>{X.playground}</h1><p>{X.playgroundSub}</p></div>
            <div className="playground-card">
              <div className="editor-top">
                <span>playground.py</span>
                <button onClick={() => setPgCode('name = "Python Pal"\nfor step in range(1, 4):\n    print(step, name)')}>{X.reset}</button>
              </div>
              <textarea value={pgCode} onChange={e => setPgCode(e.target.value)} spellCheck={false} />
              <div className="play-actions">
                <button onClick={handlePgRun} disabled={pgRunning}>{pgRunning ? X.running : X.run}</button>
                <button onClick={() => setPgOut('')}>{lang === 'en' ? 'Clear output' : 'Limpiar'}</button>
              </div>
            </div>
            {pgOut && (
              <div className="terminal-card">
                <div><span /><span /><span /><b>OUTPUT</b></div>
                <pre>{pgOut}</pre>
              </div>
            )}
          </div>
        )}

        {/* TUTOR */}
        {view === 'tutor' && !inLesson && (
          <div className="tutor-view">
            <div className="tutor-head">
              <div className="pal-avatar"><img src={import.meta.env.BASE_URL + 'icon-192.png'} alt="Pal" /><span>●</span></div>
              <div><h1>{X.tutor}</h1><p>{X.tutorSub}</p></div>
            </div>
            <div className="context-chip">
              <span>{'{ }'}</span>
              <div><small>LESSON CONTEXT</small><strong>{lesson.title[lang]}</strong></div>
            </div>
            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`message${m.role === 'user' ? ' user' : ''}`}>
                  <span>{m.role === 'user' ? (initials) : 'P'}</span>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
            <div className="quick-actions">
              {X.quick.map((q, i) => <button key={i} onClick={() => sendChat(q)}>{q}</button>)}
            </div>
            <div className="chat-box">
              <textarea rows={1} value={chatInput} placeholder={X.ask}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }} />
              <button onClick={() => sendChat()} disabled={!chatInput.trim()}>→</button>
            </div>
            <p className="tutor-note">{lang === 'en' ? 'Guided responses — no AI model required.' : 'Respuestas guiadas — sin modelo de IA requerido.'}</p>
          </div>
        )}

        {/* PROFILE */}
        {view === 'me' && !inLesson && (
          <div className="view-stack">
            <div className="profile-hero">
              <div className="profile-avatar">{initials}</div>
              <div>
                <span className="section-kicker">PYTHON PAL</span>
                <h1>{userName || (lang === 'en' ? 'Your Profile' : 'Tu Perfil')}</h1>
                <p>{lang === 'en' ? `Level ${Math.max(1, completed.length + 1)} · Active` : `Nivel ${Math.max(1, completed.length + 1)} · Activo`}</p>
              </div>
            </div>

            {/* stats */}
            <div className="stats-grid">
              <div><strong>{pct}%</strong><span>{X.mastery}</span></div>
              <div><strong>{streak}</strong><span>{X.streak}</span></div>
              <div><strong>{totalXP}</strong><span>{X.xp}</span></div>
            </div>

            {/* ✅ FIX: Badges now unlock based on real conditions */}
            <div>
              <div className="section-head"><div><span className="section-kicker">{X.achievements}</span></div></div>
              <div className="badge-grid">
                {BADGES.map(b => {
                  const earned = b.unlockWhen(completed, streak, lang);
                  return (
                    <div key={b.id} className={earned ? 'earned' : ''} title={earned ? '' : (lang === 'en' ? 'Keep going to unlock!' : '¡Sigue adelante para desbloquear!')}>
                      <span>{b.icon}</span>
                      <small>{b.label[lang]}</small>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* settings */}
            <div className="settings-card">
              <h2>{X.settings}</h2>
              <div className="setting-row">
                <div><strong>{X.language}</strong><span>{lang === 'en' ? 'English' : 'Español'}</span></div>
                <div className="language-toggle">
                  <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
                  <button className={lang === 'es' ? 'active' : ''} onClick={() => setLang('es')}>ES</button>
                </div>
              </div>
              <div className="setting-row">
                <div><strong>{lang === 'en' ? 'Your name' : 'Tu nombre'}</strong><span>{lang === 'en' ? 'Used for your avatar initials' : 'Usado para las iniciales del avatar'}</span></div>
                <input style={{ background: 'var(--panel)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '6px 10px', fontSize: 12, width: 110 }}
                  value={userName} onChange={e => setUserName(e.target.value)} placeholder={X.namePlaceholder} />
              </div>
              {installPrompt && (
                <div className="setting-row install-row" role="button" tabIndex={0}
                  onClick={async () => { installPrompt.prompt(); await installPrompt.userChoice; setInstallPrompt(null); }}>
                  <div><strong>{X.install}</strong><span>{X.installSub}</span></div>
                  <b>⬇</b>
                </div>
              )}
              {!installPrompt && (
                <div className="setting-row install-row" role="button" tabIndex={0} onClick={() => setShowIosHelp(h => !h)}>
                  <div><strong>{X.install}</strong><span>{X.installSub}</span></div>
                  <b>⬇</b>
                </div>
              )}
              {showIosHelp && <p className="ios-help">{X.iosHelp}</p>}
              <div className="setting-row danger-row" style={{ cursor: 'pointer' }}
                onClick={() => { if (window.confirm(lang === 'en' ? 'Reset all progress? This cannot be undone.' : '¿Reiniciar todo el progreso? Esto no se puede deshacer.')) { localStorage.clear(); window.location.reload(); } }}>
                <div><strong style={{ color: 'var(--red)' }}>{lang === 'en' ? 'Reset all progress' : 'Reiniciar progreso'}</strong><span>{lang === 'en' ? 'Cannot be undone' : 'No se puede deshacer'}</span></div>
                <b style={{ color: 'var(--red)' }}>✕</b>
              </div>
            </div>

            {/* ── Forgefront Systems ── */}
            <a
              href="https://justinevans4040-cloud.github.io/wakecodex/forgefront-systems/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="forgefront-btn"
              aria-label="Forgefront Systems"
            >
              <div className="ff-logo-mark">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <polygon points="11,1 21,6 21,16 11,21 1,16 1,6" stroke="url(#ffg)" strokeWidth="1.5" fill="none"/>
                  <polygon points="11,5 17,8.5 17,13.5 11,17 5,13.5 5,8.5" fill="url(#ffg2)" opacity="0.25"/>
                  <circle cx="11" cy="11" r="2.5" fill="url(#ffg)"/>
                  <defs>
                    <linearGradient id="ffg" x1="0" y1="0" x2="22" y2="22">
                      <stop offset="0%" stopColor="#00d4ff"/>
                      <stop offset="100%" stopColor="#7c3aed"/>
                    </linearGradient>
                    <linearGradient id="ffg2" x1="0" y1="0" x2="22" y2="22">
                      <stop offset="0%" stopColor="#00d4ff"/>
                      <stop offset="100%" stopColor="#7c3aed"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="ff-text">
                <span>BUILT BY</span>
                <strong>FORGEFRONT SYSTEMS</strong>
              </div>
              <span className="ff-arrow">↗</span>
            </a>
          </div>
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav" aria-label="Primary navigation">
        {['home','learn','code','tutor','me'].map((v, i) => (
          <button key={v} className={view === v && !inLesson ? 'active' : ''}
            onClick={() => { setInLesson(false); setView(v); }}>
            <span>{['⌂','▤','{ }','✦','●'][i]}</span>
            <small>{X.nav[i]}</small>
          </button>
        ))}
      </nav>

      {/* ── Onboarding ── */}
      {!onboarded && (
        <div className="onboarding">
          <div className="onboard-card">
            <div className="onboard-logo"><img src={import.meta.env.BASE_URL + 'icon-192.png'} alt="Python Pal" /></div>
            <span className="section-kicker">ENGLISH · ESPAÑOL</span>
            <h1>{STR[onboardLang].welcome}</h1>
            <p>{STR[onboardLang].welcomeSub}</p>
            <label>{STR[onboardLang].namePrompt}</label>
            <input className="name-input" placeholder={STR[onboardLang].namePlaceholder}
              value={nameInput} onChange={e => setNameInput(e.target.value)} />
            <label style={{ marginTop: 16 }}>{STR[onboardLang].choose}</label>
            <div className="language-choice">
              {['en','es'].map(l => (
                <button key={l} className={onboardLang === l ? 'active' : ''} onClick={() => setOnboardLang(l)}>
                  <b>{l.toUpperCase()}</b>
                  <span>{l === 'en' ? <><strong>English</strong><small>Learn Python in English</small></> : <><strong>Español</strong><small>Aprende Python en español</small></>}</span>
                  <i>✓</i>
                </button>
              ))}
            </div>
            <button className="start-button" onClick={finishOnboarding}>
              {STR[onboardLang].start} →
            </button>
            <small className="privacy-line">✓ {STR[onboardLang].noAccount}</small>
          </div>
        </div>
      )}
    </main>
  );
}
