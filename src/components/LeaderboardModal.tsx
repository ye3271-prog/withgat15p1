import React, { useState } from 'react';
import { Trophy, Copy, Check, Users, ArrowRight } from 'lucide-react';
import { Team } from '../types/game';
import { sound } from '../utils/audio';

interface LeaderboardModalProps {
  teams: Team[];
  onClose: () => void;
  onSelectTeamAndPlay: (teamId: string) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  teams,
  onClose,
  onSelectTeamAndPlay,
}) => {
  const [copied, setCopied] = useState(false);

  // Sort teams by total score descending, then by stage 2 time ascending
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return (a.stage2TimeSeconds || 999) - (b.stage2TimeSeconds || 999);
  });

  const handleCopySummary = () => {
    sound.playClick();
    const dateStr = new Date().toLocaleDateString('ko-KR');
    const textRows = sortedTeams.map((t, idx) => {
      const s1 = t.stage1Score > 0 ? `${t.stage1TimeSeconds > 0 ? `${t.stage1TimeSeconds}초 ` : ''}${t.stage1Score}점` : '미완료';
      const s2 = t.stage2TimeSeconds > 0 ? `${t.stage2TimeSeconds}초(${t.stage2Score}점)` : '미완료';
      const membersStr = t.members && t.members.trim() ? ` (모둠원: ${t.members})` : '';
      return `${idx + 1}위: [${t.name}${membersStr}] 총점 ${t.totalScore}점 (1단계: ${s1} / 2단계: ${s2})`;
    }).join('\n');

    const fullReport = `🧊 [냉장고를 부탁해! 식품 보관 모둠 랭킹] (${dateStr})\n\n${textRows}\n\n식품 보관 수칙을 함께 실천합시다!`;

    navigator.clipboard.writeText(fullReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                모둠별 명예의 전당
              </h2>
              <p className="text-xs text-slate-500">
                1단계 오류 찾기와 2단계 스피드 보관 종합 순위표
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Podium Highlight (Top 3) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-2 pb-4">
          {/* 2nd Place */}
          <div className="text-center space-y-1">
            <div className="text-2xl">🥈</div>
            <div className="font-bold text-xs sm:text-sm text-slate-800 truncate">
              {sortedTeams[1]?.name || '-'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {sortedTeams[1]?.totalScore || 0}점
            </div>
            <div className="h-16 sm:h-20 bg-slate-100 rounded-t-xl flex items-center justify-center text-xs font-bold text-slate-400">
              2위
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center space-y-1">
            <div className="text-4xl animate-bounce">👑</div>
            <div className="font-black text-sm sm:text-base text-amber-700 truncate">
              {sortedTeams[0]?.name || '-'}
            </div>
            <div className="text-xs text-amber-600 font-mono font-bold">
              {sortedTeams[0]?.totalScore || 0}점
            </div>
            <div className="h-24 sm:h-28 bg-gradient-to-t from-amber-400 to-amber-200 rounded-t-xl flex items-center justify-center text-sm font-extrabold text-amber-950 shadow-inner">
              1위
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center space-y-1">
            <div className="text-2xl">🥉</div>
            <div className="font-bold text-xs sm:text-sm text-slate-800 truncate">
              {sortedTeams[2]?.name || '-'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {sortedTeams[2]?.totalScore || 0}점
            </div>
            <div className="h-12 sm:h-16 bg-amber-50/80 rounded-t-xl flex items-center justify-center text-xs font-bold text-amber-700">
              3위
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 sm:px-4 text-center">순위</th>
                <th className="py-3 px-3 sm:px-4">모둠 이름</th>
                <th className="py-3 px-2 sm:px-3 text-center">1단계 (오류)</th>
                <th className="py-3 px-2 sm:px-3 text-center">2단계 (스피드)</th>
                <th className="py-3 px-3 sm:px-4 text-right">총점</th>
                <th className="py-3 px-2 sm:px-3 text-center">도전</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedTeams.map((team, idx) => (
                <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 sm:px-4 text-center font-bold text-slate-900">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-900">
                    <div className="flex items-center gap-2 font-bold">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="truncate">{team.name}</span>
                    </div>
                    {team.members && team.members.trim() && (
                      <div className="text-[11px] text-slate-500 font-normal pl-4.5 truncate max-w-[200px]">
                        👥 {team.members}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center text-xs">
                    {team.stage1Score > 0 ? (
                      <span className="text-emerald-700 font-semibold">
                        {team.stage1TimeSeconds > 0 ? `${team.stage1TimeSeconds}초 ` : ''}({team.stage1Score}점)
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center text-xs">
                    {team.stage2TimeSeconds > 0 ? (
                      <span className="text-indigo-700 font-semibold">
                        {team.stage2TimeSeconds}초 ({team.stage2Score}점)
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-black text-slate-900 text-sm sm:text-base tabular-nums">
                    {team.totalScore}점
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center">
                    <button
                      onClick={() => onSelectTeamAndPlay(team.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors"
                    >
                      선택
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopySummary}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? '칠판 공유용 텍스트 복사됨!' : '선생님 칠판 공유용 텍스트 복사'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
