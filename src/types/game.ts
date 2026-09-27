export type StorageZoneId =
  | 'FREEZER_TOP'
  | 'FREEZER_BOTTOM'
  | 'FRIDGE_TOP'
  | 'FRIDGE_MID'
  | 'FRIDGE_BOTTOM'
  | 'FRIDGE_DOOR'
  | 'ROOM_TEMP';

export interface StorageZone {
  id: StorageZoneId;
  name: string;
  subName: string;
  tempDesc: string;
  color: string;
  borderColor: string;
  bgLight: string;
  description: string;
  textbookExamples: string[];
  tips: string[];
  icon: string;
}

export interface Team {
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

export interface StorageErrorItem {
  id: string;
  name: string;
  emoji: string;
  currentZoneId: StorageZoneId;
  correctZoneId: StorageZoneId;
  visualPosition: {
    zone: StorageZoneId;
    topPercent: number;
    leftPercent: number;
  };
  visualClue: string;
  problemTitle: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  correctAction: string;
  scienceTip: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  correctZoneId: StorageZoneId;
  hint: string;
  reason: string;
  specialWarning?: string;
  // 1 to 6
  purchaseOrder: number;
  purchaseCategory: string;
  // 1 to 6 (reverse: 7 - purchaseOrder)
  storageOrder: number;
  storageTip: string;
}

export type GamePhase =
  | 'TEAM_SELECT'
  | 'STAGE1_INTRO'
  | 'STAGE1_PLAY'
  | 'STAGE1_SUMMARY'
  | 'STAGE2_INTRO'
  | 'STAGE2_PLAY'
  | 'STAGE2_SUMMARY'
  | 'FINAL_RANKING';
