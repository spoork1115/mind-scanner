// 임시 메모리 데이터베이스 (Vercel Serverless Function warm start 범위 내 작동)
// 데이터가 유실되더라도 항상 매칭이 가능하도록 Mock 임직원 시드 데이터를 내장합니다.

if (!global.officeUniverseDb) {
  global.officeUniverseDb = {
    participants: [
      {
        id: 'seed-uuid-1',
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
        role: '사원/연구원',
        age: 29,
        gender: 'F',
        zodiac: '돼지',
        mood: 'wink',
        mbti: 'INFP',
        registeredAt: new Date().toISOString()
      }
    ]
  };
}

export const db = {
  // 전체 리스트 조회
  getParticipants: () => {
    return global.officeUniverseDb.participants;
  },
  
  // 신규 등록
  addParticipant: (participant) => {
    const newRecord = {
      ...participant,
      id: participant.id || 'usr-' + Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString()
    };
    
    // 중복 제거 후 추가 (사번이나 식별 정보가 없으므로 uuid로 관리)
    global.officeUniverseDb.participants = global.officeUniverseDb.participants.filter(
      p => p.id !== newRecord.id
    );
    global.officeUniverseDb.participants.push(newRecord);
    return newRecord;
  },

  // 24시간 지난 구 데이터 파기 (당일 자정 파기 규정 준수)
  cleanupExpired: () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const beforeCount = global.officeUniverseDb.participants.length;
    // 시드 데이터는 유지하고, 당일 생성된 실 데이터 중 날짜가 지난 데이터만 필터링 파기
    global.officeUniverseDb.participants = global.officeUniverseDb.participants.filter(p => {
      if (p.id.startsWith('seed-uuid-')) return true; // 시드는 보관
      const regTime = new Date(p.registeredAt).getTime();
      return regTime >= todayStart; // 오늘 생성된 데이터만 유지
    });
    
    return {
      cleanedCount: beforeCount - global.officeUniverseDb.participants.length
    };
  }
};
