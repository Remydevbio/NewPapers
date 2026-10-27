// Defaults, theme metadata and topic helpers shared by background and UI.
import { SOURCES } from './sources/index.js';

export const THEMES = [
  { id: 'claude-light', name: 'Claude Light', mode: 'light', badge: '#B5532F', swatch: ['#F0EEE6', '#FAF9F5', '#D97757', '#B5532F'] },
  { id: 'slate-light', name: 'Slate', mode: 'light', badge: '#3B5BDB', swatch: ['#EEF1F5', '#FFFFFF', '#3B5BDB', '#475569'] },
  { id: 'forest-light', name: 'Forest', mode: 'light', badge: '#2B6A45', swatch: ['#E9EFE6', '#FBFCF9', '#2F7A4E', '#46574B'] },
  { id: 'hc-light', name: 'High Contrast Light', mode: 'light', badge: '#0038B8', swatch: ['#FFFFFF', '#F0F0F0', '#0038B8', '#000000'] },
  { id: 'claude-dark', name: 'Claude Dark', mode: 'dark', badge: '#D97757', swatch: ['#1F1E1D', '#262624', '#D97757', '#B7B5A9'] },
  { id: 'ocean-dark', name: 'Ocean', mode: 'dark', badge: '#0E7490', swatch: ['#0B1622', '#102030', '#38BDF8', '#9DB4C6'] },
  { id: 'dusk-dark', name: 'Dusk', mode: 'dark', badge: '#7C5CD6', swatch: ['#17151F', '#201D2A', '#A78BFA', '#ADA5C2'] },
  { id: 'hc-dark', name: 'High Contrast Dark', mode: 'dark', badge: '#FFD400', badgeText: '#000000', swatch: ['#000000', '#141414', '#FFD400', '#FFFFFF'] },
];
export const THEME_IDS = THEMES.map((t) => t.id);

export const DEFAULT_SETTINGS = {
  theme: 'auto',
  autoLight: 'claude-light',
  autoDark: 'claude-dark',
  sources: Object.fromEntries(SOURCES.map((s) => [s.id, s.defaultEnabled])),
  europepmcScope: 'preprints', // 'preprints' | 'all'
  email: '',
  ncbiApiKey: '',
  openalexApiKey: '',
  openOnStartup: 'always', // 'always' | 'new' | 'never'
  openLinksInBackground: true, // keep the popup/results window open when a paper is opened
  maxEntriesPerTopic: 300,
};

export function withDefaults(settings) {
  const s = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  s.sources = { ...DEFAULT_SETTINGS.sources, ...(settings?.sources || {}) };
  if (s.theme !== 'auto' && !THEME_IDS.includes(s.theme)) s.theme = 'auto';
  return s;
}

/** Resolve the concrete theme id for a setting and the system preference. */
export function resolveTheme(settings, prefersDark) {
  const s = withDefaults(settings);
  if (s.theme !== 'auto') return s.theme;
  return prefersDark ? s.autoDark : s.autoLight;
}

/** Per-topic override: 'default' | 'on' | 'off'. */
export function topicSourceEnabled(topic, settings, sourceId) {
  const o = topic?.sources?.[sourceId] || 'default';
  if (o === 'on') return true;
  if (o === 'off') return false;
  return !!withDefaults(settings).sources[sourceId];
}

export function newTopicId() {
  return `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function makeTopic(name, query, sources = {}) {
  return { id: newTopicId(), name: String(name).trim(), query: String(query).trim(), sources, createdAt: Date.now() };
}
