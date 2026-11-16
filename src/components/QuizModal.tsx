import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  Coins,
  Flag,
  Square,
  User,
  XCircle,
} from 'lucide-react';
import { BUILDINGS_META } from '../data/questions';
import {
  BuildingCode,
  GameMode,
  OptionLetter,
  QuestionItem,
  QuizResultSummary,
  RekapLogItem,
  TeacherConfig,
  TrueFalseChoice,
} from '../types/edublox';
import { AudioEngine } from '../utils/audio';
import { formatTime } from '../utils/storage';
import { QuestionVisual } from './QuestionVisual';

interface QuizModalProps {
  questionBank: QuestionItem[];
  filterBuilding: BuildingCode | 'ALL';
  mode: GameMode;
  playerName: string;
  currentCoins: number;
  config: TeacherConfig;
  onAnswerEvaluated: (params: {
    questionId: number;
    isCorrect: boolean;
    coinGain: number;
    xpGain: number;
    logItem: RekapLogItem;
  }) => void;
  onTriggerConfetti: () => void;
  onShowToast: (msg: string, variant: 'success' | 'warning' | 'info') => void;
  onFinish: (summary: QuizResultSummary) => void;
  onExit: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareShuffledQuestion(rawQ: QuestionItem): QuestionItem {
  if ((rawQ.type === 'single' || rawQ.type === 'complex') && rawQ.options) {
    const keys: OptionLetter[] = ['A', 'B', 'C', 'D'];
    const entries = keys.map((k) => ({ origKey: k, text: rawQ.options![k] }));
    const shuffledEntries = shuffleArray(entries);
    const newOptions: Record<OptionLetter, string> = { A: '', B: '', C: '', D: '' };

    let newAnswer: OptionLetter | undefined = rawQ.answer;
    const newComplex: OptionLetter[] = [];

    shuffledEntries.forEach((item, idx) => {
      const letter = keys[idx];
      newOptions[letter] = item.text;
      if (rawQ.type === 'single' && item.origKey === rawQ.answer) {
        newAnswer = letter;
      }
      if (rawQ.type === 'complex' && rawQ.complexAnswers?.includes(item.origKey)) {
        newComplex.push(letter);
      }
    });

    return {
      ...rawQ,
      options: newOptions,
      answer: rawQ.type === 'single' ? newAnswer : undefined,
      complexAnswers: rawQ.type === 'complex' ? newComplex.sort() : undefined,
    };
  }
  return rawQ;
}

export function QuizModal({
  questionBank,
  filterBuilding,
  mode,
  playerName,
  currentCoins,
  config,
  onAnswerEvaluated,
  onTriggerConfetti,
  onShowToast,
  onFinish,
  onExit,
}: QuizModalProps) {
  const sessionQuestions = useMemo(() => {
    let pool: QuestionItem[];
    if (filterBuilding !== 'ALL' && mode === 'adventure') {
      const bQuestions = questionBank.filter((q) => q.building === filterBuilding);
      const otherQuestions = questionBank.filter((q) => q.building !== filterBuilding);
      pool = [...shuffleArray(bQuestions), ...shuffleArray(otherQuestions)];
    } else {
      pool = shuffleArray(questionBank);
    }
    const limit = Math.min(config.questionLimit || 50, pool.length);
    return pool.slice(0, limit).map(prepareShuffledQuestion);
    // Freeze session pool on modal mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeLimitSeconds = useMemo(() => {
    let mins = config.quizMinutes || 45;
    if (config.difficulty === 'Mudah') mins = Math.round(mins * 1.3);
    if (config.difficulty === 'Tantangan') mins = Math.max(5, Math.round(mins * 0.7));
    return mins * 60;
  }, [config]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-question user response states
  const [selectedSingle, setSelectedSingle] = useState<OptionLetter | null>(null);
  const [selectedComplex, setSelectedComplex] = useState<OptionLetter[]>([]);
  const [selectedTF, setSelectedTF] = useState<(TrueFalseChoice | null)[]>([null, null, null]);
  const [shortInput, setShortInput] = useState('');

  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [history, setHistory] = useState<RekapLogItem[]>([]);
  const [feedbackNote, setFeedbackNote] = useState<{
    isCorrect: boolean;
    title: string;
    explanation: string;
  } | null>(null);

  const finalizeSession = (
    finalCorrect: number,
    finalWrong: number,
    finalCoins: number,
    finalXP: number,
    finalElapsed: number,
    finalHistory: RekapLogItem[]
  ) => {
    const total = sessionQuestions.length || 1;
    const score = Math.round((finalCorrect / total) * 100);
    const accuracy = Math.round((finalCorrect / total) * 100);
    let predicate = '📘 Keep Learning';
    if (score >= 90) predicate = '🏆 Informatics Champion';
    else if (score >= 80) predicate = '🌟 Genius Explorer';
    else if (score >= 70) predicate = '💡 Smart Thinker';
    else if (score >= 60) predicate = '📊 Data Apprentice';

    onFinish({
      score,
      correct: finalCorrect,
      wrong: finalWrong,
      total,
      sessionCoins: finalCoins,
      sessionXP: finalXP,
      accuracy,
      elapsedSeconds: finalElapsed,
      predicate,
      history: finalHistory,
      filterBuilding,
      mode,
    });
  };

  useEffect(() => {
    if (mode === 'practice') return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (mode === 'challenge' && next >= timeLimitSeconds) {
          clearInterval(timer);
          finalizeSession(correctCount, wrongCount, sessionCoins, sessionXP, next, history);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, timeLimitSeconds, correctCount, wrongCount, sessionCoins, sessionXP, history]);

  const currentQ = sessionQuestions[currentIndex];
  if (!currentQ) return null;

  const total = sessionQuestions.length;
  const pct = Math.round(((currentIndex + 1) / total) * 100);
  const bInfo = BUILDINGS_META[currentQ.building] || BUILDINGS_META.A;

  const modeBadgeMap: Record<GameMode, string> = {
    adventure: 'Petualangan Kota',
    challenge: 'Quiz Challenge',
    practice: 'Practice Mode',
  };

  const typeLabelMap: Record<QuestionItem['type'], string> = {
    single: 'Pilihan Ganda',
    complex: 'Pilihan Ganda Kompleks (Pilih 2)',
    truefalse: 'Benar / Salah (3 Pernyataan)',
    short: 'Isian Singkat',
  };

  const toggleComplexOption = (letter: OptionLetter) => {
    if (answered) return;
    setSelectedComplex((prev) => {
      if (prev.includes(letter)) return prev.filter((l) => l !== letter);
      if (prev.length >= 2) {
        return [prev[1], letter];
      }
      return [...prev, letter];
    });
  };

  const setTFChoice = (idx: number, choice: TrueFalseChoice) => {
    if (answered) return;
    setSelectedTF((prev) => {
      const next = [...prev];
      next[idx] = choice;
      return next;
    });
  };

  const handleSubmit = () => {
    if (answered) return;

    let isCorrect = false;
    let playerAnswerStr = '';
    let correctAnswerStr = '';

    if (currentQ.type === 'single' && currentQ.options && currentQ.answer) {
      if (!selectedSingle) {
        onShowToast('⚠️ Pilih salah satu jawaban A, B, C, atau D terlebih dahulu!', 'warning');
        return;
      }
      isCorrect = selectedSingle === currentQ.answer;
      playerAnswerStr = `${selectedSingle}. ${currentQ.options[selectedSingle]}`;
      correctAnswerStr = `${currentQ.answer}. ${currentQ.options[currentQ.answer]}`;
    } else if (currentQ.type === 'complex' && currentQ.options && currentQ.complexAnswers) {
      if (selectedComplex.length !== 2) {
        onShowToast('⚠️ Pilih tepat 2 jawaban yang benar!', 'warning');
        return;
      }
      const sortedSel = [...selectedComplex].sort();
      const sortedKey = [...currentQ.complexAnswers].sort();
      isCorrect =
        sortedSel.length === sortedKey.length &&
        sortedSel.every((val, i) => val === sortedKey[i]);
      playerAnswerStr = sortedSel.join(' & ');
      correctAnswerStr = sortedKey.join(' & ');
    } else if (currentQ.type === 'truefalse' && currentQ.statements && currentQ.tfAnswers) {
      const len = currentQ.statements.length;
      if (selectedTF.slice(0, len).some((v) => v === null)) {
        onShowToast('⚠️ Tentukan Benar atau Salah untuk seluruh pernyataan!', 'warning');
        return;
      }
      const labels = currentQ.tfLabels || ['Benar', 'Salah'];
      const toDisplay = (v: TrueFalseChoice | null) =>
        v === 'Benar' ? labels[0] : labels[1];
      isCorrect = currentQ.tfAnswers.every((ans, i) => selectedTF[i] === ans);
      playerAnswerStr = selectedTF.slice(0, len).map(toDisplay).join(', ');
      correctAnswerStr = currentQ.tfAnswers.map(toDisplay).join(', ');
    } else if (currentQ.type === 'short') {
      const cleaned = shortInput.trim().toLowerCase().replace(/\s+/g, ' ');
      if (!cleaned) {
        onShowToast('⚠️ Ketik jawaban singkat kamu terlebih dahulu!', 'warning');
        return;
      }
      const accepted = (currentQ.acceptedAnswers || []).map((a) =>
        a.trim().toLowerCase().replace(/\s+/g, ' ')
      );
      isCorrect = accepted.includes(cleaned);
      playerAnswerStr = shortInput.trim();
      correctAnswerStr = currentQ.displayAnswer || accepted[0] || '';
    }

    setAnswered(true);
    const baseCoin = isCorrect ? config.coinReward || 10 : 0;
    const baseXP = isCorrect ? 20 : 0;

    let bonusCoins = 0;
    let bonusXP = 0;
    let bonusMsg = '';

    const nextTotalAnswered = correctCount + wrongCount + 1;
    if (isCorrect) {
      if (nextTotalAnswered % 5 === 0) {
        bonusCoins += 25;
        bonusMsg += ' +25 Bonus Koin (5 Soal)!';
      }
      if (nextTotalAnswered % 10 === 0) {
        bonusXP += 100;
        bonusMsg += ' +100 Bonus XP (10 Soal)!';
      }
    }

    const totalCoinGain = baseCoin + bonusCoins;
    const totalXPGain = baseXP + bonusXP;

    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
    const nextWrong = isCorrect ? wrongCount : wrongCount + 1;
    const nextCoins = sessionCoins + totalCoinGain;
    const nextXP = sessionXP + totalXPGain;

    setCorrectCount(nextCorrect);
    setWrongCount(nextWrong);
    setSessionCoins(nextCoins);
    setSessionXP(nextXP);

    if (isCorrect) {
      setFeedbackNote({
        isCorrect: true,
        title: `BENAR! (+${baseCoin} Koin, +${baseXP} XP)${bonusMsg}`,
        explanation: currentQ.explanation,
      });
      AudioEngine.correct();
      onTriggerConfetti();
    } else {
      setFeedbackNote({
        isCorrect: false,
        title: `BELUM TEPAT · Kunci Jawaban: ${correctAnswerStr}`,
        explanation: currentQ.explanation,
      });
      AudioEngine.wrong();
    }

    const logItem: RekapLogItem = {
      timestamp: new Date().toLocaleString('id-ID'),
      playerName,
      className: config.className,
      qNumber: currentIndex + 1,
      category: currentQ.category,
      question: currentQ.question,
      playerAnswer: playerAnswerStr,
      correctAnswer: correctAnswerStr,
      status: isCorrect ? 'Benar' : 'Salah',
      points: isCorrect ? Math.round(100 / total) : 0,
    };

    setHistory((prev) => [...prev, logItem]);
    onAnswerEvaluated({
      questionId: currentQ.id,
      isCorrect,
      coinGain: totalCoinGain,
      xpGain: totalXPGain,
      logItem,
    });
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      finalizeSession(correctCount, wrongCount, sessionCoins, sessionXP, elapsedSeconds, history);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedSingle(null);
      setSelectedComplex([]);
      setSelectedTF([null, null, null]);
      setShortInput('');
      setAnswered(false);
      setFeedbackNote(null);
    }
  };

  const timerDisplay =
    mode === 'practice'
      ? 'Tanpa Batas'
      : mode === 'challenge'
      ? formatTime(Math.max(0, timeLimitSeconds - elapsedSeconds))
      : formatTime(elapsedSeconds);

  const tfLabels = currentQ.tfLabels || ['Benar', 'Salah'];

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/80 flex items-center justify-center p-2 sm:p-5">
      <div className="bg-white w-full max-w-4xl rounded-3xl p-4 sm:p-6 max-h-[95vh] flex flex-col justify-between overflow-y-auto border-4 border-sky-400 shadow-2xl">
        {/* Top Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-3 py-1 rounded-xl text-white font-fredoka font-bold text-xs sm:text-sm"
                style={{ backgroundColor: bInfo.hex }}
              >
                Gedung {currentQ.building} · {currentQ.category}
              </span>
              <span className="text-xs font-bold text-purple-700">
                {typeLabelMap[currentQ.type]}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                · {modeBadgeMap[mode]} {currentQ.source ? `· ${currentQ.source}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm font-extrabold tabular-nums">
              <span className="text-slate-700 inline-flex items-center gap-1">
                <User className="w-4 h-4 text-sky-500" /> {playerName}
              </span>
              <span className="text-amber-600 inline-flex items-center gap-1">
                <Coins className="w-4 h-4" /> {currentCoins}
              </span>
              <span
                className={`px-3 py-1 rounded-xl border inline-flex items-center gap-1.5 ${
                  mode === 'practice'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> {timerDisplay}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-600 mb-1 tabular-nums">
              <span>
                Soal Nomor <span className="text-sky-600 text-base">{currentIndex + 1}</span> dari{' '}
                <span>{total}</span>
              </span>
              <span>{pct}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-purple-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question, Visual Figure, and Input Controls */}
        <div className="my-4 space-y-4">
          {currentQ.visualId && <QuestionVisual visualId={currentQ.visualId} />}

          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* 1. PILIHAN GANDA (SINGLE) */}
          {currentQ.type === 'single' && currentQ.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['A', 'B', 'C', 'D'] as OptionLetter[]).map((letter) => {
                const isSelected = selectedSingle === letter;
                const isAnswer = currentQ.answer === letter;
                let cardClass =
                  'border-2 border-slate-300 bg-white hover:border-sky-500 hover:bg-sky-50';
                let badgeClass = 'bg-slate-200 text-slate-800';

                if (answered) {
                  if (isAnswer) {
                    cardClass = 'border-2 border-emerald-600 bg-emerald-50';
                    badgeClass = 'bg-emerald-600 text-white';
                  } else if (isSelected && !isAnswer) {
                    cardClass = 'border-2 border-rose-500 bg-rose-50';
                    badgeClass = 'bg-rose-600 text-white';
                  }
                } else if (isSelected) {
                  cardClass = 'border-2 border-sky-600 bg-sky-50 shadow-sm';
                  badgeClass = 'bg-sky-600 text-white';
                }

                return (
                  <button
                    key={letter}
                    type="button"
                    disabled={answered}
                    onClick={() => setSelectedSingle(letter)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition flex items-start gap-3 cursor-pointer ${cardClass}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl font-fredoka font-bold flex items-center justify-center shrink-0 text-sm ${badgeClass}`}
                    >
                      {letter}
                    </span>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm leading-snug pt-1">
                      {currentQ.options![letter]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. PILIHAN GANDA KOMPLEKS (PILIH 2 JAWABAN) */}
          {currentQ.type === 'complex' && currentQ.options && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-purple-700">
                Pilih tepat 2 pernyataan yang benar ({selectedComplex.length}/2 dipilih):
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(['A', 'B', 'C', 'D'] as OptionLetter[]).map((letter) => {
                  const isSelected = selectedComplex.includes(letter);
                  const isAnswer = currentQ.complexAnswers?.includes(letter) ?? false;
                  let cardClass =
                    'border-2 border-slate-300 bg-white hover:border-purple-500 hover:bg-purple-50';

                  if (answered) {
                    if (isAnswer) {
                      cardClass = 'border-2 border-emerald-600 bg-emerald-50';
                    } else if (isSelected && !isAnswer) {
                      cardClass = 'border-2 border-rose-500 bg-rose-50';
                    }
                  } else if (isSelected) {
                    cardClass = 'border-2 border-purple-600 bg-purple-50 shadow-sm';
                  }

                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={answered}
                      onClick={() => toggleComplexOption(letter)}
                      className={`w-full text-left p-3.5 rounded-2xl transition flex items-start gap-3 cursor-pointer ${cardClass}`}
                    >
                      <span className="mt-0.5 shrink-0 text-purple-700">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </span>
                      <span className="font-fredoka font-bold text-slate-900 text-sm shrink-0">
                        {letter}.
                      </span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm leading-snug">
                        {currentQ.options![letter]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. BENAR / SALAH (3 PERNYATAAN) */}
          {currentQ.type === 'truefalse' && currentQ.statements && currentQ.tfAnswers && (
            <div className="overflow-x-auto border border-slate-300 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-3">Pernyataan</th>
                    <th className="p-3 text-center w-24">{tfLabels[0]}</th>
                    <th className="p-3 text-center w-24">{tfLabels[1]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {currentQ.statements.map((stmt, idx) => {
                    const chosen = selectedTF[idx];
                    const correct = currentQ.tfAnswers![idx];
                    return (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-slate-800">{stmt}</td>
                        {(['Benar', 'Salah'] as TrueFalseChoice[]).map((choice, cIdx) => {
                          const isChosen = chosen === choice;
                          const isKey = correct === choice;
                          let btnStyle =
                            'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-sky-50';

                          if (answered) {
                            if (isKey) {
                              btnStyle = 'bg-emerald-600 text-white border border-emerald-700';
                            } else if (isChosen && !isKey) {
                              btnStyle = 'bg-rose-600 text-white border border-rose-700';
                            }
                          } else if (isChosen) {
                            btnStyle = 'bg-sky-600 text-white border border-sky-700';
                          }

                          return (
                            <td key={choice} className="p-2 text-center">
                              <button
                                type="button"
                                disabled={answered}
                                onClick={() => setTFChoice(idx, choice)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition min-w-[68px] ${btnStyle}`}
                              >
                                {tfLabels[cIdx]}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. ISIAN SINGKAT */}
          {currentQ.type === 'short' && (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
              <label className="block text-xs font-extrabold text-sky-900 mb-2">
                Ketik Jawaban Singkat Kamu:
              </label>
              <input
                type="text"
                disabled={answered}
                value={shortInput}
                onChange={(e) => setShortInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !answered) handleSubmit();
                }}
                placeholder="Tulis jawaban di sini..."
                className="w-full px-4 py-3 rounded-xl border-2 border-sky-300 focus:border-sky-600 outline-none font-bold text-slate-900 bg-white text-sm sm:text-base"
              />
            </div>
          )}

          {/* Feedback Box */}
          {feedbackNote && (
            <div
              className={`rounded-2xl p-4 border-2 ${
                feedbackNote.isCorrect
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                  : 'border-rose-300 bg-rose-50 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-fredoka text-base sm:text-lg font-bold mb-1">
                {feedbackNote.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{feedbackNote.title}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                Pembahasan: {feedbackNote.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onExit}
            className="btn-3d btn-slate px-4 py-2.5 text-xs sm:text-sm"
          >
            <Building2 className="w-4 h-4" />
            KEMBALI KE KOTA
          </button>

          <div className="flex items-center gap-2">
            {!answered ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-3d btn-emerald px-6 py-2.5 text-sm sm:text-base"
              >
                <Check className="w-4 h-4" />
                JAWAB
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="btn-3d btn-sky px-6 py-2.5 text-sm sm:text-base"
              >
                {currentIndex + 1 >= total ? (
                  <>
                    <Flag className="w-4 h-4" /> LIHAT HASIL AKHIR
                  </>
                ) : (
                  <>
                    SOAL BERIKUTNYA <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
