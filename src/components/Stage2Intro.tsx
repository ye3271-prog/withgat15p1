import React, { useState } from 'react';
import { Zap, ArrowRight, ArrowLeft, ShoppingCart, Refrigerator, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Team } from '../types/game';
import { sound } from '../utils/audio';
import { SHOPPING_AND_STORAGE_RULES } from '../data/foodData';

interface Stage2IntroProps {
  activeTeam: Team;
  onStartStage: () => void;
  onBackToLobby: () => void;
}

export const Stage2Intro: React.FC<Stage2IntroProps> = ({
  activeTeam,
  onStartStage,
  onBackToLobby,
}) => {
  const [activeTab, setActiveTab] = useState<'RULES' | 'GAME_GUIDE'>('RULES');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLobby}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>모둠 활동판으로 돌아가기</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
        {/* Stage Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                  활동 2단계
                </span>
                <span className="text-xs font-bold" style={{ color: activeTeam.color }}>
                  [{activeTeam.name}]
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                2단계: 장보기 순서 & 올바른 보관 스피드 레이스
              </h1>
            </div>
          </div>
        </div>

        {/* Tab Switcher: 핵심 구매&보관 순서 원칙 vs 게임 규칙 */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl max-w-md">
          <button
            onClick={() => {
              sound.click();
              setActiveTab('RULES');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'RULES'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>장보기 ↔ 보관 순서 원칙 (핵심)</span>
          </button>
          <button
            onClick={() => {
              sound.click();
              setActiveTab('GAME_GUIDE');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'GAME_GUIDE'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>스피드 레이스 규칙</span>
          </button>
        </div>

        {activeTab === 'RULES' ? (
          <div className="space-y-6">
            {/* Core Golden Rule Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  식품 안전의 황금법칙: 구매 순서와 보관 순서는 정반대!
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-amber-50 leading-relaxed font-medium">
                마트에서 장볼 때는 <strong>실온 식품부터 조리식품 순(1→6)</strong>으로 사고, <br />
                집에 와서 보관할 때는 <strong>조리식품부터 실온 식품 순(6→1, 반대의 순서!)</strong>으로 넣어야 합니다!
              </p>
            </div>

            {/* Step-by-Step Purchase vs Storage Comparison Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                <span>구매 순서 (1 ➔ 6)</span>
                <span className="text-indigo-600">보관 순서 (반대 순서: 6 ➔ 1)</span>
              </div>

              <div className="space-y-2">
                {SHOPPING_AND_STORAGE_RULES.map((rule) => (
                  <div
                    key={rule.step}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    {/* Left: Purchase Info */}
                    <div className="flex items-center gap-3 sm:w-1/2">
                      <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-black text-xs shrink-0">
                        {rule.purchaseOrder}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                          <span>{rule.icon}</span>
                          <span>{rule.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          예: {rule.examples}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          🛒 <strong>구매 이유:</strong> {rule.purchaseReason}
                        </p>
                      </div>
                    </div>

                    {/* Middle Arrow */}
                    <div className="hidden sm:flex items-center justify-center text-slate-300">
                      ➔
                    </div>

                    {/* Right: Storage Priority Info */}
                    <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 sm:w-1/2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-indigo-900 text-xs flex items-center gap-1">
                          <Refrigerator className="w-3.5 h-3.5 text-indigo-600" />
                          <span>보관 {rule.storageOrder}순위</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-200/70 text-indigo-800">
                          {rule.storageOrder === 1
                            ? '최우선 보관!'
                            : rule.storageOrder === 6
                            ? '마지막 여유 보관'
                            : '신속 보관'}
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-950 font-medium leading-tight">
                        🧊 {rule.storageReason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why is storage reverse? */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-sky-900">
                <Info className="w-4 h-4 text-sky-600 shrink-0" />
                <span>왜 보관은 구매 순서의 반대여야 할까요? (과학 원리)</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                김밥이나 고로케 같은 <strong>즉석 조리음식</strong>, 어패류, 육류는 실온에 머무는 시간이 길어질수록 <strong>식중독균(황색포도상구균, 살모넬라균 등)</strong>이 기하급수적으로 번식합니다.
                따라서 장바구니에서 가장 상하기 쉬운 <strong>[조리음식(김밥·고로케 등) ➔ 어패류 ➔ 육류]</strong>를 1초라도 먼저 냉장고에 넣고, 실온에 두어도 안전한 채소·과일과 통조림류는 맨 마지막에 정리해야 식품 안전을 완벽히 지킬 수 있습니다!
              </p>
            </div>

          </div>
        ) : (
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <p>
              장보기를 마치고 돌아온 모둠원들과 함께, <strong>보관 순서(조리음식 ➔ 어패류 ➔ 육류 ➔ 냉장필요 ➔ 채소·과일 ➔ 실온)</strong>에 맞추어
              각 식재료를 냉장고 속 알맞은 칸으로 가장 빠르게 수납해 보세요!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-sm">보관 순서별 순차 등장</h3>
                <p className="text-xs text-slate-500">
                  장바구니에서 <strong>보관 1순위(조리음식)부터 6순위(실온식품)</strong> 순서대로 식재료가 나옵니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-sm">콤보 점수 & 스피드전</h3>
                <p className="text-xs text-slate-500">
                  실수 없이 연속으로 올바른 냉장고 구역에 넣으면 콤보 보너스가 올라갑니다!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-sm">오답 시 +3초 페널티</h3>
                <p className="text-xs text-slate-500">
                  잘못된 구역에 넣으면 시간이 3초 지연되니 침착하게 올바른 칸을 찾으세요!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 hidden sm:block">
            {activeTab === 'RULES' ? '규칙을 확인했으면 스피드 레이스에 도전하세요!' : '준비되셨나요?'}
          </div>

          <button
            onClick={() => {
              sound.click();
              onStartStage();
            }}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 text-sm cursor-pointer ml-auto"
          >
            <span>장보기 역순 보관 레이스 시작!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
