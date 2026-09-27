import React from 'react';
import { ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { Team } from '../types/game';
import { sound } from '../utils/audio';

interface Stage1IntroProps {
  activeTeam: Team;
  onStartStage: () => void;
  onBackToLobby: () => void;
}

export const Stage1Intro: React.FC<Stage1IntroProps> = ({
  activeTeam,
  onStartStage,
  onBackToLobby,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLobby}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>모둠 활동판으로 돌아가기</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              🕵️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                  활동 1단계
                </span>
                <span className="text-xs font-bold" style={{ color: activeTeam.color }}>
                  [{activeTeam.name}]
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                1단계: 식품 보관의 오류 찾기
              </h1>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            냉장고 속 식재료들을 탐색하며 <strong>잘못된 보관 오류 6가지</strong>를 찾아내고 올바른 보관법을 진단해보세요!
            소요 시간에 따라 <strong>스피드 보너스 점수</strong>가 주어지며, 퀴즈 오답 시 <strong>감점</strong>이 있습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">냉장고 칸 탐색</h3>
              <p className="text-xs text-slate-500">
                냉동실, 냉장실 선반, 야채실, 문 쪽에 놓인 식품들을 살피고 잘못된 것을 클릭하세요.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">초스피드 보너스 (최대 +500점)</h3>
              <p className="text-xs text-slate-500">
                시간이 빠를수록 높은 스피드 보너스 점수가 부여됩니다. 초시계를 확인하며 빠르게 해결하세요!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">오답 시 감점 (-30점)</h3>
              <p className="text-xs text-slate-500">
                진단 퀴즈에서 오답을 선택하면 1회당 30점씩 감점되니 신중하게 생각하고 누르세요!
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>팁:</strong> 올바르게 잘 보관된 정상 식품을 클릭하면 보관 안내 메시지가 나타납니다.
              시간이 지체되면 스피드 보너스가 줄어드니 집중해서 찾아보세요!
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              sound.click();
              onStartStage();
            }}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 text-sm"
          >
            <span>1단계 탐정 미션 시작!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
