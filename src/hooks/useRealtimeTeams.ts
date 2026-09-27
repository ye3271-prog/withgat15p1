import { useEffect, useRef, useState, useCallback } from 'react';
import { Team } from '../types/game';

interface UseRealtimeTeamsReturn {
  teams: Team[];
  connectedClients: number;
  isConnected: boolean;
  updateTeam: (team: Team) => void;
  updateAllTeams: (teams: Team[]) => void;
  resetAllTeams: () => void;
}

export function useRealtimeTeams(initialTeams: Team[]): UseRealtimeTeamsReturn {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [connectedClients, setConnectedClients] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const isUpdatingRef = useRef<boolean>(false);

  // REST fetch for initial state and periodic sync fallback
  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.teams) && data.teams.length > 0) {
          // Don't overwrite if user is actively editing locally
          if (!isUpdatingRef.current) {
            setTeams(data.teams);
          }
          setIsConnected(true);
        }
      }
    } catch {
      // Offline fallback
    }
  }, []);

  // Setup WebSocket connection with automatic REST fallback
  const connectWs = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'INIT_STATE' || data.type === 'SYNC_TEAMS') {
            if (Array.isArray(data.teams)) {
              setTeams(data.teams);
            }
            if (typeof data.connectedClients === 'number') {
              setConnectedClients(data.connectedClients);
            }
          } else if (data.type === 'CLIENTS_COUNT') {
            if (typeof data.count === 'number') {
              setConnectedClients(data.count);
            }
          }
        } catch {
          // Ignore
        }
      };

      ws.onclose = () => {
        // Fallback to REST polling if WebSocket closes
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connectWs();
        }, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    // 1. Initial fetch via REST immediately
    fetchTeams();

    // 2. Connect WebSocket
    connectWs();

    // 3. Fallback polling every 2 seconds to guarantee 100% cross-phone sync
    const pollInterval = window.setInterval(() => {
      fetchTeams();
    }, 2000);

    return () => {
      window.clearInterval(pollInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWs, fetchTeams]);

  const updateTeam = useCallback((updatedTeam: Team) => {
    isUpdatingRef.current = true;
    setTeams((prev) => {
      const next = prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t));
      return next;
    });

    // 1. Try WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'UPDATE_SINGLE_TEAM',
        team: updatedTeam,
      }));
    }

    // 2. Dual-channel REST PUT to guarantee server receives it regardless of proxy
    fetch(`/api/teams/${updatedTeam.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTeam),
    }).finally(() => {
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 500);
    });
  }, []);

  const updateAllTeams = useCallback((newTeams: Team[]) => {
    isUpdatingRef.current = true;
    setTeams(newTeams);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'UPDATE_TEAMS',
        teams: newTeams,
      }));
    }

    fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teams: newTeams }),
    }).finally(() => {
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 500);
    });
  }, []);

  const resetAllTeams = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'RESET_ALL_TEAMS',
      }));
    }
    fetch('/api/teams/reset', { method: 'POST' });
  }, []);

  return {
    teams,
    connectedClients,
    isConnected,
    updateTeam,
    updateAllTeams,
    resetAllTeams,
  };
}
