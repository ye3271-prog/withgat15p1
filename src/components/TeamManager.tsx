import React, { useState } from 'react';
import { Plus, Sparkles, Award, ArrowRight, Zap, Search, Users, Edit3, Check } from 'lucide-react';
import { Team, GamePhase } from '../types/game';
import { sound } from '../utils/audio';

interface TeamManagerProps {
  teams: Team[];
  activeTeamId: string;
  onSelectTeam: (teamId: string) => void;
  onAddTeam: (name: string, color: string, members?: string) => void;
  onDeleteTeam: (teamId: string) => void;
  onUpdateTeamName: (teamId: string, name: string) => void;
  onUpdateTeamMembers: (teamId: string, members: string) => void;
  onResetTeamScore: (teamId: string) => void;
  onStartStage: (phase: GamePhase, teamId?: string) => void;
  onOpenLeaderboard: () => void;
}

const PRESET_COLORS = [
  '#0284c7', // Sky
  '#16a34a', // Emerald
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#e11d48', // Rose
  '#0891b2', // Cyan
  '#ea580c', // Orange
];

export const TeamManager: React.FC<TeamManagerProps> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  onAddTeam,
  onDeleteTeam,
  onUpdateTeamName,
  onUpdateTeamMembers,
  onResetTeamScore,
  onStartStage,
  onOpenLeaderboard,
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamMembers, setNewTeamMembers] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editingMembersTeamId, setEditingMembersTeamId] = useState<string | null>(null);
  const [editMembers, setEditMembers] = useState('');

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    sound.click();
    onAddTeam(newTeamName.trim(), selectedColor, newTeamMembers.trim());
    setNewTeamName('');
    setNewTeamMembers('');
  };

  const handleStartEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setEditName(team.name);
  };

  const handleSaveEdit = (teamId: string) => {
    if (editName.trim()) {
      onUpdateTeamName(teamId, editName.trim());
    }
    setEditingTeamId(null);
  };

  const handleStartEditMembers = (team: Team) => {
    setEditingMembersTeamId(team.id);
    setEditMembers(team.members || '');
  };

  const handleSaveMembers = (teamId: string) => {
    onUpdateTeamMembers(teamId, editMembers.trim());
    setEditingMembersTeamId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Classroom Introduction Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-teal-600 to-emerald-600 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>모둠 협동 게임 활동</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            ✿ &lt;같이 활동&gt; 냉장고를 부탁해! <br />
            식품 보관은 어떻게?
          </h1>

          <p className="text-sm sm:text-base text-sky-50 leading-relaxed max-w-2xl font-medium">
            모둠별로 게임을 통해 올바른 식품 보관 방법을 익혀봅시다! <br />
            1단계 식품 보관의 오류를 찾고, 2단계 장보기 후 올바른 식품 보관 스피드 최고 기록을 세워보세요!
          </p>

          {/* Activity Stage 1 & 2 Cards */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-900">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/60 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-lg shrink-0">
                1
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-sm text-slate-900">
                  <Search className="w-4 h-4 text-sky-600" />
                  <span>1단계: 식품 보관의 오류 찾기</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  냉장고 속 잘못된 보관 오류 6가지를 찾아 진단하고 올바른 보관 자리를 바로잡아요!
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/60 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg shrink-0">
                2
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-sm text-slate-900">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>2단계: 장보기 역순 보관 스피드 레이스</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  구매의 반대 순서(조리음식 ➔ 실온)로, 식재료를 알맞은 냉장고 구역에 가장 빠른 초시계로 수납해요!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Graphic */}
        <div className="absolute -right-6 -bottom-10 opacity-15 pointer-events-none text-9xl select-none">
          🧊
        </div>
      </div>

      {/* Classroom 7 Teams Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>참여 모둠 활동판</span>
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                총 {teams.length}모둠
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>휴대폰·PC 실시간 연동 활성화</span>
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              어느 기기(휴대폰, 태블릿, 전자칠판)에서나 점수와 모둠원 정보가 실시간으로 자동 동기화됩니다!
            </p>
          </div>

          <button
            onClick={onOpenLeaderboard}
            className="px-4 py-2.5 text-xs sm:text-sm font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-700" />
            <span>전체 모둠 칠판 게시판 열기</span>
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {teams.map((team, idx) => {
            const isSelected = team.id === activeTeamId;
            return (
              <div
                key={team.id}
                onClick={() => onSelectTeam(team.id)}
                className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/50 shadow-md ring-2 ring-sky-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Team Top Ribbon */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-xs shrink-0"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="text-xs font-black text-slate-400">
                        #{idx + 1}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="text-[11px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                        선택됨
                      </span>
                    )}
                  </div>

                  {/* Team Name / Edit */}
                  {editingTeamId === team.id ? (
                    <div className="flex items-center gap-1 mb-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 text-sm border border-slate-300 rounded-lg font-bold text-slate-800 w-full"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(team.id);
                          if (e.key === 'Escape') setEditingTeamId(null);
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit(team.id)}
                        className="px-2 py-1 text-xs bg-sky-600 text-white rounded-md font-bold cursor-pointer shrink-0"
                      >
                        저장
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group mb-1">
                      <h3 className="font-black text-slate-900 text-lg tracking-tight">
                        {team.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(team);
                        }}
                        className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="모둠 이름 수정"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>수정</span>
                      </button>
                    </div>
                  )}

                  {/* Team Members Input & Display */}
                  {editingMembersTeamId === team.id ? (
                    <div
                      className="mt-1 mb-3 p-2 bg-sky-50 rounded-xl border border-sky-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="block text-[10px] font-bold text-sky-800 mb-1">
                        모둠원 이름 입력 (쉼표로 구분)
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editMembers}
                          onChange={(e) => setEditMembers(e.target.value)}
                          placeholder="예: 김철수, 이영희, 박민수"
                          className="px-2 py-1 text-xs border border-sky-300 rounded-lg font-medium text-slate-800 w-full bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveMembers(team.id);
                            if (e.key === 'Escape') setEditingMembersTeamId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveMembers(team.id)}
                          className="px-2.5 py-1 text-xs bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shrink-0 cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>저장</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditMembers(team);
                      }}
                      className="mt-1 mb-3 px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 transition-colors flex items-center justify-between gap-1.5 text-xs group/member cursor-pointer"
                      title="클릭하여 모둠원 이름을 입력하거나 수정하세요"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Users className="w-3.5 h-3.5 text-slate-400 group-hover/member:text-sky-600 shrink-0" />
                        {team.members && team.members.trim() ? (
                          <span className="font-semibold text-slate-700 group-hover/member:text-sky-900 truncate text-[11px]">
                            {team.members}
                          </span>
                        ) : (
                          <span className="text-slate-400 group-hover/member:text-sky-600 text-[11px] font-medium flex items-center gap-1">
                            <Plus className="w-3 h-3" />
                            <span>모둠원 이름 적기</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-sky-600 font-bold opacity-0 group-hover/member:opacity-100 transition-opacity shrink-0">
                        수정
                      </span>
                    </div>
                  )}

                  {/* Team Progress Badges */}
                  <div className="space-y-1.5 py-3 border-t border-b border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">1단계 오류 탐정:</span>
                      <span className="font-bold text-slate-800">
                        {team.stage1Score > 0 ? (
                          <span className="text-sky-700 font-extrabold">
                            ⏱️ {team.stage1TimeSeconds > 0 ? `${team.stage1TimeSeconds}초 · ` : ''}+{team.stage1Score}점
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">미도전</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">2단계 스피드:</span>
                      <span className="font-bold text-slate-800">
                        {team.stage2TimeSeconds > 0 ? (
                          <span className="text-indigo-700 font-extrabold">
                            ⏱️ {team.stage2TimeSeconds}초 (+{team.stage2Score}점)
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">미도전</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-600 font-bold">모둠 총점:</span>
                      <span className="text-emerald-600 font-black text-sm">
                        {team.totalScore}점
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team Stage Action Buttons */}
                <div className="mt-4 pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartStage('STAGE1_INTRO', team.id);
                      }}
                      className="py-2.5 px-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>1단계 시작</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartStage('STAGE2_INTRO', team.id);
                      }}
                      className="py-2.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>2단계 시작</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`${team.name}의 기록을 초기화할까요?`)) {
                          onResetTeamScore(team.id);
                        }
                      }}
                      className="hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      기록 초기화
                    </button>

                    {teams.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`${team.name}을 삭제하시겠습니까?`)) {
                            onDeleteTeam(team.id);
                          }
                        }}
                        className="hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Team Inline Bar */}
        <form
          onSubmit={handleAddTeamSubmit}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3"
        >
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-sky-600" />
            <span>모둠 추가:</span>
          </div>

          <input
            type="text"
            placeholder="새 모둠 이름 (예: 8모둠 번개)"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            maxLength={15}
          />

          <input
            type="text"
            placeholder="모둠원 이름 (예: 철수, 영희)"
            value={newTeamMembers}
            onChange={(e) => setNewTeamMembers(e.target.value)}
            className="flex-1 min-w-[160px] px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />

          <div className="flex items-center gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                  selectedColor === c ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            추가
          </button>
        </form>
      </div>
    </div>
  );
};
