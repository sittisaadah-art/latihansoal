import { useRef, useState } from 'react';
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Coins,
  Crosshair,
  FileSpreadsheet,
  GraduationCap,
  Home,
  Play,
  RefreshCw,
  Rocket,
  RotateCcw,
  RotateCw,
  Star,
  Trophy,
  Users,
  Utensils,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AVATARS } from '../data/questions';
import {
  AppState,
  BuildingCode,
  ProximityTarget,
} from '../types/edublox';
import { getPlayerLevel } from '../utils/storage';

interface HudOverlayProps {
  appState: AppState;
  questionCount: number;
  audioEnabled: boolean;
  autoRotate: boolean;
  proximityTarget: ProximityTarget | null;
  onToggleAudio: () => void;
  onOpenQuiz: (buildingFilter: BuildingCode | 'ALL') => void;
  onOpenCanteen: () => void;
  onOpenLeaderboard: () => void;
  onOpenRekap: () => void;
  onOpenTeacher: () => void;
  onOpenCharacter: () => void;
  onReturnHome: () => void;
  onTeleport: (target: 'plaza' | 'canteen' | BuildingCode) => void;
  onRotateCamera: (rad: number) => void;
  onToggleAutoRotate: () => void;
  onFocusPlayer: () => void;
  onJump: () => void;
  onJoystickMove: (x: number, y: number) => void;
  onTriggerProximity: () => void;
}

export function HudOverlay({
  appState,
  questionCount,
  audioEnabled,
  autoRotate,
  proximityTarget,
  onToggleAudio,
  onOpenQuiz,
  onOpenCanteen,
  onOpenLeaderboard,
  onOpenRekap,
  onOpenTeacher,
  onOpenCharacter,
  onReturnHome,
  onTeleport,
  onRotateCamera,
  onToggleAutoRotate,
  onFocusPlayer,
  onJump,
  onJoystickMove,
  onTriggerProximity,
}: HudOverlayProps) {
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const joyZoneRef = useRef<HTMLDivElement | null>(null);
  const joyActiveRef = useRef(false);

  const av = AVATARS.find((a) => a.id === appState.avatarId) || AVATARS[0];
  const lv = getPlayerLevel(appState.xp);

  let xpPercent = 100;
  if (lv.next) {
    const span = lv.next.minXP - lv.minXP;
    const prog = appState.xp - lv.minXP;
    xpPercent = Math.min(100, Math.max(5, Math.round((prog / span) * 100)));
  }

  const modeLabels: Record<string, string> = {
    adventure: 'Mode Petualangan Kota',
    challenge: 'Quiz Challenge',
    practice: 'Practice Mode',
  };

  const updateJoystickFromClient = (clientX: number, clientY: number) => {
    const zone = joyZoneRef.current;
    if (!zone) return;
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = rect.width / 2 - 20;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    setKnobOffset({ x: dx, y: dy });
    onJoystickMove(dx / maxR, dy / maxR);
  };

  const resetJoystick = () => {
    joyActiveRef.current = false;
    setKnobOffset({ x: 0, y: 0 });
    onJoystickMove(0, 0);
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-2.5 sm:p-4">
      {/* Top HUD Row */}
      <div className="flex flex-wrap items-start justify-between gap-2 pointer-events-auto">
        {/* Top Left: Player Profile & XP */}
        <div className="flex flex-col gap-2">
          <div className="hud-surface-dark px-3.5 py-2 rounded-2xl flex items-center gap-2.5">
            <div className="font-fredoka text-xs sm:text-sm font-bold text-white leading-tight">
              EDUBLOX – INFORMATIKA
            </div>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <div className="text-[11px] font-bold text-yellow-300">
              {modeLabels[appState.gameMode] || 'Petualangan'}
            </div>
          </div>

          <div className="hud-surface-light px-3.5 py-2.5 rounded-2xl flex items-center gap-3 max-w-xs sm:max-w-sm">
            <div className="w-11 h-11 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-2xl shrink-0">
              {av.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-fredoka font-bold text-slate-900 text-sm truncate">
                  {appState.playerName}
                </span>
                <span className="text-[11px] font-bold text-purple-700 whitespace-nowrap">
                  Lv.{lv.level} · {lv.title}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5 border border-slate-300">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mt-1 tabular-nums">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3 text-purple-600" /> {appState.xp} XP
                </span>
                <span className="inline-flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-500" /> {appState.coins} Koin
                </span>
                <span>
                  {appState.solvedIds.length}/{questionCount} Soal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right: Action Toolbar */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onOpenQuiz('ALL')}
            className="btn-3d btn-emerald px-3 py-2 text-xs sm:text-sm min-h-[40px]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Kuis 50 Soal</span>
          </button>
          <button
            type="button"
            onClick={onOpenCanteen}
            className="btn-3d btn-orange px-3 py-2 text-xs sm:text-sm min-h-[40px]"
            title="Kantin Edublox"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kantin</span>
          </button>
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="btn-3d btn-yellow px-3 py-2 text-xs sm:text-sm min-h-[40px]"
            title="Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ranking</span>
          </button>
          <button
            type="button"
            onClick={onOpenRekap}
            className="btn-3d btn-sky px-3 py-2 text-xs sm:text-sm min-h-[40px]"
            title="Rekap Nilai Otomatis"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Rekap</span>
          </button>
          <button
            type="button"
            onClick={onOpenTeacher}
            className="btn-3d btn-purple px-3 py-2 text-xs sm:text-sm min-h-[40px]"
            title="Panel Guru"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Guru</span>
          </button>
          <button
            type="button"
            onClick={onToggleAudio}
            className="btn-3d btn-slate px-3 py-2 text-xs sm:text-sm min-h-[40px]"
            aria-label={audioEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onReturnHome}
            className="btn-3d btn-pink px-3 py-2 text-xs sm:text-sm min-h-[40px]"
            title="Menu Utama"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Proximity Action Prompt (Positioned cleanly above bottom dock, leaving center 3D viewport open) */}
      {proximityTarget && (
        <div className="mx-auto mt-auto mb-2 pointer-events-auto max-w-md w-full px-2">
          <div className="hud-surface-light px-5 py-3.5 rounded-2xl text-center border-2 border-amber-400">
            <div className="text-[11px] font-extrabold text-orange-600 mb-0.5">
              {proximityTarget.badge}
            </div>
            <h3 className="font-fredoka text-lg sm:text-xl font-bold text-slate-900">
              {proximityTarget.title}
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-0.5 mb-3">
              {proximityTarget.desc}
            </p>
            <button
              type="button"
              onClick={onTriggerProximity}
              className="btn-3d btn-emerald px-5 py-2.5 text-sm w-full min-h-[42px]"
            >
              {proximityTarget.type === 'canteen' ? (
                <>
                  <Utensils className="w-4 h-4" /> BUKA KANTIN EDUBLOX
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" /> MULAI KUIS GEDUNG INI
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls Row: Joystick + Collapsible Center Dock + Jump */}
      <div className="flex items-end justify-between gap-2 pointer-events-none">
        {/* Virtual Joystick */}
        <div
          ref={joyZoneRef}
          onTouchStart={(e) => {
            e.stopPropagation();
            joyActiveRef.current = true;
            updateJoystickFromClient(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
            if (joyActiveRef.current) {
              updateJoystickFromClient(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={resetJoystick}
          onTouchCancel={resetJoystick}
          onMouseDown={(e) => {
            joyActiveRef.current = true;
            updateJoystickFromClient(e.clientX, e.clientY);
          }}
          onMouseMove={(e) => {
            if (joyActiveRef.current) {
              updateJoystickFromClient(e.clientX, e.clientY);
            }
          }}
          onMouseUp={resetJoystick}
          onMouseLeave={() => {
            if (joyActiveRef.current) resetJoystick();
          }}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-900/65 border-2 border-white/35 relative pointer-events-auto flex items-center justify-center touch-none shrink-0"
        >
          <div
            className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 border-2 border-white shadow-lg pointer-events-none"
            style={{
              transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
            }}
          />
          <span className="absolute -top-5 text-[10px] font-bold text-white bg-slate-900/85 px-2 py-0.5 rounded-lg pointer-events-none">
            WASD / GERAK
          </span>
        </div>

        {/* Collapsible Center Control Dock */}
        <div className="flex flex-col items-center pointer-events-auto max-w-[min(940px,94vw)]">
          <button
            type="button"
            onClick={() => setDockCollapsed((c) => !c)}
            className="hud-surface-dark px-3 py-1 rounded-t-xl text-[11px] font-bold text-sky-200 hover:text-white flex items-center gap-1 border-b-0"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Tampilkan Navigasi & Kamera
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Sembunyikan Kontrol
              </>
            )}
          </button>

          {!dockCollapsed && (
            <div className="hud-surface-dark px-3 py-2 rounded-2xl flex flex-col items-center gap-2">
              {/* Teleport Row */}
              <div className="flex flex-wrap items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => onTeleport('plaza')}
                  className="px-2.5 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-xs whitespace-nowrap"
                >
                  🏛️ Plaza
                </button>
                <button
                  type="button"
                  onClick={() => onTeleport('A')}
                  className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs whitespace-nowrap"
                >
                  🧠 Gd. A
                </button>
                <button
                  type="button"
                  onClick={() => onTeleport('B')}
                  className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs whitespace-nowrap"
                >
                  📊 Gd. B
                </button>
                <button
                  type="button"
                  onClick={() => onTeleport('C')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs whitespace-nowrap"
                >
                  📗 Gd. C
                </button>
                <button
                  type="button"
                  onClick={() => onTeleport('D')}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs whitespace-nowrap"
                >
                  🧪 Gd. D
                </button>
                <button
                  type="button"
                  onClick={() => onTeleport('E')}
                  className="px-2.5 py-1 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs whitespace-nowrap"
                >
                  🐱 Gd. E
                </button>
                <button
                  type="button"
                  onClick={() => onTeleport('canteen')}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs whitespace-nowrap"
                >
                  🍔 Kantin
                </button>
              </div>

              {/* Camera 360 Row */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-white/10 pt-1.5">
                <span className="text-[11px] font-bold text-sky-300 hidden sm:inline mr-1">
                  Kamera 360°:
                </span>
                <button
                  type="button"
                  onClick={() => onRotateCamera(-0.35)}
                  className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <RotateCcw className="w-3 h-3" /> Kiri
                </button>
                <button
                  type="button"
                  onClick={() => onRotateCamera(0.35)}
                  className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap"
                >
                  Kanan <RotateCw className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={onToggleAutoRotate}
                  className={`px-2.5 py-1 rounded-lg text-white text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap ${
                    autoRotate
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" /> 360°
                </button>
                <button
                  type="button"
                  onClick={onFocusPlayer}
                  className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <Crosshair className="w-3 h-3" /> Fokus
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Touch Jump & Character Setup */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto shrink-0">
          <button
            type="button"
            onClick={onOpenCharacter}
            className="btn-3d btn-sky px-3 py-2 text-xs min-h-[40px]"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Avatar & P1–P4</span>
          </button>
          <button
            type="button"
            onMouseDown={onJump}
            onTouchStart={(e) => {
              e.preventDefault();
              onJump();
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full btn-3d btn-emerald text-white font-extrabold text-sm shadow-xl flex flex-col items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
            <span className="text-[10px]">LOMPAT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
