import { DEFAULT_QUESTIONS, LEVELS } from '../data/questions';
import {
  AppState,
  CustomOrnament,
  LeaderboardEntry,
  QuestionItem,
  RekapLogItem,
} from '../types/edublox';

const KEYS = {
  STATE: 'edublox_sitty_state_v2',
  QUESTIONS: 'edublox_sitty_questions_v2',
  REKAP: 'edublox_sitty_rekap',
  LEADERBOARD: 'edublox_sitty_leaderboard',
  ORNAMENTS: 'edublox_sitty_ornaments',
};

export const INITIAL_APP_STATE: AppState = {
  playerName: 'Explorer',
  avatarId: 'raja',
  outfitColor: '#38bdf8',
  playerCount: 1,
  coins: 0,
  xp: 0,
  solvedIds: [],
  gameMode: 'adventure',
  config: {
    gameTitle: 'EDUBLOX – INFORMATICS ADVENTURE CITY',
    className: 'VII-A',
    arenaName: 'Informatics Adventure City',
    questionLimit: 50,
    quizMinutes: 45,
    coinReward: 10,
    difficulty: 'Normal',
  },
};

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(KEYS.STATE);
    if (!raw) return INITIAL_APP_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_APP_STATE,
      ...parsed,
      config: { ...INITIAL_APP_STATE.config, ...(parsed.config || {}) },
    };
  } catch {
    return INITIAL_APP_STATE;
  }
}

export function saveAppState(state: AppState) {
  try {
    localStorage.setItem(KEYS.STATE, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}

export function loadQuestionBank(): QuestionItem[] {
  try {
    const raw = localStorage.getItem(KEYS.QUESTIONS);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) return parsed;
    return JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
  }
}

export function saveQuestionBank(questions: QuestionItem[]) {
  try {
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
  } catch {
    // ignore
  }
}

export function loadRekapLogs(): RekapLogItem[] {
  try {
    const raw = localStorage.getItem(KEYS.REKAP);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRekapLogs(logs: RekapLogItem[]) {
  try {
    localStorage.setItem(KEYS.REKAP, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.LEADERBOARD);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]) {
  try {
    localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function loadCustomOrnaments(): CustomOrnament[] {
  try {
    const raw = localStorage.getItem(KEYS.ORNAMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomOrnaments(ornaments: CustomOrnament[]) {
  try {
    localStorage.setItem(KEYS.ORNAMENTS, JSON.stringify(ornaments));
  } catch {
    // ignore
  }
}

export function getPlayerLevel(xp: number) {
  let current = LEVELS[0];
  let next = LEVELS[1] || null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }
  return { ...current, next };
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
