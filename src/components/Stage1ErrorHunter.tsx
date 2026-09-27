import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, ArrowRight, Award, ShieldCheck, X, Zap, AlertTriangle, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Team, StorageErrorItem } from '../types/game';
import { INITIAL_STORAGE_ERRORS, STORAGE_ZONES } from '../data/foodData';
import { sound } from '../utils/audio';
import { CssConfetti } from './CssConfetti';

interface Stage1ErrorHunterProps {
  activeTeam: Team;
  onCompleteStage1: (score: number, foundCount: number, timeSeconds: number) => void;
  onGoToStage2: () => void;
  onBackToLobby: () => void;
}

export const Stage1ErrorHunter: React.FC<Stage1ErrorHunterProps> = ({
  activeTeam,
  onCompleteStage1,
  onGoToStage2,
  onBackToLobby: _onBackToLobby,
}) => {
  const [resolvedErrorIds, setResolvedErrorIds] = useState<string[]>([]);
  const [selectedError, setSelectedError] = useState<StorageErrorItem | null>(null);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [wrongOptionIndices, setWrongOptionIndices] = useState<number[]>([]);
  const [hasSolvedCurrent, setHasSolvedCurrent] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalCalculatedScore, setFinalCalculatedScore] = useState(0);
  const [normalItemNotice, setNormalItemNotice] = useState<string | null>(null);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  // Timer loop
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  // Target count needed to complete stage
  const TARGET_ERRORS_COUNT = 6;
  const allErrors = INITIAL_STORAGE_ERRORS;

  // Real-time dynamic speed bonus: Faster completion = higher speed bonus!
  // Starts at 500 points, gradually decreases with time (minimum 50 guaranteed)
  const currentSpeedBonus = Math.max(50, Math.round(500 - elapsedSeconds * 2.5));
  const baseFoundPoints = resolvedErrorIds.length * 100;
  const penaltyPoints = wrongCount * 30;
  const liveEstimatedScore = Math.max(
    0,
    baseFoundPoints + (resolvedErrorIds.length > 0 ? currentSpeedBonus : 0) - penaltyPoints
  );

  const handleInspectError = (errorItem: StorageErrorItem) => {
    sound.click();
    setSelectedError(errorItem);
    setSelectedOptionIdx(null);
    setWrongOptionIndices([]);
    setHasSolvedCurrent(resolvedErrorIds.includes(errorItem.id));
    setModalFeedback(null);
    setNormalItemNotice(null);
  };

  const handleInspectNormalItem = (name: string, reason: string) => {
    sound.click();
    setNormalItemNotice(`[정상 보관] ${name}: ${reason}`);
    setTimeout(() => {
      setNormalItemNotice(null);
    }, 3000);
  };

  const handleSubmitAnswer = (optionIdx: number) => {
    if (hasSolvedCurrent || !selectedError) return;
    if (wrongOptionIndices.includes(optionIdx)) return;

    const isCorrect = selectedError.options[optionIdx].isCorrect;

    if (isCorrect) {
      sound.correct();
      setSelectedOptionIdx(optionIdx);
      setHasSolvedCurrent(true);
      setModalFeedback('🎉 정답입니다! (+100점 획득)');

      if (!resolvedErrorIds.includes(selectedError.id)) {
        const updated = [...resolvedErrorIds, selectedError.id];
        setResolvedErrorIds(updated);

        if (updated.length >= TARGET_ERRORS_COUNT && !isCompleted) {
          setIsCompleted(true);
          sound.fanfare();
          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch {
            // Safe fallback
          }

          // Final score formula: Base (6 * 100 = 600) + Speed Bonus - Deductions
          const totalFinal = Math.max(
            50,
            TARGET_ERRORS_COUNT * 100 + currentSpeedBonus - wrongCount * 30
          );
          setFinalCalculatedScore(totalFinal);
          onCompleteStage1(totalFinal, updated.length, elapsedSeconds);
        }
      }
    } else {
      // Incorrect answer: Penalty deduction of 30 points per wrong choice!
      sound.wrong();
      setWrongCount((prev) => prev + 1);
      setWrongOptionIndices((prev) => [...prev, optionIdx]);
      setModalFeedback('❌ 오답입니다! (-30점 감점) 다른 보기를 다시 선택해보세요.');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isResolved = (id: string) => resolvedErrorIds.includes(id);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4 select-none">
      {/* Top Banner: Stage 1 Status, Live Speed Bonus, Penalties & Team Indicator */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl text-white shadow-xs font-black"
            style={{ backgroundColor: activeTeam.color }}
          >
            🕵️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-bold text-white"
                style={{ backgroundColor: activeTeam.color }}
              >
                {activeTeam.name}
              </span>
              {activeTeam.members && activeTeam.members.trim() && (
                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  👥 {activeTeam.members}
                </span>
              )}
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                1단계 게임
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              실제 냉장고 식품 보관의 오류 찾기
            </h1>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Stopwatch */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-center min-w-[100px] shadow-xs">
            <span className="block text-[10px] text-slate-400 font-sans">탐색 시간</span>
            <span className="text-base font-bold text-yellow-300">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          {/* Speed Bonus: Decreases as time goes by */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center min-w-[95px]">
            <span className="block text-[10px] text-amber-700 font-medium flex items-center justify-center gap-0.5">
              <Zap className="w-3 h-3 text-amber-600" />
              스피드 보너스
            </span>
            <span className="text-base font-black text-amber-600">
              +{currentSpeedBonus}점
            </span>
          </div>

          {/* Resolved Errors Count */}
          <div className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-center min-w-[85px]">
            <span className="block text-[10px] text-sky-600 font-medium">찾은 오류</span>
            <span className="text-base font-extrabold text-sky-700">
              {resolvedErrorIds.length} / {TARGET_ERRORS_COUNT}개
            </span>
          </div>

          {/* Penalty Deductions */}
          {wrongCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-center min-w-[85px] animate-in zoom-in-95 duration-150">
              <span className="block text-[10px] text-rose-600 font-medium">오답 감점</span>
              <span className="text-base font-extrabold text-rose-600">
                -{wrongCount * 30}점 ({wrongCount}회)
              </span>
            </div>
          )}

          {/* Live Estimated Score */}
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center min-w-[85px]">
            <span className="block text-[10px] text-emerald-600 font-medium">예상 총점</span>
            <span className="text-base font-black text-emerald-700">
              {isCompleted ? finalCalculatedScore : liveEstimatedScore}점
            </span>
          </div>
        </div>
      </div>

      {/* Normal Item Quick Flash Toast */}
      {normalItemNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs animate-in fade-in duration-150">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{normalItemNotice}</span>
        </div>
      )}

      {/* Instruction & Scoring Rule Bar */}
      <div className="bg-slate-100 rounded-xl px-4 py-2.5 border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-2">
        <div className="flex items-center gap-2 font-medium">
          <Search className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            실제 냉장고를 살피며 <strong>잘못 보관된 식품을 찾아 클릭</strong>해 보세요!
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px]">
          <span className="flex items-center gap-1 text-amber-700">
            <Timer className="w-3.5 h-3.5" />
            빨리 찾을수록 스피드 보너스 UP!
          </span>
          <span className="flex items-center gap-1 text-rose-600">
            <AlertTriangle className="w-3.5 h-3.5" />
            진단 오답 시 -30점 감점
          </span>
        </div>
      </div>

      {/* REALISTIC REFRIGERATOR APPLIANCE */}
      <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-4 border-slate-400 shadow-2xl">
        {/* Top Digital Display Bar on Refrigerator Exterior */}
        <div className="mb-3 px-4 py-2 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between text-xs text-white shadow-inner">
          <div className="flex items-center gap-2 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sky-300 font-bold">SMART REFRIGERATOR</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300">
            <span>냉동실 <strong className="text-sky-300">-18℃</strong></span>
            <span>냉장실 <strong className="text-teal-300">3℃</strong></span>
          </div>
        </div>

        {/* Refrigerator Interior Compartments Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          
          {/* [LEFT DOOR]: 냉동실 (Freezer) */}
          <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-sky-100 border-2 border-sky-300 p-3 shadow-inner flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-sky-200/80">
              <div className="flex items-center gap-1.5 font-black text-sky-900 text-xs">
                <span className="text-base">❄️</span>
                <span>냉동실</span>
              </div>
              <span className="text-[10px] text-sky-600 font-bold">FROZEN ZONE</span>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-between">
              {/* 냉동실 상단 선반 */}
              <div className="rounded-xl border-2 border-sky-300 bg-white/90 p-2.5 min-h-[140px] flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-800 mb-2">
                  <span>{STORAGE_ZONES.FREEZER_TOP.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">선반</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FoodItemButton
                    emoji="🥟"
                    name="냉동만두"
                    onClick={() => handleInspectNormalItem('냉동만두', '냉동식품은 냉동실 상단에 바르게 보관되어 있습니다.')}
                  />
                  <FoodItemButton
                    emoji="🐟"
                    name="국물용 멸치"
                    onClick={() => handleInspectNormalItem('국물용 멸치', '건어물 멸치는 산패와 눅눅해짐을 막기 위해 냉동실 상단에 바르게 보관되어 있습니다.')}
                  />
                  <FoodItemButton
                    emoji="🍞"
                    name="냉동 식빵"
                    onClick={() => handleInspectNormalItem('냉동 식빵', '오래 보관할 식빵은 1회분씩 밀봉하여 냉동실에 보관되어 있습니다.')}
                  />

                  {/* 오류 1: 소분하지 않고 비닐 덩어리로 던져진 생고기 */}
                  {renderErrorButton('err-unsealed-raw-meat', '🥩', '비닐 덩어리 생고기')}
                </div>
              </div>

              {/* 냉동실 하단 서랍 */}
              <div className="rounded-xl border-2 border-sky-400 bg-sky-50/80 p-2.5 min-h-[155px] flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-800 mb-2">
                  <span>{STORAGE_ZONES.FREEZER_BOTTOM.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">하단 서랍</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FoodItemButton
                    emoji="🏷️"
                    name="소분 육류"
                    onClick={() => handleInspectNormalItem('소분 육류', '1회분씩 소분하여 날짜를 적어 냉동실 하단에 바르게 보관되어 있습니다.')}
                  />
                  <FoodItemButton
                    emoji="🐟"
                    name="손질 생선"
                    onClick={() => handleInspectNormalItem('손질 생선', '내장을 제거하고 세척 후 밀봉하여 냉동실 하단에 바르게 보관되어 있습니다.')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* [CENTER BODY]: 냉장실 본체 (Main Fridge) */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-50 via-teal-50/40 to-slate-100 border-2 border-teal-300 p-3 shadow-inner flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-teal-200/80">
              <div className="flex items-center gap-1.5 font-black text-teal-950 text-xs">
                <span className="text-base">🧊</span>
                <span>냉장실</span>
              </div>
              <span className="text-[10px] text-teal-600 font-bold">FRESH ZONE</span>
            </div>

            <div className="space-y-2.5 flex-1 flex flex-col justify-between">
              {/* 냉장실 상단 선반 */}
              <div className="rounded-xl border-2 border-teal-300 bg-white/90 p-2.5 min-h-[90px] flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-800 mb-1.5">
                  <span>{STORAGE_ZONES.FRIDGE_TOP.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">상단 선반</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FoodItemButton
                    emoji="🥣"
                    name="밀폐 반찬"
                    onClick={() => handleInspectNormalItem('밀폐 반찬', '조리된 반찬은 밀폐 용기에 담아 냉장실 상단에 바르게 보관되어 있습니다.')}
                  />

                  {/* 오류 2: 뜨거운 찌개 냄비 */}
                  {renderErrorButton('err-hot-soup', '🍲', '김 나는 찌개 냄비')}

                  {/* 오류 3: 위 칸에 놓인 개봉된 생소고기 */}
                  {renderErrorButton('err-meat-top', '🥩', '생소고기 접시')}

                  {/* 오류 4: 개봉된 참치 캔 */}
                  {renderErrorButton('err-open-can', '🥫', '개봉된 참치 캔')}
                </div>
              </div>

              {/* 냉장실 중단 선반 */}
              <div className="rounded-xl border-2 border-blue-300 bg-white/90 p-2.5 min-h-[95px] flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-800 mb-1.5">
                  <span>{STORAGE_ZONES.FRIDGE_MID.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">중단 선반</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FoodItemButton
                    emoji="🍗"
                    name="당일 생닭"
                    onClick={() => handleInspectNormalItem('당일 생닭', '1~2일 내 조리할 생닭은 밀폐 용기에 담아 중간 칸에 바르게 보관되어 있습니다.')}
                  />

                  {/* 오류 5: 냉장실에 들어간 바나나 */}
                  {renderErrorButton('err-banana', '🍌', '바나나 송이')}

                  {/* 오류 6: 꽉 채워진 반찬통들 (70% 초과) */}
                  {renderErrorButton('err-overfilled', '📦', '꽉 채운 반찬통들')}
                </div>
              </div>

              {/* 신선 야채실 투명 서랍 */}
              <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50/70 p-2.5 min-h-[110px] flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-800 mb-1.5">
                  <span>{STORAGE_ZONES.FRIDGE_BOTTOM.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">채소·과일 서랍</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FoodItemButton
                    emoji="🥬"
                    name="밀폐 시금치"
                    onClick={() => handleInspectNormalItem('밀폐 시금치', '채소는 씻어서 물기를 닦고 밀폐 용기에 담아 야채실에 바르게 보관되어 있습니다.')}
                  />
                  <FoodItemButton
                    emoji="🍇"
                    name="포도"
                    onClick={() => handleInspectNormalItem('포도', '과일류는 채소와 칸을 나누어 야채실에 바르게 보관되어 있습니다.')}
                  />

                  {/* 오류 7: 야채실 구석의 감자 */}
                  {renderErrorButton('err-potato', '🥔', '비닐 속 감자')}
                </div>
              </div>
            </div>
          </div>

          {/* [RIGHT DOOR & PANTRY]: 도어 포켓 + 실온 보관 바구니 */}
          <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
            {/* 도어 포켓 */}
            <div className="rounded-2xl bg-gradient-to-b from-amber-50 via-white to-amber-50/60 border-2 border-amber-300 p-3 shadow-inner flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-amber-200/80">
                <div className="flex items-center gap-1.5 font-black text-amber-900 text-xs">
                  <span className="text-base">🚪</span>
                  <span>도어 포켓</span>
                </div>
                <span className="text-[10px] text-amber-600 font-bold">DOOR RACK</span>
              </div>

              <div className="rounded-xl border-2 border-amber-300 bg-white/95 p-2.5 flex-1 min-h-[135px] flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-800 mb-2">
                  <span>{STORAGE_ZONES.FRIDGE_DOOR.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">문 쪽</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FoodItemButton
                    emoji="🥛"
                    name="우유"
                    onClick={() => handleInspectNormalItem('우유', '자주 꺼내 마시는 우유와 음료는 도어 포켓에 바르게 보관되어 있습니다.')}
                  />

                  {/* 오류 8: 거꾸로 꽂힌 달걀 (뾰족한 쪽이 위로) */}
                  {renderErrorButton('err-egg-upside-down', '🥚', '달걀 팩')}
                </div>
              </div>
            </div>

            {/* 실온 보관 바구니 */}
            <div className="rounded-2xl bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100/70 border-2 border-orange-300 p-3 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-orange-200">
                <div className="flex items-center gap-1.5 font-black text-orange-950 text-xs">
                  <span className="text-base">🧺</span>
                  <span>실온 보관 바구니</span>
                </div>
                <span className="text-[10px] text-orange-600 font-bold">PANTRY</span>
              </div>

              <div className="rounded-xl border-2 border-orange-300 bg-white/90 p-2.5 min-h-[110px] flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-800 mb-2">
                  <span>{STORAGE_ZONES.ROOM_TEMP.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">바구니</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FoodItemButton
                    emoji="🧅"
                    name="양파 & 마늘 망"
                    onClick={() => handleInspectNormalItem('통양파 & 마늘', '통풍이 잘되는 서늘한 그늘에 바르게 보관되어 있습니다.')}
                  />
                  <FoodItemButton
                    emoji="🥫"
                    name="미개봉 통조림"
                    onClick={() => handleInspectNormalItem('미개봉 통조림', '미개봉 통조림은 실온에 바르게 보관되어 있습니다.')}
                  />
                  <FoodItemButton
                    emoji="🍙"
                    name="김"
                    onClick={() => handleInspectNormalItem('김', '김은 습기와 직사광선을 피해 서늘하고 건조한 실온 보관 바구니에 바르게 보관되어 있습니다.')}
                  />
                  <FoodItemButton
                    emoji="🍞"
                    name="식빵"
                    onClick={() => handleInspectNormalItem('식빵', '식빵은 밀봉하여 실온 보관 바구니에 바르게 보관되어 있습니다.')}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Completion Banner when Target Reached with Detailed Score Breakdown & Confetti */}
      {isCompleted && (() => {
        const celebration =
          finalCalculatedScore >= 950
            ? {
                badge: '👑 전설의 식품 보관 마스터',
                badgeBg: 'bg-amber-400 text-amber-950',
                title: `${activeTeam.name}, 경이로운 초고속 진단 달성!`,
                desc: '빛처럼 빠른 눈썰미와 완벽한 보관 지식으로 냉장고 속 모든 오류를 순식간에 제압했습니다! 명예의 전당 최상위 기록 후보입니다.',
                gradient: 'from-amber-600 via-emerald-600 to-teal-700',
              }
            : finalCalculatedScore >= 800
            ? {
                badge: '🌟 특급 냉장고 보안관',
                badgeBg: 'bg-teal-300 text-teal-950',
                title: `${activeTeam.name}, 뛰어난 실력으로 냉장고 수호 완료!`,
                desc: '신속한 판단과 침착한 진단으로 오류 6가지를 훌륭하게 해결했습니다. 2단계 스피드 레이스에서도 멋진 활약을 기대합니다!',
                gradient: 'from-emerald-600 via-teal-600 to-sky-700',
              }
            : finalCalculatedScore >= 650
            ? {
                badge: '👏 열정의 보관 탐정',
                badgeBg: 'bg-sky-300 text-sky-950',
                title: `${activeTeam.name}, 침착하게 모든 오류 해결!`,
                desc: '수업시간에 배운 보관 과학 원리를 바탕으로 꼼꼼하게 살피며 6대 보관 실수를 잘 바로잡았습니다! 참 잘했어요!',
                gradient: 'from-teal-600 via-cyan-600 to-blue-700',
              }
            : {
                badge: '🌱 끈기의 보관 새싹',
                badgeBg: 'bg-indigo-300 text-indigo-950',
                title: `${activeTeam.name}, 끝까지 포기하지 않고 완주 성공!`,
                desc: '오답이 있었지만 침착하게 원인을 분석하여 모든 오류를 찾아냈습니다! 다음 도전에서는 더 빠른 속도를 노려보세요!',
                gradient: 'from-indigo-600 via-purple-600 to-pink-700',
              };

        return (
          <>
            {/* CSS-based Confetti Animation */}
            <CssConfetti count={60} />

            <div className={`bg-gradient-to-r ${celebration.gradient} rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden`}>
              {/* Score-based Congratulatory Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-4xl shadow-inner shrink-0">
                    🏆
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-slate-900 shadow-2xs">
                        {activeTeam.name}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${celebration.badgeBg} shadow-2xs`}>
                        {celebration.badge}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight">
                      {celebration.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-2xl font-medium">
                      {celebration.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.click();
                    onGoToStage2();
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>2단계 스피드 레이스로 이동</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Detailed Score Calculation Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/25 backdrop-blur-xs rounded-2xl p-4 text-center border border-white/10">
                <div>
                  <span className="block text-[11px] text-white/80">탐색 소요 시간</span>
                  <span className="text-lg font-black font-mono text-yellow-300">
                    {formatTime(elapsedSeconds)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-white/80">기본 탐정 점수</span>
                  <span className="text-lg font-black text-white">
                    +{TARGET_ERRORS_COUNT * 100}점
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-white/80">스피드 보너스</span>
                  <span className="text-lg font-black text-amber-300">
                    +{currentSpeedBonus}점
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-white/80">오답 감점</span>
                  <span className="text-lg font-black text-rose-300">
                    -{wrongCount * 30}점 ({wrongCount}회)
                  </span>
                </div>
              </div>

              <div className="pt-1 border-t border-white/20 flex flex-wrap items-center justify-between text-xs text-white/90">
                <span>1단계 최종 획득 점수: <strong className="text-base text-yellow-300 font-black">+{finalCalculatedScore}점</strong></span>
                <span className="text-[11px] text-white/70">칠판 게시판에 모둠 기록이 실시간으로 저장되었습니다</span>
              </div>
            </div>
          </>
        );
      })()}

      {/* Error Diagnosis Modal */}
      {selectedError && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl shadow-inner">
                  {selectedError.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                      보관 오류 진단 탐정
                    </span>
                    <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded font-bold">
                      오답 시 -30점 감점
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {selectedError.problemTitle}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedError(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
              {selectedError.question}
            </div>

            {/* Modal Live Feedback (Error alert or Success alert) */}
            {modalFeedback && (
              <div
                className={`p-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
                  hasSolvedCurrent
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950 animate-shake'
                }`}
              >
                {hasSolvedCurrent ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{modalFeedback}</span>
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-2">
              {selectedError.options.map((option, idx) => {
                const isSelected = selectedOptionIdx === idx;
                const isFailedChoice = wrongOptionIndices.includes(idx);
                const isCorrectOption = option.isCorrect;

                let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                if (hasSolvedCurrent && isCorrectOption) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400';
                } else if (isFailedChoice) {
                  btnStyle = 'border-rose-300 bg-rose-50 text-rose-800 line-through opacity-75';
                }

                return (
                  <button
                    key={idx}
                    disabled={hasSolvedCurrent || isFailedChoice}
                    onClick={() => handleSubmitAnswer(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Action after answering */}
            {hasSolvedCurrent && selectedOptionIdx !== null && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-950 text-xs sm:text-sm leading-relaxed">
                  <p className="font-bold mb-1">💡 교과서 과학 원리</p>
                  <p>{selectedError.options[selectedOptionIdx].explanation}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedError(null)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    확인 및 냉장고로 돌아가기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Helper for normal food item (uniform look, no hint)
  function FoodItemButton({ emoji, name, onClick }: { emoji: string; name: string; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 shadow-2xs hover:border-slate-400 hover:bg-slate-50 text-xs font-medium text-slate-800 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
      >
        <span className="text-base">{emoji}</span>
        <span>{name}</span>
      </button>
    );
  }

  // Helper for error food item: LOOKS UNIFORM like a normal item until resolved!
  function renderErrorButton(errorId: string, emoji: string, name: string) {
    const errorItem = allErrors.find((e) => e.id === errorId);
    if (!errorItem) return null;

    const resolved = isResolved(errorId);

    return (
      <button
        onClick={() => handleInspectError(errorItem)}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
          resolved
            ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs'
            : 'bg-white border border-slate-300 shadow-2xs hover:border-slate-400 hover:bg-slate-50 text-slate-800'
        }`}
      >
        <span className="text-base">{emoji}</span>
        <span>{name}</span>
        {resolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />}
      </button>
    );
  }
};
