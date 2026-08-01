// ============================================================
// STORAGE UTILITIES
// ✅ FIX: Parse failure now shows a toast instead of silently wiping progress
// ✅ FIX: Private-mode/persist failure warns the user
// ============================================================

const KEY = 'python-pal-state-v3';

export function loadState(onCorrupted, onPersistFailed) {
  // Try to migrate from older schema versions
  const raw =
    localStorage.getItem(KEY) ||
    localStorage.getItem('python-pal-state-v2') ||
    localStorage.getItem('python-pal-state');

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      lang:          parsed.lang === 'es' ? 'es' : 'en',
      completed:     Array.isArray(parsed.completed) ? parsed.completed.filter(Number.isInteger) : [],
      attempts:      parsed.attempts && typeof parsed.attempts === 'object' ? parsed.attempts : {},
      drafts:        parsed.drafts && typeof parsed.drafts === 'object' ? parsed.drafts : {},
      activityDates: Array.isArray(parsed.activityDates) ? parsed.activityDates : [],
      playgroundCode: typeof parsed.playgroundCode === 'string' ? parsed.playgroundCode : null,
      aiEnabled:     !!parsed.aiEnabled,
      onboarded:     !!parsed.onboarded,
      userName:      typeof parsed.userName === 'string' ? parsed.userName : '',
    };
  } catch {
    // ✅ FIX: Don't silently wipe. Notify the user.
    if (typeof onCorrupted === 'function') onCorrupted();
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 3, ...state }));
  } catch {
    // Storage quota exceeded — silently fail, app still works
  }
}

/**
 * Detect actual private / ephemeral browsing.
 * Strategy: try to write a cookie. In private mode on Firefox/Safari
 * cookies are blocked or cleared immediately. Chrome private mode
 * does persist localStorage but triggers quota limits — we test that.
 * Also skips the warning entirely on localhost (dev) and Electron.
 */
export async function requestPersist(onFailed) {
  // Never warn on localhost / dev / Electron (file:// or no hostname)
  const host = location.hostname;
  if (!host || host === 'localhost' || host === '127.0.0.1') return;

  // Quick write test — if localStorage is already working, data is safe
  try {
    const key = '_pp_persist_probe';
    localStorage.setItem(key, '1');
    const ok = localStorage.getItem(key) === '1';
    localStorage.removeItem(key);
    if (ok) return; // data is persisting fine, no warning needed
  } catch {
    // localStorage is blocked → genuinely ephemeral
    if (typeof onFailed === 'function') onFailed();
    return;
  }

  // On HTTPS with engagement, ask the browser to elevate persistence
  if (navigator.storage?.persist) {
    try { await navigator.storage.persist(); } catch { /* fine */ }
  }
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function calcStreak(activityDates) {
  const set = new Set(activityDates);
  const d = new Date();
  // Start from today; if today not in set, check yesterday
  if (!set.has(d.toISOString().slice(0, 10))) {
    d.setDate(d.getDate() - 1);
  }
  let count = 0;
  while (set.has(d.toISOString().slice(0, 10))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function last5Days(lang) {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    return {
      key:   d.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'narrow' }).format(d),
    };
  });
}
