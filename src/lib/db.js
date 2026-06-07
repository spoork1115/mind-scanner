// 임시 메모리 데이터베이스 (Vercel Serverless Function warm start 범위 내 작동)
// 데이터가 유실되더라도 항상 매칭이 가능하도록 Mock 임직원 시드 데이터를 내장합니다.
// 버셀 배포 시 데이터 유실을 해결하기 위해 공개 무료 Key-Value 스토어 API를 연동합니다.

import fs from 'fs';
import path from 'path';

const CLOUD_DB_URL = 'https://api.keyvalue.xyz/39a2fb37/mindmirror';
const DB_FILE_PATH = path.join(process.cwd(), 'src/data/db-store.json');

// 기본 로컬 메모리 구조 초기화
if (!global.officeUniverseDb) {
  global.officeUniverseDb = {
    participants: [
      {
        id: 'seed-uuid-1',
        name: '철두철미 엑셀마스터 토끼대리',
        role: '대리/선임',
        age: 31,
        gender: 'M',
        zodiac: '토끼',
        mood: 'energetic',
        mbti: 'ENFP',
        registeredAt: new Date().toISOString()
      },
      {
        id: 'seed-uuid-2',
        name: '보이지않는 서포터 뱀주니어',
        role: '인턴/주니어',
        age: 25,
        gender: 'F',
        zodiac: '뱀',
        mood: 'smile',
        mbti: 'ISFJ',
        registeredAt: new Date().toISOString()
      },
      {
        id: 'seed-uuid-3',
        name: '전략기획실 AI 말과장',
        role: '과장/차장/책임',
        age: 37,
        gender: 'M',
        zodiac: '말',
        mood: 'think',
        mbti: 'INTJ',
        registeredAt: new Date().toISOString()
      },
      {
        id: 'seed-uuid-4',
        name: '정시퇴근 캘린더 개부장',
        role: '부장/수석',
        age: 46,
        gender: 'M',
        zodiac: '개',
        mood: 'sad',
        mbti: 'ESTJ',
        registeredAt: new Date().toISOString()
      },
      {
        id: 'seed-uuid-5',
        name: '회의실구석 몽상가 돼지사원',
        role: '사원/연구원',
        age: 29,
        gender: 'F',
        zodiac: '돼지',
        mood: 'wink',
        mbti: 'INFP',
        registeredAt: new Date().toISOString()
      }
    ],
    relations: [
      {
        id: 'seed-rel-1',
        hostId: 'seed-uuid-3',
        guestId: 'seed-uuid-1',
        guestName: '철두철미 엑셀마스터 토끼대리',
        guestBirth: '1999-04-12',
        guestZodiac: '토끼',
        guestRole: '대리/선임',
        guestMbti: 'ENFP',
        influenceType: 'savior',
        influenceTitle: '오늘의 구원자 👼',
        influenceDesc: '답답한 기획 회의에서 기막힌 쉴드로 당신을 구해줄 사람입니다.',
        compatibilityScore: 95,
        registeredAt: new Date().toISOString()
      },
      {
        id: 'seed-rel-2',
        hostId: 'seed-uuid-3',
        guestId: 'seed-uuid-4',
        guestName: '정시퇴근 캘린더 개부장',
        guestBirth: '1982-10-09',
        guestZodiac: '개',
        guestRole: '부장/수석',
        guestMbti: 'ESTJ',
        influenceType: 'villain',
        influenceTitle: '피해야 할 대상 ☠️',
        influenceDesc: '사소한 의견 차이도 스파크로 번질 수 있습니다. 보고 메일 발송은 한 템포 늦추세요.',
        compatibilityScore: 45,
        registeredAt: new Date().toISOString()
      }
    ]
  };
}

// 로컬 파일에서 데이터 로드
function loadFromFile() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileData = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      if (fileData.trim()) {
        const data = JSON.parse(fileData);
        if (data && Array.isArray(data.participants) && Array.isArray(data.relations)) {
          global.officeUniverseDb.participants = data.participants;
          global.officeUniverseDb.relations = data.relations;
          return true;
        }
      }
    }
  } catch (err) {
    console.error('Local File DB Load Failed:', err);
  }
  return false;
}

// 로컬 파일에 데이터 저장
function saveToFile() {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(global.officeUniverseDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Local File DB Save Failed:', err);
  }
}

// 클라우드 저장소로부터 데이터를 읽어와서 메모리 싱크
async function loadFromCloud() {
  try {
    // 1단계: 로컬 파일에서 데이터 로드 (로컬이 가장 우선/최신)
    loadFromFile();

    // 2단계: 클라우드 DB 연동 (오프라인/단절 대비 예외 처리 장착)
    const res = await fetch(CLOUD_DB_URL, { 
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 0 } // Next.js 캐싱 우회
    });
    if (res.ok) {
      const text = await res.text();
      if (!text || text.trim() === '' || text.trim() === '""') {
        // 클라우드가 빈 데이터 반환 → 로컬/메모리 유지
        console.log('Cloud returned empty data, keeping local.');
        return false;
      }
      const data = JSON.parse(text);
      if (data && Array.isArray(data.participants) && Array.isArray(data.relations)) {
        // 기존 메모리 데이터와 클라우드 데이터를 ID 기반으로 병합 (데이터 유실 방지)
        const mergedParticipants = [...global.officeUniverseDb.participants];
        data.participants.forEach(cp => {
          if (!mergedParticipants.some(mp => mp.id === cp.id)) {
            mergedParticipants.push(cp);
          }
        });

        const mergedRelations = [...global.officeUniverseDb.relations];
        data.relations.forEach(cr => {
          if (!mergedRelations.some(mr => mr.id === cr.id)) {
            mergedRelations.push(cr);
          }
        });

        global.officeUniverseDb.participants = mergedParticipants;
        global.officeUniverseDb.relations = mergedRelations;
        // 로컬에 최신 본 반영
        saveToFile();
        return true;
      }
    }
  } catch (err) {
    console.error('Cloud DB Load Failed, using memory/file:', err);
  }
  return false;
}

// 현재 메모리 상태를 클라우드에 비동기/동기 업로드 보관
async function syncToCloud() {
  try {
    // 1단계: 로컬 파일에 먼저 확실하게 백업 저장
    saveToFile();

    // 2단계: 원격 클라우드 DB 동기화 시도
    await fetch(CLOUD_DB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(global.officeUniverseDb)
    });
  } catch (err) {
    console.error('Cloud DB Sync Failed:', err);
  }
}

export const db = {
  // DB 초기화 및 최신 정보 동기화 (각 API의 시작 지점에 호출하여 분산 서버리스 환경 지원)
  init: async () => {
    await loadFromCloud();
  },

  // 전체 리스트 조회
  getParticipants: () => {
    return global.officeUniverseDb.participants;
  },
  
  // 신규 등록
  addParticipant: async (participant) => {
    const newRecord = {
      ...participant,
      id: participant.id || 'usr-' + Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString()
    };
    
    global.officeUniverseDb.participants = global.officeUniverseDb.participants.filter(
      p => p.id !== newRecord.id
    );
    global.officeUniverseDb.participants.push(newRecord);
    
    // 원격 DB 저장
    await syncToCloud();
    return newRecord;
  },

  // 관계 전체 조회
  getRelations: () => {
    return global.officeUniverseDb.relations;
  },

  // 특정 사용자가 호스트이거나 게스트인 관계 목록 전체 조회 (양방향 조회 + 게스트의 경우 호스트의 전체 팀 네트워크 조회 확장)
  getRelationsByUser: (userId) => {
    // 1. 내가 직접 관여된 모든 관계(내가 호스트이거나 게스트인 관계)를 필터링
    const directRelations = global.officeUniverseDb.relations.filter(
      r => r.hostId === userId || r.guestId === userId
    );

    // 2. 내가 게스트로 참여해 엮인 호스트의 ID 목록을 추출
    const hostIds = directRelations
      .filter(r => r.guestId === userId)
      .map(r => r.hostId);

    if (hostIds.length > 0) {
      // 3. 해당 호스트들이 맺은 다른 모든 게스트와의 관계도 함께 가져옴
      const networkRelations = global.officeUniverseDb.relations.filter(
        r => hostIds.includes(r.hostId)
      );

      // 4. 중복을 방지하며 두 목록을 병합
      const combined = [...directRelations];
      networkRelations.forEach(nr => {
        if (!combined.some(c => c.id === nr.id)) {
          combined.push(nr);
        }
      });
      return combined;
    }

    return directRelations;
  },

  // 특정 호스트에 대한 게스트의 관계도 목록 조회
  getRelationsByHost: (hostId) => {
    return global.officeUniverseDb.relations.filter(r => r.hostId === hostId);
  },

  // 관계 추가
  addRelation: async (relation) => {
    const newRelation = {
      ...relation,
      id: relation.id || 'rel-' + Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString()
    };
    global.officeUniverseDb.relations.push(newRelation);
    
    // 원격 DB 저장
    await syncToCloud();
    return newRelation;
  },

  // 24시간 지난 구 데이터 파기
  cleanupExpired: async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const beforePartCount = global.officeUniverseDb.participants.length;
    const beforeRelCount = global.officeUniverseDb.relations.length;

    global.officeUniverseDb.participants = global.officeUniverseDb.participants.filter(p => {
      if (p.id.startsWith('seed-uuid-')) return true;
      const regTime = new Date(p.registeredAt).getTime();
      return regTime >= todayStart;
    });

    global.officeUniverseDb.relations = global.officeUniverseDb.relations.filter(r => {
      if (r.id.startsWith('seed-rel-')) return true;
      const regTime = new Date(r.registeredAt).getTime();
      return regTime >= todayStart;
    });
    
    await syncToCloud();

    return {
      cleanedParticipantsCount: beforePartCount - global.officeUniverseDb.participants.length,
      cleanedRelationsCount: beforeRelCount - global.officeUniverseDb.relations.length
    };
  }
};
