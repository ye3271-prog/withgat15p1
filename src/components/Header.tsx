import React from 'react';
import { Volume2, VolumeX, Trophy, Users, RotateCcw } from 'lucide-react';
import { GamePhase, Team } from '../types/game';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentPhase: GamePhase;
  activeTeam: Team | null;
  teams: Team[];
  onSelectPhase: (phase: GamePhase) => void;
  onOpenLeaderboard: () => void;
  onResetGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isConnected?: boolean;
  connectedClients?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPhase,
  activeTeam,
  onSelectPhase,
  onOpenLeaderboard,
  onResetGame,
  isMuted,
  onToggleMute,
  isConnected = false,
  connectedClients = 1,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onSelectPhase('TEAM_SELECT')}
            className="flex items-center gap-2 text-left group transition-transform active:scale-95"
            title="모둠 활동판으로 이동"
          >
            <span className="text-2xl" role="img" aria-label="냉장고">🧊</span>
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors truncate block">
                냉장고를 부탁해!
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                식품 보관은 어떻게?
              </span>
            </div>
          </button>

          {activeTeam && (
            <div
              className="hidden md:flex flex-col justify-center px-2.5 py-1 rounded-lg text-xs font-semibold text-white shadow-xs max-w-[240px]"
              style={{ backgroundColor: activeTeam.color }}
            >
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="truncate font-bold">{activeTeam.name}</span>
                <span className="opacity-80 text-[10px] font-normal shrink-0">선택됨</span>
              </div>
              {activeTeam.members && activeTeam.members.trim() && (
                <span className="text-[10px] opacity-90 truncate leading-tight mt-0.5 font-normal">
                  👥 {activeTeam.members}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Stage Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onSelectPhase('TEAM_SELECT')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              currentPhase === 'TEAM_SELECT'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">7모둠 활동판</span>
            <span className="md:hidden">모둠</span>
          </button>

          <button
            onClick={() => onSelectPhase('STAGE1_INTRO')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              currentPhase.startsWith('STAGE1')
                ? 'bg-sky-100 text-sky-800 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            1단계: 오류 찾기
          </button>

          <button
            onClick={() => onSelectPhase('STAGE2_INTRO')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              currentPhase.startsWith('STAGE2')
                ? 'bg-indigo-100 text-indigo-800 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            2단계: 스피드 보관
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Real-time Connection Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title={isConnected ? `실시간 연동 중 (접속 기기: ${connectedClients}대)` : '연동 연결 시도 중...'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isConnected ? `실시간 연동됨 (${connectedClients}대)` : '연결 중'}</span>
          </div>

          <button
            onClick={() => {
              sound.click();
              onOpenLeaderboard();
            }}
            className="px-3 py-1.5 text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-2xs"
            title="모둠별 성적 및 칠판 게시판"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>칠판 게시판</span>
          </button>

          <button
            onClick={() => {
              onToggleMute();
              sound.isMuted = !isMuted;
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
          </button>

          <button
            onClick={onResetGame}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="모둠 전체 기록 초기화"
            aria-label="게임 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
