import { StorageZone, StorageErrorItem, GroceryItem } from '../types/game';

// [ 2 ] 식품의 보관과 관리 - 교과서 핵심 개념 데이터
export interface TextbookCoreContent {
  chapterTitle: string;
  section1: {
    title: string;
    question: string;
    fullText: string;
    blanks: {
      id: string;
      label: string;
      answer: string;
      options: string[];
      hint: string;
      explanation: string;
    }[];
  };
  section2: {
    title: string;
    rules: {
      id: string;
      title: string;
      content: string;
      highlight: string;
      blankWord?: string;
      options?: string[];
      reason: string;
    }[];
  };
}

export const TEXTBOOK_CONTENT: TextbookCoreContent = {
  chapterTitle: '[ 2 ] 식품의 보관과 관리',
  section1: {
    title: '① 식품의 올바른 보관과 관리의 중요성',
    question: '즉, 식품이 올바로 보관, 관리되지 않는다면?',
    fullText: '( 영양소 )의 파괴와 손실, 세균이나 곰팡이에 의해 식품 품질이 저하되는 ( 식품 변질 )이 나타나고, 식중독을 유발하는 등 건강에 해를 끼치고, ( 환경 오염 )을 유발함',
    blanks: [
      {
        id: 'blank-nutrient',
        label: '첫 번째 괄호',
        answer: '영양소',
        options: ['영양소', '지방질', '칼로리', '식품첨가물'],
        hint: '비타민이나 무기질 등 우리 몸에 꼭 필요한 성분이에요.',
        explanation: '올바르지 않게 보관하면 비타민 등 중요한 영양소가 파괴되거나 손실됩니다.',
      },
      {
        id: 'blank-spoilage',
        label: '두 번째 괄호',
        answer: '식품 변질',
        options: ['식품 변질', '식품 숙성', '자연 건조', '유통 기한'],
        hint: '세균, 곰팡이 등에 의해 식품의 원래 맛, 색, 질감이 상하고 변하는 현상이에요.',
        explanation: '세균이나 곰팡이가 증식하여 식품 고유의 성질을 잃고 썩거나 상하는 "식품 변질"이 발생합니다.',
      },
      {
        id: 'blank-environment',
        label: '세 번째 괄호',
        answer: '환경 오염',
        options: ['환경 오염', '실내 건조', '냉매 고장', '기후 정상화'],
        hint: '버려지는 음식물 쓰레기가 늘어나 자연이 병들어요.',
        explanation: '상해서 버리는 음식물 쓰레기가 급증하여 온실가스 배출 및 토양·수질 "환경 오염"을 일으킵니다.',
      },
    ],
  },
  section2: {
    title: '② 식품의 보관 방법 (3대 핵심 원칙)',
    rules: [
      {
        id: 'rule-portion',
        title: '1회 분량 소분 & 투명 밀폐 용기',
        content: '식품의 특성을 고려해, 1회 분량으로 소분하여 내용물이 보이는 밀폐 용기에 보관',
        highlight: '1회 분량 소분 + 투명 밀폐 용기',
        reason: '한 번에 먹을 만큼만 나누어 담아야 남은 음식이 공기나 손에 닿아 오염되는 것을 막고, 속이 보여 쉽게 찾을 수 있습니다.',
      },
      {
        id: 'rule-capacity',
        title: '냉장고 용량 70% 이하 채우기',
        content: '냉장고를 꽉 채우지 않고, ( 70 )% 이하로 채우기 → 넘어가면 ( 냉기 순환 )이 어려워짐',
        highlight: '70% 이하 보관 & 냉기 순환 확보',
        blankWord: '70 / 냉기 순환',
        options: ['70% 이하 / 냉기 순환', '100% 가득 / 전기 절약', '50% 절반 / 수분 유지'],
        reason: '식품을 70% 넘게 꽉 채우면 냉기가 골고루 돌지 못해 냉장고 내부 온도가 올라가 식품이 쉽게 상합니다.',
      },
      {
        id: 'rule-temp-control',
        title: '문 자주 여닫지 않기 & 식혀서 넣기',
        content: '냉장고 문을 자주 여닫지 않고, 뜨거운 음식은 식혀서 넣기 → 내부 온도 상승해 주변 식품에 영향을 줌',
        highlight: '뜨거운 음식 식힌 후 보관 & 문 여닫기 최소화',
        reason: '뜨거운 음식을 바로 넣으면 내부 온도가 급격히 상승하여 주변에 보관된 다른 식품들까지 부패 위험에 처합니다.',
      },
    ],
  },
};

// [그림 Ⅱ-35 식품별 보관 방법]에 따른 7대 보관 구역 정의
export const STORAGE_ZONES: Record<string, StorageZone> = {
  FREEZER_TOP: {
    id: 'FREEZER_TOP',
    name: '냉동실 상단',
    subName: '상단 선반',
    tempDesc: '냉동 보관',
    color: '#0284c7', // Sky-600
    borderColor: '#38bdf8',
    bgLight: '#f0f9ff',
    description: '남은 밥·떡·식빵(소분 밀봉) / 냉동식품(만두 등) / 건어물(멸치 등)',
    textbookExamples: ['냉동 식빵', '냉동 만두', '국물용 멸치', '남은 밥·떡'],
    tips: [
      '냉동 식빵이나 떡, 밥은 1회분씩 밀봉하여 냉동실 위 칸에 보관합니다.',
      '건어물(멸치 등): 산패와 눅눅해짐을 막기 위해 냉동실 위 칸에 보관합니다.',
    ],
    icon: '🧊',
  },
  FREEZER_BOTTOM: {
    id: 'FREEZER_BOTTOM',
    name: '냉동실 하단',
    subName: '하단 서랍',
    tempDesc: '냉동 보관',
    color: '#0369a1', // Sky-700
    borderColor: '#0284c7',
    bgLight: '#e0f2fe',
    description: '육류(비닐팩 소분+구입날짜 표기), 생선류(내장 제거 및 세척)',
    textbookExamples: ['소분한 육류(쇠고기, 돼지고기)', '손질한 생선류(내장제거)'],
    tips: [
      '육류: 한 번에 먹을 만큼 나누어 비닐 팩에 넣고 구입 날짜를 적어 보관합니다.',
      '생선류: 내장을 제거하고 깨끗이 씻어서 물기를 닦은 후 밀봉 보관합니다.',
    ],
    icon: '🥩',
  },
  FRIDGE_TOP: {
    id: 'FRIDGE_TOP',
    name: '냉장실 상단',
    subName: '상단 선반',
    tempDesc: '냉장 보관',
    color: '#0d9488', // Teal-600
    borderColor: '#2dd4bf',
    bgLight: '#f0fdfa',
    description: '조리한 음식, 개봉한 통조림 (용기에 담아 덮개를 덮어 보관)',
    textbookExamples: ['조리한 찌개·국(식힌 후)', '밑반찬', '개봉 통조림(밀폐용기로 이동)'],
    tips: ['개봉한 통조림은 캔째 두면 산화되므로 반드시 밀폐 유리나 플라스틱 용기에 옮겨 덮개를 덮어 보관합니다.'],
    icon: '🍲',
  },
  FRIDGE_MID: {
    id: 'FRIDGE_MID',
    name: '냉장실 중단',
    subName: '중단 선반',
    tempDesc: '냉장 보관',
    color: '#2563eb', // Blue-600
    borderColor: '#60a5fa',
    bgLight: '#eff6ff',
    description: '육류·생선류: 1~2일 안에 먹을 것 보관',
    textbookExamples: ['오늘~내일 조리할 생닭고기', '신선 생선 토막'],
    tips: ['핏물이나 수분이 다른 식품에 떨어지지 않도록 밀폐 용기나 받침 접시에 올려 보관합니다.'],
    icon: '🐟',
  },
  FRIDGE_BOTTOM: {
    id: 'FRIDGE_BOTTOM',
    name: '신선 야채실',
    subName: '하단 서랍',
    tempDesc: '냉장 보관',
    color: '#16a34a', // Green-600
    borderColor: '#4ade80',
    bgLight: '#f0fdf4',
    description: '채소류: 씻어서 밀폐 용기에 보관 / 과일류: 칸을 나누어 보관',
    textbookExamples: ['씻은 채소(시금치, 상추)', '포도, 귤', '사과(개별 밀봉)'],
    tips: [
      '채소류: 흙을털고 씻어서 물기를 적당히 말린 후 밀폐 용기 보관.',
      '과일류: 사과는 에틸렌 가스를 뿜어 주변 채소를 시들게 하므로 칸을 나누거나 개별 포장합니다.',
    ],
    icon: '🥬',
  },
  FRIDGE_DOOR: {
    id: 'FRIDGE_DOOR',
    name: '도어 포켓',
    subName: '문 쪽 선반',
    tempDesc: '냉장 보관',
    color: '#d97706', // Amber-600
    borderColor: '#fbbf24',
    bgLight: '#fffbeb',
    description: '달걀: 둥근 쪽을 위로 / 우유·유제품 / 음료수·물',
    textbookExamples: ['달걀', '우유', '요거트', '물, 주스', '양념 소스'],
    tips: ['달걀은 숨구멍(기실)이 있는 둥근 쪽을 위로 향하게 놓아야 신선도가 오래 유지됩니다.'],
    icon: '🥚',
  },
  ROOM_TEMP: {
    id: 'ROOM_TEMP',
    name: '실온 보관 바구니',
    subName: '통풍 바구니',
    tempDesc: '상온 보관',
    color: '#ea580c', // Orange-600
    borderColor: '#fb923c',
    bgLight: '#fff7ed',
    description: '김, 식빵, 감자류, 양파, 마늘, 바나나, 미개봉 통조림, 곡류',
    textbookExamples: ['김', '식빵', '감자, 고구마', '통양파, 통마늘', '바나나', '미개봉 통조림'],
    tips: [
      '김, 식빵, 감자, 양파, 바나나 등은 서늘하고 통풍이 잘되는 실온 바구니에 보관합니다.',
      '식빵을 냉장고에 넣으면 전분이 노화되어 빨리 딱딱해지므로 실온에 보관합니다.',
    ],
    icon: '🧺',
  },
};

// 1단계: 식품 보관의 오류 찾기 (교과서 내용 기반 8가지 오류)
export const INITIAL_STORAGE_ERRORS: StorageErrorItem[] = [
  {
    id: 'err-potato',
    name: '냉장실 아래 칸(채소실)의 감자',
    emoji: '🥔',
    currentZoneId: 'FRIDGE_BOTTOM',
    correctZoneId: 'ROOM_TEMP',
    visualPosition: {
      zone: 'FRIDGE_BOTTOM',
      topPercent: 35,
      leftPercent: 22,
    },
    visualClue: '채소실 구석에 차갑게 굳어 있는 감자가 보여요!',
    problemTitle: '감자가 냉장고 채소칸에 들어가 있어요!',
    question: '교과서에 따르면 감자는 어디에 보관해야 하며, 냉장 보관 시 어떤 문제가 생길까요?',
    options: [
      {
        text: '감자는 실온 보관해야 하며, 냉장 보관 시 전분이 당분으로 변하고 조리 시 유해물질(아크릴아마이드)이 증가한다.',
        isCorrect: true,
        explanation: '정답! 교과서 실온 보관 식품(감자, 양파, 마늘, 바나나)으로 햇빛이 들지 않는 서늘한 상온에 보관해야 합니다.',
      },
      {
        text: '감자는 냉동실 위 칸에 보관해야 수분이 빠져나가지 않는다.',
        isCorrect: false,
        explanation: '오답입니다. 생감자를 얼리면 세포벽이 파괴되어 해동 시 스펀지처럼 퍼석해집니다.',
      },
      {
        text: '감자는 냉장고 문 쪽에 둥근 면을 아래로 하여 보관해야 한다.',
        isCorrect: false,
        explanation: '오답입니다. 둥근 면을 위로 하는 것은 달걀의 보관법입니다.',
      },
    ],
    correctAction: '감자를 꺼내어 신문지에 싸서 통풍이 잘되고 햇빛이 들지 않는 서늘한 실온에 보관합니다.',
    scienceTip: '교과서 실온 보관: 곡류, 콩류, 감자류, 양파, 마늘, 바나나는 냉장고가 아닌 실온에 보관합니다.',
  },
  {
    id: 'err-banana',
    name: '냉장실 중간 칸의 바나나',
    emoji: '🍌',
    currentZoneId: 'FRIDGE_MID',
    correctZoneId: 'ROOM_TEMP',
    visualPosition: {
      zone: 'FRIDGE_MID',
      topPercent: 40,
      leftPercent: 68,
    },
    visualClue: '바나나 껍질이 차가운 냉기 때문에 거뭇거뭇 변하고 있어요!',
    problemTitle: '열대 과일 바나나가 냉장실에 갇혀 있어요!',
    question: '바나나와 같은 열대 과일을 냉장고에 넣으면 왜 안 될까요?',
    options: [
      {
        text: '저온 장해(Chilling injury)를 입어 껍질이 검게 변하고 맛과 영양소가 급격히 파괴된다.',
        isCorrect: true,
        explanation: '정답! 바나나는 더운 열대 기후 작물이라 10℃ 이하 저온에 닿으면 세포가 파괴되어 변질됩니다.',
      },
      {
        text: '바나나에서 기름이 흘러나와 냉장고 모터를 멈추게 한다.',
        isCorrect: false,
        explanation: '오답입니다. 바나나에서 기름이 흘러나오지 않습니다.',
      },
      {
        text: '바나나가 얼어서 껍질이 벗겨지지 않게 된다.',
        isCorrect: false,
        explanation: '오답입니다. 냉장실 온도(3~5℃)에서는 얼지 않으나 검게 변질됩니다.',
      },
    ],
    correctAction: '바나나를 실온으로 옮겨 바나나 걸이에 걸어두거나 꼭지를 랩으로 감싸 서늘하게 둡니다.',
    scienceTip: '교과서 [실온 보관]: 열대 과일(바나나 등)은 실온에서 자연 숙성시키며 보관합니다.',
  },
  {
    id: 'err-meat-top',
    name: '냉장실 위 칸의 개봉된 날소고기',
    emoji: '🥩',
    currentZoneId: 'FRIDGE_TOP',
    correctZoneId: 'FRIDGE_MID',
    visualPosition: {
      zone: 'FRIDGE_TOP',
      topPercent: 30,
      leftPercent: 45,
    },
    visualClue: '익히지 않은 생고기가 포장도 없이 제일 위 칸에 놓여 핏물이 떨어질 것 같아요!',
    problemTitle: '날육류가 냉장실 위 칸에 덮개 없이 놓여 있어요!',
    question: '교과서 보관법에 따른 육류 보관의 올바른 방법은 무엇일까요?',
    options: [
      {
        text: '1~2일 내 먹을 육류는 중간 칸에 밀폐용기에 담아 보관하고, 장기 보관은 1회분 소분하여 냉동실 아래 칸에 둔다.',
        isCorrect: true,
        explanation: '정답! 생고기의 핏물이 아래 조리음식이나 반찬으로 떨어지면 치명적인 식중독 교차오염이 일어납니다.',
      },
      {
        text: '날고기는 차가운 바람이 나오는 냉장실 문 쪽에 세워둔다.',
        isCorrect: false,
        explanation: '오답입니다. 문 쪽은 온도 변화가 커서 날고기가 바로 부패합니다.',
      },
      {
        text: '위 칸에 그대로 두고 덮개만 신문지로 덮는다.',
        isCorrect: false,
        explanation: '오답입니다. 신문지 잉크는 유해하며 핏물이 아래로 샐 수 있습니다.',
      },
    ],
    correctAction: '생고기를 밀폐 용기에 담아 1~2일 내 먹을 것은 중간 칸에, 오래 둘 것은 냉동 아래 칸으로 옮깁니다.',
    scienceTip: '교과서 기준: 조리한 음식은 위 칸(0~3℃), 1~2일 내 먹을 육류·생선은 중간 칸(3~5℃)에 보관합니다.',
  },
  {
    id: 'err-hot-soup',
    name: '김이 펄펄 나는 뜨거운 찌개 냄비',
    emoji: '🍲',
    currentZoneId: 'FRIDGE_TOP',
    correctZoneId: 'FRIDGE_TOP',
    visualPosition: {
      zone: 'FRIDGE_TOP',
      topPercent: 60,
      leftPercent: 18,
    },
    visualClue: '뜨거운 김이 뿜어져 나와 냉장실 내부가 뿌옇게 흐려지고 있어요!',
    problemTitle: '뜨거운 음식을 식히지 않고 바로 냉장고에 넣었어요!',
    question: '교과서 ② [식품의 보관 방법]에서 "뜨거운 음식은 식혀서 넣기"를 강조하는 이유는?',
    options: [
      {
        text: '냉장고 내부 온도가 상승하여 주변 식품까지 변질 및 식중독균 번식 위험에 빠뜨리기 때문',
        isCorrect: true,
        explanation: '정답! 뜨거운 냄비는 냉장고 전체 온도를 순식간에 높여 주변 우유, 반찬의 변질을 부릅니다.',
      },
      {
        text: '찌개의 국물이 전부 증발하여 냉장고 문 밖으로 넘치기 때문',
        isCorrect: false,
        explanation: '오답입니다. 밀폐되지 않아도 국물이 문 밖으로 넘치지는 않습니다.',
      },
      {
        text: '냉장고 내부 형광등이 깨지기 때문',
        isCorrect: false,
        explanation: '오답입니다. 핵심 문제는 내부 온도 상승과 주변 식품 변질입니다.',
      },
    ],
    correctAction: '냄비를 즉시 꺼내 상온에서 완전히 식힌 후, 밀폐용기에 담아 냉장실 위 칸에 넣습니다.',
    scienceTip: '교과서 원칙: "냉장고 문을 자주 여닫지 않고, 뜨거운 음식은 식혀서 넣기 → 내부 온도 상승해 주변 식품에 영향을 줌"',
  },
  {
    id: 'err-egg-upside-down',
    name: '뾰족한 쪽이 위로 향한 달걀',
    emoji: '🥚',
    currentZoneId: 'FRIDGE_DOOR',
    correctZoneId: 'FRIDGE_DOOR',
    visualPosition: {
      zone: 'FRIDGE_DOOR',
      topPercent: 25,
      leftPercent: 82,
    },
    visualClue: '달걀 판에 달걀들이 뾰족한 쪽을 위로 하여 불안정하게 꽂혀 있어요!',
    problemTitle: '달걀의 위아래 방향이 거꾸로 꽂혀 있어요!',
    question: '교과서 그림 Ⅱ-35에 명시된 달걀의 올바른 보관 방법은 무엇일까요?',
    options: [
      {
        text: '숨구멍(기실)이 있는 둥근 쪽을 위로 향하게 하여 보관한다.',
        isCorrect: true,
        explanation: '정답! 교과서에 "달걀: 둥근 쪽을 위로 하여 보관"이라고 명확히 나와 있습니다. 기실을 통해 신선도가 유지됩니다.',
      },
      {
        text: '뾰족한 쪽을 위로 하여 노른자가 가라앉게 한다.',
        isCorrect: false,
        explanation: '오답입니다. 뾰족한 쪽을 위로 두면 노른자가 껍질에 붙어 상하기 쉽습니다.',
      },
      {
        text: '달걀은 비누로 깨끗이 씻은 후 냉동실 아래 칸에 얼려둔다.',
        isCorrect: false,
        explanation: '오답입니다. 물로 씻으면 보호막(큐티클)이 파괴되어 세균이 침투합니다.',
      },
    ],
    correctAction: '달걀의 둥근 쪽(기실이 있는 부분)이 위로 가도록 바로 세워 냉장실 문 쪽 또는 전용 거치대에 보관합니다.',
    scienceTip: '교과서 문 쪽(5~8℃): 〈달걀: 둥근 쪽을 위로 하여 보관〉, 우유·유제품, 음료수·물',
  },
  {
    id: 'err-open-can',
    name: '개봉된 채 냉장실에 방치된 통조림 캔',
    emoji: '🥫',
    currentZoneId: 'FRIDGE_TOP',
    correctZoneId: 'FRIDGE_TOP',
    visualPosition: {
      zone: 'FRIDGE_TOP',
      topPercent: 32,
      leftPercent: 80,
    },
    visualClue: '뚜껑이 열린 참치 통조림 캔이 쇠 냄새를 풍기며 그대로 놓여 있어요!',
    problemTitle: '먹다 남은 통조림을 캔째 그대로 냉장고에 넣었어요!',
    question: '교과서 그림 Ⅱ-35에서 "개봉한 통조림"의 보관 방법은 어떻게 설명되어 있나요?',
    options: [
      {
        text: '용기에 담아 덮개를 덮어 위 칸(0~3℃)에 보관한다.',
        isCorrect: true,
        explanation: '정답! 통조림은 개봉 즉시 산소와 만나 캔 내부 주석이 부식되므로 반드시 다른 밀폐용기로 옮겨야 합니다.',
      },
      {
        text: '캔 뚜껑만 테이프로 붙인 뒤 실온에 둔다.',
        isCorrect: false,
        explanation: '오답입니다. 개봉 후에는 세균이 번식하므로 밀폐용기에 옮겨 냉장 보관해야 합니다.',
      },
      {
        text: '캔을 뒤집어서 냉동실 아래 칸에 얼린다.',
        isCorrect: false,
        explanation: '오답입니다. 캔째 얼리면 팽창하여 위험합니다.',
      },
    ],
    correctAction: '남은 내용물을 즉시 유리나 플라스틱 밀폐 용기에 옮겨 덮개를 덮고 냉장실 위 칸에 보관합니다.',
    scienceTip: '교과서 위 칸(0~3℃): 조리한 음식, 개봉한 통조림: 용기에 담아 덮개를 덮어 보관!',
  },
  {
    id: 'err-overfilled',
    name: '냉장고를 꽉꽉 채운 100% 과적 상태',
    emoji: '📦',
    currentZoneId: 'FRIDGE_MID',
    correctZoneId: 'FRIDGE_MID',
    visualPosition: {
      zone: 'FRIDGE_MID',
      topPercent: 55,
      leftPercent: 38,
    },
    visualClue: '냉장고 틈새가 하나도 없이 검은 비닐봉지와 반찬통이 빈틈없이 꽉 채워져 있어요!',
    problemTitle: '냉장고가 100% 꽉 차서 숨을 쉴 수 없어요!',
    question: '교과서 ② [식품의 보관 방법]에 따르면 냉장고는 몇 % 이하로 채워야 할까요?',
    options: [
      {
        text: '70% 이하로 채워야 냉기 순환이 잘 되어 식품 변질을 막을 수 있다.',
        isCorrect: true,
        explanation: '정답! 교과서 빈칸 핵심 내용: "냉장고를 꽉 채우지 않고, ( 70 )% 이하로 채우기 → 넘어가면 ( 냉기 순환 )이 어려워짐"',
      },
      {
        text: '100% 가득 채워야 외부 열기가 들어올 틈이 없다.',
        isCorrect: false,
        explanation: '오답입니다. 꽉 채우면 냉기가 순환하지 못해 내부 온도가 올라갑니다.',
      },
      {
        text: '30% 이하로만 채우고 나머지는 전부 비워두어야 한다.',
        isCorrect: false,
        explanation: '오답입니다. 교과서 권장 기준은 70% 이하입니다.',
      },
    ],
    correctAction: '오래된 음식과 불필요한 물품을 정리하여 냉장고 용량을 70% 이하로 유지하고 냉기 통로를 확보합니다.',
    scienceTip: '교과서 핵심: 70% 이하로 채우기 → 냉기 순환 원활 + 전기요금 절약 + 식품 변질 방지!',
  },
  {
    id: 'err-unsealed-raw-meat',
    name: '냉동실 위 칸에 덩어리째 던져진 생고기',
    emoji: '🥩',
    currentZoneId: 'FREEZER_TOP',
    correctZoneId: 'FREEZER_BOTTOM',
    visualPosition: {
      zone: 'FREEZER_TOP',
      topPercent: 42,
      leftPercent: 50,
    },
    visualClue: '큰 쇠고기 덩어리가 비닐 한 장에 대충 말려 밥과 빵 옆에 꽁꽁 얼어붙어 있어요!',
    problemTitle: '생고기를 소분도 안 하고 구입날짜도 없이 냉동 위 칸에 넣었어요!',
    question: '교과서 그림 Ⅱ-35에 따른 냉동실 육류·생선류의 올바른 보관 위치와 방법은?',
    options: [
      {
        text: '〈아래 칸〉에 한 번에 먹을 만큼 소분하여 비닐 팩에 넣고 구입 날짜를 적어 보관한다.',
        isCorrect: true,
        explanation: '정답! 교과서 냉동 보관 〈아래 칸〉: "육류: 한 번에 먹을 만큼 나누어 비닐 팩에 넣고 구입 날짜를 적어 보관"',
      },
      {
        text: '〈위 칸〉에 밥, 빵과 함께 섞어서 보관한다.',
        isCorrect: false,
        explanation: '오답입니다. 냉동실 위 칸은 밥, 떡, 빵, 냉동식품, 건조식품(김, 멸치) 전용입니다.',
      },
      {
        text: '비닐을 벗기고 그냥 선반 위에 올려 급속 냉동한다.',
        isCorrect: false,
        explanation: '오답입니다. 수분이 날아가 냉동 화상(Freezer burn)을 입고 세균이 냉동실에 퍼집니다.',
      },
    ],
    correctAction: '고기를 1회 분량씩 랩/비닐팩으로 소분하고 네임펜으로 날짜를 적어 냉동실 아래 칸에 보관합니다.',
    scienceTip: '교과서 냉동 아래 칸(-20~-18℃): 육류(1회분 소분+구입날짜 표기), 생선류(내장 제거+세척 후 보관)',
  },
];

export const SHOPPING_AND_STORAGE_RULES = [
  {
    step: 1,
    category: '냉장 필요없는 식품',
    purchaseOrder: 1,
    storageOrder: 6,
    examples: '김, 식빵, 감자, 바나나, 미개봉 통조림, 양파, 마늘 등',
    purchaseReason: '실온에 두어도 상하지 않으므로 장볼 때 가장 먼저 카트에 담아요.',
    storageReason: '실온 보관 식품이므로 냉장고 수납이 끝난 후 가장 마지막에 여유있게 정리해요.',
    icon: '🧺',
    color: '#ea580c',
  },
  {
    step: 2,
    category: '채소, 과일류',
    purchaseOrder: 2,
    storageOrder: 5,
    examples: '시금치, 포도, 방울토마토 등',
    purchaseReason: '온도 변화에 비교적 덜 민감하여 두 번째로 담아요.',
    storageReason: '육류·어패류보다 급격한 세균 번식 위험이 낮아 다섯 번째로 정리해요.',
    icon: '🥬',
    color: '#16a34a',
  },
  {
    step: 3,
    category: '냉장 필요식품',
    purchaseOrder: 3,
    storageOrder: 4,
    examples: '신선 우유, 달걀, 개봉 참치, 유제품 등',
    purchaseReason: '냉장 보관이 필요한 가공식품과 유제품을 세 번째로 담아요.',
    storageReason: '실온 방치 시 변질될 수 있으므로 네 번째로 냉장고에 보관해요.',
    icon: '🥛',
    color: '#0284c7',
  },
  {
    step: 4,
    category: '육류',
    purchaseOrder: 4,
    storageOrder: 3,
    examples: '생닭고기, 소분 쇠고기 등',
    purchaseReason: '온도가 올라가면 미생물이 번식하므로 장보기 후반부에 담아요.',
    storageReason: '단백질 변질과 핏물 오염 방지를 위해 집에 오자마자 세 번째로 신속 보관해요.',
    icon: '🥩',
    color: '#e11d48',
  },
  {
    step: 5,
    category: '어패류',
    purchaseOrder: 5,
    storageOrder: 2,
    examples: '생오징어, 손질 고등어, 국물용 멸치 등',
    purchaseReason: '비린내와 세균 증식이 매우 빠르므로 장보기 막바지에 담아요.',
    storageReason: '신선도가 가장 빠르게 떨어지므로 집에 오자마자 두 번째로 빠르게 보관해요.',
    icon: '🐟',
    color: '#0891b2',
  },
  {
    step: 6,
    category: '조리된 음식',
    purchaseOrder: 6,
    storageOrder: 1,
    examples: '김밥, 고로케, 즉석 튀김, 샐러드 도시락 등',
    purchaseReason: '식중독 위험이 가장 크고 온도가 생명이므로 장보기 계산 직전 맨 마지막에 담아요.',
    storageReason: '★보관 1순위! 김밥, 고로케 등 이미 조리된 식품은 실온 방치 시 식중독 세균(포도상구균 등)이 가장 빠르게 번식하므로 집에 오자마자 즉시 냉장 보관해요!',
    icon: '🍙',
    color: '#7c3aed',
  },
];

// 2단계: 장보기 후 올바른 식품 보관 스피드 레이스 아이템
// 원칙: 구매 순서(1→6)와 정반대로 보관 순서(6→1)에 맞게 수납!
export const GROCERY_ITEMS: GroceryItem[] = [
  // 6. 조리된 음식 (구매 6순위 ➔ 보관 1순위: 가장 먼저 즉시 냉장/냉동 보관!)
  {
    id: 'item-kimbap',
    name: '즉석 김밥 (조리식품)',
    emoji: '🍙',
    category: '조리된 음식',
    correctZoneId: 'FRIDGE_TOP',
    hint: '즉석 김밥',
    reason: '교과서 냉장 보관 〈위 칸〉: 김밥처럼 즉석에서 조리된 음식은 실온에서 식중독균 번식 위험이 가장 높아 덮개를 덮어 냉장 위 칸에 1순위로 즉시 보관해요!',
    purchaseOrder: 6,
    purchaseCategory: '조리된 음식',
    storageOrder: 1,
    storageTip: '★보관 1순위: 김밥은 밥과 속재료가 버무려져 식중독균 번식이 가장 빠르므로 즉시 냉장 보관!',
  },
  {
    id: 'item-croquette',
    name: '고로케 (즉석 튀김·조리빵)',
    emoji: '🥖',
    category: '조리된 음식',
    correctZoneId: 'FRIDGE_TOP',
    hint: '고로케/조리빵',
    reason: '교과서 냉장 보관 〈위 칸〉: 고로케 등 기름에 조리된 음식은 산패와 세균 번식을 막기 위해 밀폐용기에 담아 냉장 위 칸에 1순위로 보관해요!',
    purchaseOrder: 6,
    purchaseCategory: '조리된 음식',
    storageOrder: 1,
    storageTip: '★보관 1순위: 고로케 등 조리 튀김류는 기름 산패와 미생물 증식을 막기 위해 1순위로 신속 보관!',
  },
  {
    id: 'item-frozen-dumpling',
    name: '냉동 만두 (조리·냉동식품)',
    emoji: '🥟',
    category: '조리된 음식(냉동)',
    correctZoneId: 'FREEZER_TOP',
    hint: '냉동 조리식품',
    reason: '교과서 냉동 보관 〈위 칸〉: 냉동 만두 등 조리 냉동식품은 녹으면 상하므로 냉동실 위 칸에 즉시 보관!',
    purchaseOrder: 6,
    purchaseCategory: '조리된 음식',
    storageOrder: 1,
    storageTip: '해동되면 미생물 증식 및 변질이 일어나므로 1순위로 신속 냉동 보관!',
  },

  // 5. 어패류 (구매 5순위 ➔ 보관 2순위: 신선도 급락 방지!)
  {
    id: 'item-fresh-squid-1day',
    name: '생오징어 (내일 요리용)',
    emoji: '🦑',
    category: '어패류',
    correctZoneId: 'FRIDGE_MID',
    hint: '단기 조리 생선',
    reason: '교과서 냉장 보관 〈중간 칸〉: 1~2일 안에 먹을 생선류는 중간 칸에 보관합니다.',
    purchaseOrder: 5,
    purchaseCategory: '어패류',
    storageOrder: 2,
    storageTip: '상하기 쉽고 비린내가 나기 쉬우므로 2순위로 신속 보관!',
  },
  {
    id: 'item-cleaned-fish',
    name: '손질 고등어 (장기 보관용)',
    emoji: '🐟',
    category: '어패류',
    correctZoneId: 'FREEZER_BOTTOM',
    hint: '생선류',
    reason: '교과서 냉동 보관 〈아래 칸〉: 생선류는 내장을 제거하고 씻어서 냉동실 아래 칸에 보관!',
    purchaseOrder: 5,
    purchaseCategory: '어패류',
    storageOrder: 2,
    storageTip: '내장 세척 후 신선도 보존을 위해 2순위로 냉동 아래 칸 보관!',
  },
  {
    id: 'item-dried-anchovy',
    name: '국물용 멸치 (장기 보관 건어물)',
    emoji: '🐟',
    category: '어패류(건어물)',
    correctZoneId: 'FREEZER_TOP',
    hint: '건어물/멸치',
    reason: '교과서 냉동 보관 〈위 칸〉: 국물용 멸치 등 건어물은 산패와 눅눅해짐을 막기 위해 냉동실 위 칸에 보관합니다.',
    purchaseOrder: 5,
    purchaseCategory: '어패류',
    storageOrder: 2,
    storageTip: '눅눅해짐과 산패 방지를 위해 2순위로 냉동실 위 칸 보관!',
  },

  // 4. 육류 (구매 4순위 ➔ 보관 3순위: 핏물 오염 및 세균 번식 방지!)
  {
    id: 'item-fresh-chicken-1day',
    name: '생닭고기 (오늘 저녁 조리용)',
    emoji: '🍗',
    category: '육류',
    correctZoneId: 'FRIDGE_MID',
    hint: '당일 조리 생고기',
    reason: '교과서 냉장 보관 〈중간 칸〉: 육류·생선류는 1~2일 안에 먹을 것을 밀폐 보관!',
    purchaseOrder: 4,
    purchaseCategory: '육류',
    storageOrder: 3,
    storageTip: '단백질 변질 및 교차오염 방지를 위해 3순위로 밀폐 냉장 보관!',
  },
  {
    id: 'item-raw-beef-long',
    name: '소분한 쇠고기 (장기 보관용)',
    emoji: '🥩',
    category: '육류',
    correctZoneId: 'FREEZER_BOTTOM',
    hint: '육류',
    reason: '교과서 냉동 보관 〈아래 칸〉: 육류는 한 번에 먹을 만큼 나누어 비닐 팩에 넣고 구입 날짜를 적어 보관!',
    purchaseOrder: 4,
    purchaseCategory: '육류',
    storageOrder: 3,
    storageTip: '1회분 소분 후 신속 동결을 위해 3순위로 냉동 아래 칸 보관!',
  },

  // 3. 냉장 필요식품 (구매 3순위 ➔ 보관 4순위: 유제품·달걀 신선 보관!)
  {
    id: 'item-milk',
    name: '신선 우유',
    emoji: '🥛',
    category: '냉장 필요식품',
    correctZoneId: 'FRIDGE_DOOR',
    hint: '음료/유제품',
    reason: '교과서 냉장 보관 〈문 쪽〉: 우유·유제품, 음료수·물 보관!',
    purchaseOrder: 3,
    purchaseCategory: '냉장 필요식품',
    storageOrder: 4,
    storageTip: '유제품의 신선도 유지를 위해 4순위로 냉장 도어포켓 보관!',
  },
  {
    id: 'item-fresh-eggs',
    name: '달걀',
    emoji: '🥚',
    category: '냉장 필요식품',
    correctZoneId: 'FRIDGE_DOOR',
    hint: '달걀',
    reason: '교과서 냉장 보관 〈문 쪽〉: 달걀은 둥근 쪽을 위로 하여 보관!',
    purchaseOrder: 3,
    purchaseCategory: '냉장 필요식품',
    storageOrder: 4,
    storageTip: '살모넬라균 억제와 신선도 유지를 위해 4순위로 보관!',
  },
  {
    id: 'item-opened-tuna-box',
    name: '먹다 남은 개봉 참치',
    emoji: '🥫',
    category: '냉장 필요식품',
    correctZoneId: 'FRIDGE_TOP',
    hint: '개봉 통조림',
    reason: '교과서 냉장 보관 〈위 칸〉: 개봉한 통조림은 용기에 담아 덮개를 덮어 위 칸에 보관!',
    purchaseOrder: 3,
    purchaseCategory: '냉장 필요식품',
    storageOrder: 4,
    storageTip: '개봉 캔 부식 방지 및 밀폐 보관을 위해 4순위로 보관!',
  },

  // 2. 채소, 과일류 (구매 2순위 ➔ 보관 5순위: 신선도 유지!)
  {
    id: 'item-spinach',
    name: '시금치',
    emoji: '🥬',
    category: '채소, 과일류',
    correctZoneId: 'FRIDGE_BOTTOM',
    hint: '채소류',
    reason: '교과서 냉장 보관 〈아래 칸〉: 채소류는 씻어서 밀폐 용기에 담아 아래 칸에 보관!',
    purchaseOrder: 2,
    purchaseCategory: '채소, 과일류',
    storageOrder: 5,
    storageTip: '세척 및 밀폐하여 신선 야채실(아래 칸)에 5순위로 보관!',
  },
  {
    id: 'item-grapes',
    name: '포도 & 방울토마토',
    emoji: '🍇',
    category: '채소, 과일류',
    correctZoneId: 'FRIDGE_BOTTOM',
    hint: '과일류',
    reason: '교과서 냉장 보관 〈아래 칸〉: 과일류는 채소와 칸을 나누어 아래 칸에 보관!',
    purchaseOrder: 2,
    purchaseCategory: '채소, 과일류',
    storageOrder: 5,
    storageTip: '수분 유지와 무름 방지를 위해 야채실에 5순위로 보관!',
  },

  // 1. 냉장 필요없는 식품 (구매 1순위 ➔ 보관 6순위: 실온 여유 보관!)
  {
    id: 'item-potatoes',
    name: '감자',
    emoji: '🥔',
    category: '냉장 필요없는 식품',
    correctZoneId: 'ROOM_TEMP',
    hint: '감자류',
    reason: '교과서 실온 보관: 감자류는 서늘한 실온에 보관!',
    purchaseOrder: 1,
    purchaseCategory: '냉장 필요없는 식품',
    storageOrder: 6,
    storageTip: '실온에서도 안전하므로 냉장고 수납 후 6순위(마지막)로 정리!',
  },
  {
    id: 'item-banana',
    name: '바나나',
    emoji: '🍌',
    category: '냉장 필요없는 식품',
    correctZoneId: 'ROOM_TEMP',
    hint: '열대 과일',
    reason: '교과서 실온 보관: 열대 과일(바나나 등)은 서늘하고 통풍이 잘되는 실온에 보관!',
    purchaseOrder: 1,
    purchaseCategory: '냉장 필요없는 식품',
    storageOrder: 6,
    storageTip: '저온장해를 피하기 위해 실온 바구니에 6순위(마지막)로 정리!',
  },
  {
    id: 'item-unopened-can',
    name: '미개봉 통조림 캔',
    emoji: '🥫',
    category: '냉장 필요없는 식품',
    correctZoneId: 'ROOM_TEMP',
    hint: '미개봉 통조림',
    reason: '교과서 실온 보관: 미개봉 통조림은 상온 보관이 원칙입니다.',
    purchaseOrder: 1,
    purchaseCategory: '냉장 필요없는 식품',
    storageOrder: 6,
    storageTip: '멸균 가공품이므로 상온 건조 팬트리에 6순위(마지막)로 정리!',
  },
  {
    id: 'item-onions-garlic',
    name: '통양파 & 마늘 망',
    emoji: '🧅',
    category: '냉장 필요없는 식품',
    correctZoneId: 'ROOM_TEMP',
    hint: '양파, 마늘',
    reason: '교과서 실온 보관: 양파, 마늘은 통풍이 잘되는 그늘진 실온에 보관!',
    purchaseOrder: 1,
    purchaseCategory: '냉장 필요없는 식품',
    storageOrder: 6,
    storageTip: '습기 차지 않게 그늘진 실온 바구니에 6순위(마지막)로 정리!',
  },
  {
    id: 'item-gim',
    name: '김',
    emoji: '🍙',
    category: '냉장 필요없는 식품',
    correctZoneId: 'ROOM_TEMP',
    hint: '김 (건조식품)',
    reason: '실온 보관: 김은 습기와 직사광선을 피해 서늘하고 건조한 실온 보관 바구니에 보관합니다.',
    purchaseOrder: 1,
    purchaseCategory: '냉장 필요없는 식품',
    storageOrder: 6,
    storageTip: '실온 보관 바구니에 6순위(마지막)로 정리!',
  },
  {
    id: 'item-bread',
    name: '식빵',
    emoji: '🍞',
    category: '냉장 필요없는 식품',
    correctZoneId: 'ROOM_TEMP',
    hint: '식빵',
    reason: '실온 보관: 식빵은 밀봉하여 실온에 보관합니다. (냉장실에 넣으면 빵이 빨리 딱딱해져요)',
    purchaseOrder: 1,
    purchaseCategory: '냉장 필요없는 식품',
    storageOrder: 6,
    storageTip: '냉장 보관은 딱딱해지므로 실온 보관 바구니에 6순위로 정리!',
  },
];

export const INITIAL_TEAMS = [
  { id: 'team-1', name: '1모둠 씩씩이', color: '#0284c7', members: '' },
  { id: 'team-2', name: '2모둠 알뜰이', color: '#16a34a', members: '' },
  { id: 'team-3', name: '3모둠 척척이', color: '#d97706', members: '' },
  { id: 'team-4', name: '4모둠 씽씽이', color: '#7c3aed', members: '' },
  { id: 'team-5', name: '5모둠 튼튼이', color: '#e11d48', members: '' },
  { id: 'team-6', name: '6모둠 슬기', color: '#0891b2', members: '' },
  { id: 'team-7', name: '7모둠 번쩍이', color: '#ea580c', members: '' },
];


