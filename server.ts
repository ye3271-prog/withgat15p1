import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';

interface TeamData {
  id: string;
  name: string;
  color: string;
  members?: string;
  stage1Score: number;
  stage1FoundCount: number;
  stage1TimeSeconds: number;
  stage2Score: number;
  stage2TimeSeconds: number;
  stage2CorrectCount: number;
  stage2TotalCount: number;
  totalScore: number;
  isCompleted: boolean;
}

// In-memory persistent server state
const INITIAL_TEAMS: TeamData[] = [
  { id: 'team-1', name: '1모둠 씩씩이', color: '#0284c7', stage1Score: 0, stage1FoundCount: 0, stage1TimeSeconds: 0, stage2Score: 0, stage2TimeSeconds: 0, stage2CorrectCount: 0, stage2TotalCount: 0, totalScore: 0, isCompleted: false },
  { id: 'team-2', name: '2모둠 알뜰이', color: '#16a34a', stage1Score: 0, stage1FoundCount: 0, stage1TimeSeconds: 0, stage2Score: 0, stage2TimeSeconds: 0, stage2CorrectCount: 0, stage2TotalCount: 0, totalScore: 0, isCompleted: false },
  { id: 'team-3', name: '3모둠 척척이', color: '#d97706', stage1Score: 0, stage1FoundCount: 0, stage1TimeSeconds: 0, stage2Score: 0, stage2TimeSeconds: 0, stage2CorrectCount: 0, stage2TotalCount: 0, totalScore: 0, isCompleted: false },
  { id: 'team-4', name: '4모둠 씽씽이', color: '#7c3aed', stage1Score: 0, stage1FoundCount: 0, stage1TimeSeconds: 0, stage2Score: 0, stage2TimeSeconds: 0, stage2CorrectCount: 0, stage2TotalCount: 0, totalScore: 0, isCompleted: false },
  { id: 'team-5', name: '5모둠 튼튼이', color: '#e11d48', stage1Score: 0, stage1FoundCount: 0, stage1TimeSeconds: 0, stage2Score: 0, stage2TimeSeconds: 0, stage2CorrectCount: 0, stage2TotalCount: 0, totalScore: 0, isCompleted: false },
  { id: 'team-6', name: '6모둠 슬기', color: '#0891b2', stage1Score: 0, stage1FoundCount: 0, stage1TimeSeconds: 0, stage2Score: 0, stage2TimeSeconds: 0, stage2CorrectCount: 0, stage2TotalCount: 0, totalScore: 0, isCompleted: false },
  { id: 'team-7', name: '7모둠 번쩍이', color: '#ea580c', stage1Score: 0, stage1FoundCount: 0, stage1TimeSeconds: 0, stage2Score: 0, stage2TimeSeconds: 0, stage2CorrectCount: 0, stage2TotalCount: 0, totalScore: 0, isCompleted: false },
];

let globalTeams: TeamData[] = [...INITIAL_TEAMS];

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes for REST fallback / health
  app.get('/api/teams', (_req, res) => {
    res.json({ teams: globalTeams });
  });

  app.put('/api/teams/:id', (req, res) => {
    const updatedTeam = req.body as TeamData;
    if (updatedTeam && updatedTeam.id) {
      const index = globalTeams.findIndex((t) => t.id === updatedTeam.id);
      if (index !== -1) {
        globalTeams[index] = { ...globalTeams[index], ...updatedTeam };
      } else {
        globalTeams.push(updatedTeam);
      }
      broadcastAll({ type: 'SYNC_TEAMS', teams: globalTeams });
      return res.json({ success: true, team: globalTeams[index !== -1 ? index : globalTeams.length - 1] });
    }
    return res.status(400).json({ error: 'Invalid team data' });
  });

  app.post('/api/teams', (req, res) => {
    if (Array.isArray(req.body.teams)) {
      globalTeams = req.body.teams;
      broadcastAll({ type: 'SYNC_TEAMS', teams: globalTeams });
      return res.json({ success: true, teams: globalTeams });
    }
    return res.status(400).json({ error: 'Expected teams array' });
  });

  app.post('/api/teams/reset', (_req, res) => {
    globalTeams = INITIAL_TEAMS.map((t) => ({ ...t }));
    broadcastAll({ type: 'SYNC_TEAMS', teams: globalTeams });
    res.json({ success: true, teams: globalTeams });
  });

  // WebSocket Server for instant real-time synchronization across all devices
  const wss = new WebSocketServer({ server });

  const broadcast = (data: object, senderWs?: WebSocket) => {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client !== senderWs && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  };

  const broadcastAll = (data: object) => {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  };

  wss.on('connection', (ws) => {
    // Send current authoritative team state immediately on connect
    ws.send(JSON.stringify({
      type: 'INIT_STATE',
      teams: globalTeams,
      connectedClients: wss.clients.size,
    }));

    // Notify connected count
    broadcastAll({
      type: 'CLIENTS_COUNT',
      count: wss.clients.size,
    });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'UPDATE_TEAMS') {
          if (Array.isArray(data.teams)) {
            globalTeams = data.teams;
            broadcast({ type: 'SYNC_TEAMS', teams: globalTeams }, ws);
          }
        } else if (data.type === 'UPDATE_SINGLE_TEAM') {
          const updatedTeam = data.team as TeamData;
          if (updatedTeam && updatedTeam.id) {
            const index = globalTeams.findIndex((t) => t.id === updatedTeam.id);
            if (index !== -1) {
              globalTeams[index] = { ...globalTeams[index], ...updatedTeam };
            } else {
              globalTeams.push(updatedTeam);
            }
            broadcastAll({ type: 'SYNC_TEAMS', teams: globalTeams });
          }
        } else if (data.type === 'RESET_ALL_TEAMS') {
          globalTeams = INITIAL_TEAMS.map((t) => ({ ...t }));
          broadcastAll({ type: 'SYNC_TEAMS', teams: globalTeams });
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    });

    ws.on('close', () => {
      broadcastAll({
        type: 'CLIENTS_COUNT',
        count: wss.clients.size,
      });
    });
  });

  // Mount Vite development middlewares in dev mode, or serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(port, () => {
    console.log(`Server running on port ${port} with Real-Time WebSockets`);
  });
}

startServer();
