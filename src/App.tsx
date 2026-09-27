import React, { useState } from 'react';
import { GamePhase, Team } from './types/game';
import { INITIAL_TEAMS } from './data/foodData';
import { Header } from './components/Header';
import { TeamManager } from './components/TeamManager';
import { Stage1Intro } from './components/Stage1Intro';
import { Stage1ErrorHunter } from './components/Stage1ErrorHunter';
import { Stage2Intro } from './components/Stage2Intro';
import { Stage2SpeedStorage } from './components/Stage2SpeedStorage';
import { LeaderboardModal } from './components/LeaderboardModal';
import { sound } from './utils/audio';
import { useRealtimeTeams } from './hooks/useRealtimeTeams';

const DEFAULT_TEAMS: Team[] = INITIAL_TEAMS.map((t) => ({
  id: t.id,
  name: t.name,
  color: t.color,
  stage1Score: 0,
  stage1FoundCount: 0,
  stage1TimeSeconds: 0,
  stage2Score: 0,
  stage2TimeSeconds: 0,
  stage2CorrectCount: 0,
  stage2TotalCount: 0,
  totalScore: 0,
  isCompleted: false,
}));

export default function App() {
  const {
    teams,
    connectedClients,
    isConnected,
    updateTeam,
    updateAllTeams,
    resetAllTeams,
  } = useRealtimeTeams(DEFAULT_TEAMS);

  const [activeTeamId, setActiveTeamId] = useState<string>(() => teams[0]?.id || 'team-1');
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('TEAM_SELECT');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];

  const handleSelectTeam = (teamId: string) => {
    sound.click();
    setActiveTeamId(teamId);
  };

  const handleAddTeam = (name: string, color: string) => {
    const newId = `team-${Date.now()}`;
    const newTeam: Team = {
      id: newId,
      name,
      color,
      stage1Score: 0,
      stage1FoundCount: 0,
      stage1TimeSeconds: 0,
      stage2Score: 0,
      stage2TimeSeconds: 0,
      stage2CorrectCount: 0,
      stage2TotalCount: 0,
      totalScore: 0,
      isCompleted: false,
    };
    updateAllTeams([...teams, newTeam]);
    setActiveTeamId(newId);
  };

  const handleDeleteTeam = (teamId: string) => {
    sound.click();
    const filtered = teams.filter((t) => t.id !== teamId);
    updateAllTeams(filtered);
    if (activeTeamId === teamId && filtered.length > 0) {
      setActiveTeamId(filtered[0].id);
    }
  };

  const handleUpdateTeamName = (teamId: string, name: string) => {
    const target = teams.find((t) => t.id === teamId);
    if (target) {
      updateTeam({ ...target, name });
    }
  };

  const handleUpdateTeamMembers = (teamId: string, members: string) => {
    const target = teams.find((t) => t.id === teamId);
    if (target) {
      updateTeam({ ...target, members });
    }
  };

  const handleResetTeamScore = (teamId: string) => {
    sound.click();
    const target = teams.find((t) => t.id === teamId);
    if (target) {
      updateTeam({
        ...target,
        stage1Score: 0,
        stage1FoundCount: 0,
        stage1TimeSeconds: 0,
        stage2Score: 0,
        stage2TimeSeconds: 0,
        stage2CorrectCount: 0,
        stage2TotalCount: 0,
        totalScore: 0,
        isCompleted: false,
      });
    }
  };

  const handleResetAll = () => {
    if (confirm('모든 7개 모둠의 점수와 기록을 처음 상태로 초기화할까요?')) {
      sound.click();
      resetAllTeams();
      setCurrentPhase('TEAM_SELECT');
    }
  };

  const handleStartStage = (phase: GamePhase, teamId?: string) => {
    if (teamId) {
      setActiveTeamId(teamId);
    }
    setCurrentPhase(phase);
  };

  const handleCompleteStage1 = (score: number, foundCount: number, timeSeconds: number) => {
    const current = teams.find((t) => t.id === activeTeamId);
    if (current) {
      const newStage1Score = Math.max(current.stage1Score, score);
      const totalScore = newStage1Score + current.stage2Score;
      const updated: Team = {
        ...current,
        stage1Score: newStage1Score,
        stage1FoundCount: Math.max(current.stage1FoundCount, foundCount),
        stage1TimeSeconds: current.stage1TimeSeconds === 0 ? timeSeconds : Math.min(current.stage1TimeSeconds, timeSeconds),
        totalScore,
      };
      updateTeam(updated);
    }
  };

  const handleCompleteStage2 = (
    score: number,
    timeSeconds: number,
    correctCount: number,
    totalCount: number
  ) => {
    const current = teams.find((t) => t.id === activeTeamId);
    if (current) {
      const newStage2Score = Math.max(current.stage2Score, score);
      const totalScore = current.stage1Score + newStage2Score;
      const bestTime = current.stage2TimeSeconds === 0 ? timeSeconds : Math.min(current.stage2TimeSeconds, timeSeconds);
      const updated: Team = {
        ...current,
        stage2Score: newStage2Score,
        stage2TimeSeconds: bestTime,
        stage2CorrectCount: Math.max(current.stage2CorrectCount, correctCount),
        stage2TotalCount: totalCount,
        totalScore,
        isCompleted: true,
      };
      updateTeam(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-sky-200">
      {/* Top Universal Classroom Header */}
      <Header
        currentPhase={currentPhase}
        activeTeam={activeTeam}
        teams={teams}
        onSelectPhase={(phase) => setCurrentPhase(phase)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onResetGame={handleResetAll}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        isConnected={isConnected}
        connectedClients={connectedClients}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentPhase === 'TEAM_SELECT' && (
          <TeamManager
            teams={teams}
            activeTeamId={activeTeamId}
            onSelectTeam={handleSelectTeam}
            onAddTeam={handleAddTeam}
            onDeleteTeam={handleDeleteTeam}
            onUpdateTeamName={handleUpdateTeamName}
            onUpdateTeamMembers={handleUpdateTeamMembers}
            onResetTeamScore={handleResetTeamScore}
            onStartStage={handleStartStage}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
          />
        )}

        {currentPhase === 'STAGE1_INTRO' && (
          <Stage1Intro
            activeTeam={activeTeam}
            onStartStage={() => setCurrentPhase('STAGE1_PLAY')}
            onBackToLobby={() => setCurrentPhase('TEAM_SELECT')}
          />
        )}

        {currentPhase === 'STAGE1_PLAY' && (
          <Stage1ErrorHunter
            activeTeam={activeTeam}
            onCompleteStage1={handleCompleteStage1}
            onGoToStage2={() => setCurrentPhase('STAGE2_INTRO')}
            onBackToLobby={() => setCurrentPhase('TEAM_SELECT')}
          />
        )}

        {currentPhase === 'STAGE2_INTRO' && (
          <Stage2Intro
            activeTeam={activeTeam}
            onStartStage={() => setCurrentPhase('STAGE2_PLAY')}
            onBackToLobby={() => setCurrentPhase('TEAM_SELECT')}
          />
        )}

        {currentPhase === 'STAGE2_PLAY' && (
          <Stage2SpeedStorage
            activeTeam={activeTeam}
            onCompleteStage2={handleCompleteStage2}
            onGoToLeaderboard={() => setShowLeaderboard(true)}
            onBackToLobby={() => setCurrentPhase('TEAM_SELECT')}
          />
        )}
      </main>

      {/* Modal: Leaderboard & Teacher Board Sharing */}
      {showLeaderboard && (
        <LeaderboardModal
          teams={teams}
          onClose={() => setShowLeaderboard(false)}
          onSelectTeamAndPlay={(teamId: string) => {
            setActiveTeamId(teamId);
            setCurrentPhase('STAGE1_INTRO');
            setShowLeaderboard(false);
          }}
        />
      )}
    </div>
  );
}
