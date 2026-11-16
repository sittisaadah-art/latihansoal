export type BuildingCode = 'A' | 'B' | 'C' | 'D' | 'E';
export type OptionLetter = 'A' | 'B' | 'C' | 'D';
export type QuestionType = 'single' | 'complex' | 'truefalse' | 'short';
export type TrueFalseChoice = 'Benar' | 'Salah';
export type GameMode = 'adventure' | 'challenge' | 'practice';
export type DifficultyLevel = 'Mudah' | 'Normal' | 'Tantangan';
export type OrnamentType = 'sakura' | 'gazebo' | 'robot' | 'picnic' | 'bench' | 'flowers' | 'infoboard';

export type QuestionVisualId =
  | 'gambar1'
  | 'gambar2'
  | 'figure2'
  | 'table1'
  | 'gambar3'
  | 'gambar4'
  | 'table2'
  | 'gambar5'
  | 'tabel3'
  | 'gambar6';

export interface QuestionItem {
  id: number;
  building: BuildingCode;
  category: string;
  source?: 'PSAS' | 'Bank Soal';
  type: QuestionType;
  visualId?: QuestionVisualId;
  question: string;
  // For 'single' and 'complex'
  options?: Record<OptionLetter, string>;
  // For 'single'
  answer?: OptionLetter;
  // For 'complex' (2 correct answers)
  complexAnswers?: OptionLetter[];
  // For 'truefalse' (3 statements)
  statements?: string[];
  tfAnswers?: TrueFalseChoice[];
  tfLabels?: [string, string]; // e.g., ['Benar', 'Salah'] or ['True', 'False']
  // For 'short' (fill-in-the-blank)
  acceptedAnswers?: string[];
  displayAnswer?: string;
  explanation: string;
}

export interface AvatarDefinition {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
}

export interface LevelDefinition {
  level: number;
  title: string;
  minXP: number;
}

export interface CanteenItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  xp: number;
  desc: string;
}

export interface BuildingMeta {
  name: string;
  short: string;
  color: number;
  hex: string;
  pos: { x: number; z: number };
  icon: string;
  desc: string;
}

export interface TeacherConfig {
  gameTitle: string;
  className: string;
  arenaName: string;
  questionLimit: number;
  quizMinutes: number;
  coinReward: number;
  difficulty: DifficultyLevel;
}

export interface AppState {
  playerName: string;
  avatarId: string;
  outfitColor: string;
  playerCount: number;
  coins: number;
  xp: number;
  solvedIds: number[];
  gameMode: GameMode;
  config: TeacherConfig;
}

export interface RekapLogItem {
  timestamp: string;
  playerName: string;
  className: string;
  qNumber: number;
  category: string;
  question: string;
  playerAnswer: string;
  correctAnswer: string;
  status: 'Benar' | 'Salah';
  points: number;
}

export interface LeaderboardEntry {
  name: string;
  className: string;
  avatar: string;
  score: number;
  correct: number;
  total: number;
  coins: number;
  xp: number;
  time: string;
  date: string;
}

export interface CustomOrnament {
  type: OrnamentType;
  x: number;
  z: number;
}

export interface ProximityTarget {
  type: 'building' | 'canteen';
  code?: BuildingCode;
  x: number;
  z: number;
  radius: number;
  title: string;
  desc: string;
  badge: string;
}

export interface QuizResultSummary {
  score: number;
  correct: number;
  wrong: number;
  total: number;
  sessionCoins: number;
  sessionXP: number;
  accuracy: number;
  elapsedSeconds: number;
  predicate: string;
  history: RekapLogItem[];
  filterBuilding: BuildingCode | 'ALL';
  mode: GameMode;
}
