import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Award,
  Hand,
  ShoppingCart,
  Refrigerator,
  HelpCircle,
  X,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Team, GroceryItem, StorageZoneId } from '../types/game';
import { GROCERY_ITEMS, SHOPPING_AND_STORAGE_RULES } from '../data/foodData';
import { sound } from '../utils/audio';
import { CssConfetti } from './CssConfetti';

interface Stage2SpeedStorageProps {
  activeTeam: Team;
  onCompleteStage2: (score: number, timeSeconds: number, correctCount: number, totalCount: number) => void;
  onGoToLeaderboard: () => void;
  onBackToLobby: () => void;
}

// Generate the queue strictly following reverse purchase order (Storage Order 1 to 6)
const createOrderedQueue = (): GroceryItem[] => {
  return [1, 2, 3, 4, 5, 6].flatMap((order) => {
    const group = GROCERY_ITEMS.filter((item) => item.storageOrder === order);
    return group.sort(() => Math.random() - 0.5);
  });
};

export const Stage2SpeedStorage: React.FC<Stage2SpeedStorageProps> = ({
  activeTeam,
  onCompleteStage2,
  onGoToLeaderboard,
  onBackToLobby: _onBackToLobby,
}) => {
  const [itemsQueue, setItemsQueue] = useState<GroceryItem[]>(createOrderedQueue);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalCalculatedScore, setFinalCalculatedScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hoveredZoneId, setHoveredZoneId] = useState<StorageZoneId | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Stored items inside refrigerator compartments
  const [storedItemsByZone, setStoredItemsByZone] = useState<Record<StorageZoneId, GroceryItem[]>>({
    FREEZER_TOP: [],
    FREEZER_BOTTOM: [],
    FRIDGE_TOP: [],
    FRIDGE_MID: [],
    FRIDGE_BOTTOM: [],
    FRIDGE_DOOR: [],
    ROOM_TEMP: [],
  });

  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);

  const [shakeZoneId, setShakeZoneId] = useState<StorageZoneId | null>(null);
  const timerRef = useRef<number | null>(null);

  // Touch & Pointer drag state for tablets/touchscreens
  const [touchDragging, setTouchDragging] = useState(false);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Timer loop
  useEffect(() => {
    if (isPlaying && !isFinished) {
      const startTime = performance.now() - elapsedTimeMs;
      timerRef.current = window.setInterval(() => {
        setElapsedTimeMs(performance.now() - startTime);
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished, elapsedTimeMs]);

  const currentItem = itemsQueue[currentItemIdx];

  const handleStartGame = () => {
    sound.click();
    const ordered = createOrderedQueue();
    setItemsQueue(ordered);
    setCurrentItemIdx(0);
    setElapsedTimeMs(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    setStoredItemsByZone({
      FREEZER_TOP: [],
      FREEZER_BOTTOM: [],
      FRIDGE_TOP: [],
      FRIDGE_MID: [],
      FRIDGE_BOTTOM: [],
      FRIDGE_DOOR: [],
      ROOM_TEMP: [],
    });
    setFeedback(null);
    setHoveredZoneId(null);
    setIsFinished(false);
    setIsPlaying(true);
  };

  const handlePlaceItem = (zoneId: StorageZoneId) => {
    if (!isPlaying || isFinished || !currentItem) return;

    const isCorrect = currentItem.correctZoneId === zoneId;

    if (isCorrect) {
      sound.correct();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setCorrectCount((prev) => prev + 1);

      setStoredItemsByZone((prev) => ({
        ...prev,
        [zoneId]: [...prev[zoneId], currentItem],
      }));

      setFeedback({
        isCorrect: true,
        message: `${currentItem.name} 수납 성공! (${currentItem.purchaseCategory})`,
      });

      advanceNextItem();
    } else {
      sound.wrong();
      setCombo(0);
      setWrongCount((prev) => prev + 1);
      // Penalty: Add 3.0 seconds
      setElapsedTimeMs((prev) => prev + 3000);

      setShakeZoneId(zoneId);
      setTimeout(() => setShakeZoneId(null), 500);

      let penaltyMessage = `잘못된 위치입니다! (+3초 페널티)`;
      if (currentItem.id === 'item-bread' && zoneId.startsWith('FRIDGE_')) {
        penaltyMessage = `식빵은 냉장 보관 시 전분이 노화되어 빨리 딱딱해져요! 실온 보관하세요! (+3초)`;
      } else if (currentItem.id === 'item-gim' && zoneId.startsWith('FREEZER_')) {
        penaltyMessage = `김은 서늘하고 건조한 실온 보관 바구니에 보관합니다! (+3초)`;
      }

      setFeedback({
        isCorrect: false,
        message: penaltyMessage,
      });
    }
  };

  const advanceNextItem = () => {
    if (currentItemIdx + 1 >= itemsQueue.length) {
      finishGame();
    } else {
      setCurrentItemIdx((prev) => prev + 1);
    }
  };

  const finishGame = () => {
    setIsPlaying(false);
    setIsFinished(true);
    sound.fanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    const totalSeconds = Math.round(elapsedTimeMs / 1000);

    // Speed bonus calculation: Faster = higher score
    const speedBonus = Math.max(0, 1000 - totalSeconds * 12);
    const comboBonus = maxCombo * 20;
    const finalScore = Math.max(100, 500 + speedBonus + comboBonus);

    setFinalCalculatedScore(finalScore);
    onCompleteStage2(finalScore, totalSeconds, correctCount + 1, itemsQueue.length);
  };

  const formatTimeDisplay = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}.${hundredths < 10 ? '0' : ''}${hundredths}`;
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (!currentItem) return;
    e.dataTransfer.setData('text/plain', currentItem.id);
  };

  const handleDragOver = (e: React.DragEvent, zoneId: StorageZoneId) => {
    e.preventDefault();
    setHoveredZoneId(zoneId);
  };

  const handleDragLeave = () => {
    setHoveredZoneId(null);
  };

  const handleDrop = (e: React.DragEvent, zoneId: StorageZoneId) => {
    e.preventDefault();
    setHoveredZoneId(null);
    handlePlaceItem(zoneId);
  };

  // Pointer / Touch handlers for tablets
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!currentItem) return;
    setTouchDragging(true);
    setTouchPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchDragging) return;
    setTouchPos({ x: e.clientX, y: e.clientY });

    const elem = document.elementFromPoint(e.clientX, e.clientY);
    const zoneElem = elem?.closest('[data-zone-id]') as HTMLElement | null;
    if (zoneElem) {
      const zId = zoneElem.getAttribute('data-zone-id') as StorageZoneId;
      setHoveredZoneId(zId);
    } else {
      setHoveredZoneId(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!touchDragging) return;
    setTouchDragging(false);

    const elem = document.elementFromPoint(e.clientX, e.clientY);
    const zoneElem = elem?.closest('[data-zone-id]') as HTMLElement | null;
    if (zoneElem) {
      const zId = zoneElem.getAttribute('data-zone-id') as StorageZoneId;
      handlePlaceItem(zId);
    }
    setHoveredZoneId(null);
  };

  // Helper for rendering refrigerator interior compartments
  const renderCompartment = (
    zoneId: StorageZoneId,
    title: string,
    heightClass: string,
    customStyles: string = ''
  ) => {
    const isHovered = hoveredZoneId === zoneId;
    const isShaking = shakeZoneId === zoneId;
    const stored = storedItemsByZone[zoneId];

    return (
      <div
        data-zone-id={zoneId}
        onDragOver={(e) => handleDragOver(e, zoneId)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, zoneId)}
        onClick={() => handlePlaceItem(zoneId)}
        className={`relative rounded-xl p-2.5 transition-all flex flex-col justify-between cursor-pointer border-2 ${heightClass} ${customStyles} ${
          isHovered
            ? 'scale-[1.02] ring-3 ring-sky-400 bg-sky-100/90 shadow-lg'
            : ''
        } ${isShaking ? 'animate-shake border-rose-500 bg-rose-50' : ''}`}
      >
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 pointer-events-none">
          <span className="truncate">{title}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {stored.length > 0 ? `${stored.length}개 보관` : '비어있음'}
          </span>
        </div>

        {/* Display Stored Food Badges */}
        <div className="flex flex-wrap gap-1.5 my-1 overflow-y-auto max-h-[85px] pointer-events-none">
          {stored.map((it, idx) => (
            <span
              key={`${it.id}-${idx}`}
              className="px-2 py-0.5 rounded-lg bg-white/95 border border-slate-200/80 shadow-2xs text-[11px] font-semibold text-slate-800 flex items-center gap-1 animate-scale-in"
            >
              <span>{it.emoji}</span>
              <span className="truncate max-w-[80px]">{it.name}</span>
            </span>
          ))}
        </div>

        <div className="text-[10px] text-slate-400 italic text-center pointer-events-none">
          {isHovered ? '여기에 놓기 (드롭/클릭)' : '터치 또는 드롭하여 수납'}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4 select-none">
      {/* Top Banner: Minimal Info, Timer & Storage Order Modal Toggle */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl text-white shadow-xs font-black"
            style={{ backgroundColor: activeTeam.color }}
          >
            ⚡
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
                2단계 게임
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              장보기 순서 ➔ 역순 보관 스피드 레이스
            </h1>
          </div>
        </div>

        {/* Live Counters & Guide Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setShowOrderModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-700" />
            <span>장보기 ↔ 보관 순서</span>
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-center min-w-[110px] shadow-xs">
            <span className="block text-[10px] text-slate-400 font-sans">초시계</span>
            <span className="text-base sm:text-lg font-bold text-yellow-300">
              {formatTimeDisplay(elapsedTimeMs)}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-center min-w-[65px]">
            <span className="block text-[10px] text-indigo-600 font-medium">콤보</span>
            <span className="text-base font-extrabold text-indigo-700">
              {combo > 1 ? `🔥 ${combo}` : combo}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center min-w-[70px]">
            <span className="block text-[10px] text-emerald-600 font-medium">진행</span>
            <span className="text-base font-extrabold text-emerald-700">
              {correctCount} / {itemsQueue.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Screen */}
      {!isPlaying && !isFinished ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-6 my-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-4xl shadow-inner">
            🛒
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              장보기 역순 보관 스피드 레이스!
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              장바구니 속 <strong>{itemsQueue.length}개</strong>의 식재료를
              <strong>구매의 반대 순서(조리음식 ➔ 어패류 ➔ 육류 ➔ 냉장필요 ➔ 채소·과일 ➔ 실온)</strong>로
              꺼내어 실제 냉장고 칸으로 빠르게 쏙 넣으세요!
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 text-left space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>보관 원칙 핵심 3가지</span>
            </div>
            <p>• <strong>보관 순서는 구매의 역순:</strong> 가장 상하기 쉬운 조리음식, 어패류, 육류부터 최우선으로 냉장고에 수납합니다.</p>
            <p>• 식재료를 집어 알맞은 냉장고 선반/서랍/바구니로 <strong>드래그 & 드롭</strong>합니다. (칸 클릭도 가능)</p>
            <p>• 오답 시 <strong>+3초 페널티</strong>가 주어집니다.</p>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <span>스피드 레이스 시작!</span>
            <Zap className="w-5 h-5 text-yellow-300" />
          </button>
        </div>
      ) : isFinished ? (() => {
          const celebration =
            finalCalculatedScore >= 1150
              ? {
                  badge: '👑 신의 손! 초광속 수납왕',
                  badgeBg: 'bg-amber-400 text-amber-950',
                  title: `${activeTeam.name}, 전설적인 수납 스피드 달성!`,
                  desc: '환상적인 콤보와 눈부신 순발력으로 구매 역순(조리음식→어패류→육류→냉장식품→채소과일→실온) 원칙을 완벽히 지키며 수납을 완료했습니다!',
                  gradient: 'from-amber-600 via-indigo-600 to-purple-700',
                }
              : finalCalculatedScore >= 950
              ? {
                  badge: '⚡ 번개 수납의 달인',
                  badgeBg: 'bg-indigo-300 text-indigo-950',
                  title: `${activeTeam.name}, 신속정확한 멋진 레이스 완주!`,
                  desc: '높은 콤보와 흔들리지 않는 정확도로 보관 순서에 맞추어 모든 식재료를 제자리에 쏙 넣었습니다! 환상적인 팀워크를 보여주었습니다.',
                  gradient: 'from-indigo-600 via-sky-600 to-teal-700',
                }
              : finalCalculatedScore >= 750
              ? {
                  badge: '👍 알뜰살뜰 살림 정리왕',
                  badgeBg: 'bg-emerald-300 text-emerald-950',
                  title: `${activeTeam.name}, 꼼꼼하고 안전하게 수납 완료!`,
                  desc: '장보기 역순 보관 원리를 충실하게 지키며 17개 식재료를 무사히 정리했습니다! 참 잘했어요!',
                  gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
                }
              : {
                  badge: '🌈 칠전팔기 보관 원정대',
                  badgeBg: 'bg-sky-300 text-sky-950',
                  title: `${activeTeam.name}, 끝까지 포기하지 않고 완주!`,
                  desc: '페널티 속에서도 당황하지 않고 17종의 모든 식재료를 알맞은 구역에 보관해 냈습니다! 다음 도전엔 더 빠른 기록을 노려보세요!',
                  gradient: 'from-slate-700 via-sky-700 to-indigo-800',
                };

          return (
            <>
              <CssConfetti count={40} />
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${celebration.gradient} text-white p-6 sm:p-10 shadow-2xl space-y-6 animate-scale-in max-w-2xl mx-auto`}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    🎉
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-slate-900 shadow-2xs">
                        {activeTeam.name}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${celebration.badgeBg} shadow-2xs`}>
                        {celebration.badge}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight">
                      {celebration.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                      {celebration.desc}
                    </p>
                  </div>
                </div>

                {/* Score and Stats Grid */}
                <div className="grid grid-cols-3 gap-3 bg-black/25 backdrop-blur-xs rounded-2xl p-4 text-center border border-white/10">
                  <div>
                    <span className="block text-[11px] text-white/80">최종 소요 시간</span>
                    <span className="text-base sm:text-lg font-black text-yellow-300 font-mono">
                      {formatTimeDisplay(elapsedTimeMs)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-white/80">최대 콤보</span>
                    <span className="text-base sm:text-lg font-black text-emerald-300">
                      {maxCombo} 연속
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-white/80">오답 페널티</span>
                    <span className="text-base sm:text-lg font-black text-rose-300">
                      {wrongCount}회 (+{wrongCount * 3}초)
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between text-xs font-bold text-white border border-white/15">
                  <span>2단계 획득 점수</span>
                  <span className="text-xl font-black text-yellow-300 font-mono">
                    +{finalCalculatedScore}점
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    onClick={handleStartGame}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/40 hover:bg-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>다시 도전</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.click();
                      onGoToLeaderboard();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>칠판 게시판 확인</span>
                  </button>
                </div>
              </div>
            </>
          );
        })() : (
        <div className="space-y-4">
          {/* Storage Priority Progress Stepper Bar (구매의 반대 순서 1~6) */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="text-sm">🧊</span>
                <span>보관 진행 순서 (구매 역순):</span>
                <span className="text-indigo-600 font-extrabold">
                  {currentItem ? `보관 ${currentItem.storageOrder}단계 [${currentItem.purchaseCategory}]` : '완료'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                구매: 1➔6 | 보관: 6➔1 (반대의 순서)
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center text-[11px]">
              {[
                { order: 1, label: '1. 조리된 음식', icon: '🍲' },
                { order: 2, label: '2. 어패류', icon: '🐟' },
                { order: 3, label: '3. 육류', icon: '🥩' },
                { order: 4, label: '4. 냉장 필요식품', icon: '🥛' },
                { order: 5, label: '5. 채소, 과일류', icon: '🥬' },
                { order: 6, label: '6. 냉장 불필요', icon: '🧺' },
              ].map((step) => {
                const isCurrent = currentItem?.storageOrder === step.order;
                const isPast = currentItem ? currentItem.storageOrder > step.order : true;
                return (
                  <div
                    key={step.order}
                    className={`py-1.5 px-1 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300 scale-102'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span>{isPast && !isCurrent ? '✓' : step.icon}</span>
                    <span className="truncate">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Feedback Flash Toast */}
          {feedback && (
            <div
              className={`p-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900 animate-shake'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

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
                  {renderCompartment(
                    'FREEZER_TOP',
                    '냉동실 상단',
                    'min-h-[140px]',
                    'bg-white/90 border-sky-300 shadow-sm'
                  )}

                  {renderCompartment(
                    'FREEZER_BOTTOM',
                    '냉동실 하단 (서랍)',
                    'min-h-[155px]',
                    'bg-sky-50/80 border-sky-400 shadow-sm'
                  )}
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
                  {renderCompartment(
                    'FRIDGE_TOP',
                    '냉장실 상단',
                    'min-h-[90px]',
                    'bg-white/90 border-teal-300 shadow-sm'
                  )}

                  {renderCompartment(
                    'FRIDGE_MID',
                    '냉장실 중단',
                    'min-h-[95px]',
                    'bg-white/90 border-blue-300 shadow-sm'
                  )}

                  {renderCompartment(
                    'FRIDGE_BOTTOM',
                    '신선 야채실 (서랍)',
                    'min-h-[110px]',
                    'bg-emerald-50/70 border-emerald-400 shadow-sm'
                  )}
                </div>
              </div>

              {/* [RIGHT DOOR & PANTRY]: 도어 포켓 + 실온 보관 바구니 */}
              <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
                <div className="rounded-2xl bg-gradient-to-b from-amber-50 via-white to-amber-50/60 border-2 border-amber-300 p-3 shadow-inner flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-amber-200/80">
                    <div className="flex items-center gap-1.5 font-black text-amber-900 text-xs">
                      <span className="text-base">🚪</span>
                      <span>도어 포켓</span>
                    </div>
                    <span className="text-[10px] text-amber-600 font-bold">DOOR RACK</span>
                  </div>

                  {renderCompartment(
                    'FRIDGE_DOOR',
                    '도어 포켓',
                    'flex-1 min-h-[135px]',
                    'bg-white/95 border-amber-300 shadow-sm'
                  )}
                </div>

                <div className="rounded-2xl bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100/70 border-2 border-orange-300 p-3 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-orange-200">
                    <div className="flex items-center gap-1.5 font-black text-orange-950 text-xs">
                      <span className="text-base">🧺</span>
                      <span>실온 보관 바구니</span>
                    </div>
                    <span className="text-[10px] text-orange-600 font-bold">PANTRY</span>
                  </div>

                  {renderCompartment(
                    'ROOM_TEMP',
                    '실온 보관 바구니',
                    'min-h-[110px]',
                    'bg-white/90 border-orange-300 shadow-sm'
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* BOTTOM GROCERY DOCK: Drag source */}
          {currentItem && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  🛒
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-800">
                      장바구니 식재료
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-[11px] font-black text-indigo-700 border border-indigo-200">
                      보관 {currentItem.storageOrder}순위: {currentItem.purchaseCategory}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                      남은 수량: {itemsQueue.length - currentItemIdx}개
                    </span>
                  </div>
                  <p className="text-xs font-bold text-amber-700 mt-1 flex items-center gap-1">
                    <span>💡</span>
                    <span>{currentItem.storageTip}</span>
                  </p>
                </div>
              </div>

              {/* Draggable Grocery Card: No Spoiler Hints, Pure Food Card */}
              <div
                draggable
                onDragStart={handleDragStart}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="cursor-grab active:cursor-grabbing px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl shadow-lg border-2 border-amber-300 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 touch-none shrink-0"
              >
                <span className="text-3xl filter drop-shadow-xs">{currentItem.emoji}</span>
                <span className="text-lg font-black tracking-tight">
                  {currentItem.name}
                </span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs ml-1">
                  <Hand className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Ghost during Touch Drag on mobile/tablet */}
      {touchDragging && currentItem && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-sm border-2 border-white scale-110"
          style={{ left: `${touchPos.x}px`, top: `${touchPos.y}px` }}
        >
          <span className="text-2xl">{currentItem.emoji}</span>
          <span>{currentItem.name}</span>
        </div>
      )}

      {/* Shopping Order vs Storage Reverse Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    장보기(구매) 순서 ↔ 냉장고 보관(정리) 순서
                  </h3>
                  <p className="text-xs text-slate-500">
                    구매는 1➔6 순서, 보관은 반대의 순서(6➔1)로 넣어야 안전합니다!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {SHOPPING_AND_STORAGE_RULES.map((rule) => (
                <div
                  key={rule.step}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="sm:w-1/2 space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px]">
                        구매 {rule.purchaseOrder}단계
                      </span>
                      <span>{rule.icon}</span>
                      <span>{rule.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      예: {rule.examples}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      🛒 {rule.purchaseReason}
                    </p>
                  </div>

                  <div className="sm:w-1/2 p-2 rounded-lg bg-indigo-50 border border-indigo-100 space-y-0.5">
                    <div className="font-extrabold text-indigo-900 flex items-center justify-between text-[11px]">
                      <span>🧊 보관 {rule.storageOrder}순위</span>
                      <span className="text-[10px] text-indigo-600">
                        {rule.storageOrder === 1 ? '최우선 보관!' : '구매 역순'}
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-950 font-medium">
                      {rule.storageReason}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 space-y-1">
              <span className="font-bold flex items-center gap-1 text-sky-900">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                <span>왜 반대로 보관해야 할까요?</span>
              </span>
              <p className="text-slate-600 leading-snug">
                김밥, 고로케 등 즉석 조리음식과 어패류, 육류는 실온에서 식중독 세균이 가장 빠르게 번식하므로, 집에 오자마자 가장 먼저 냉장/냉동고에 신속히 넣어야 합니다!
              </p>
            </div>

            <button
              onClick={() => setShowOrderModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              확인 완료 (게임 계속하기)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
