// 임시 메모리 데이터베이스 (Vercel Serverless Function warm start 범위 내 작동)
// 데이터가 유실되더라도 항상 매칭이 가능하도록 Mock 임직원 시드 데이터를 내장합니다.

if (!global.officeUniverseDb) {
  global.officeUniverseDb = {
    participants: [
      {
        id: 'seed-uuid-1',
        name: '김도훈 대리',
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
        name: '이지원 인턴',
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
        name: '박서준 과장',
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
        name: '최민수 부장',
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
        name: '한소희 사원',
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
        guestName: '김도훈 대리',
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
        guestName: '최민수 부장',
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

  // 관계 전체 조회
  getRelations: () => {
    return global.officeUniverseDb.relations;
  },

  // 특정 사용자가 호스트이거나 게스트인 관계 목록 전체 조회 (양방향 조회)
  getRelationsByUser: (userId) => {
    return global.officeUniverseDb.relations.filter(
      r => r.hostId === userId || r.guestId === userId
    );
  },

  // 특정 호스트에 대한 게스트의 관계도 목록 조회
  getRelationsByHost: (hostId) => {
    return global.officeUniverseDb.relations.filter(r => r.hostId === hostId);
  },

  // 관계 추가
  addRelation: (relation) => {
    const newRelation = {
      ...relation,
      id: relation.id || 'rel-' + Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString()
    };
    global.officeUniverseDb.relations.push(newRelation);
    return newRelation;
  },

  // 24시간 지난 구 데이터 파기 (당일 자정 파기 규정 준수)
  cleanupExpired: () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const beforePartCount = global.officeUniverseDb.participants.length;
    const beforeRelCount = global.officeUniverseDb.relations.length;

    // 시드 데이터는 유지하고, 당일 생성된 실 데이터 중 날짜가 지난 데이터만 필터링 파기
    global.officeUniverseDb.participants = global.officeUniverseDb.participants.filter(p => {
      if (p.id.startsWith('seed-uuid-')) return true; // 시드는 보관
      const regTime = new Date(p.registeredAt).getTime();
      return regTime >= todayStart; // 오늘 생성된 데이터만 유지
    });

    global.officeUniverseDb.relations = global.officeUniverseDb.relations.filter(r => {
      if (r.id.startsWith('seed-rel-')) return true; // 시드는 보관
      const regTime = new Date(r.registeredAt).getTime();
      return regTime >= todayStart;
    });
    
    return {
      cleanedParticipantsCount: beforePartCount - global.officeUniverseDb.participants.length,
      cleanedRelationsCount: beforeRelCount - global.officeUniverseDb.relations.length
    };
  }
};
