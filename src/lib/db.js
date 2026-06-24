import { createClient } from '@supabase/supabase-js'

// Vercel 환경 변수에서 Supabase 설정 불러오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 실제 Supabase 설정이 비어있거나 dummy 값인 경우 인메모리 데이터베이스를 사용하도록 판단
const isDummy = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('dummy-url');

if (isDummy) {
  console.warn('[Supabase] Environment variables are missing or invalid. Falling back to In-Memory Database.');
}

// Create a single supabase client if configuration is valid
const supabase = !isDummy ? createClient(supabaseUrl, supabaseAnonKey) : null;

// 인메모리 DB 스토어
const memoryStore = {
  participants: [],
  relations: []
};

export const db = {
  // DB 초기화 함수는 Supabase 환경에서는 불필요하나 이전 코드 호환성을 위해 빈 함수 유지
  init: async () => {},

  // 전체 리스트 조회
  getParticipants: async () => {
    if (isDummy) {
      return memoryStore.participants;
    }
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*');
      if (error) {
        console.error('getParticipants Error:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getParticipants Exception:', err);
      return [];
    }
  },
  
  // 신규 등록
  addParticipant: async (participant) => {
    const newRecord = {
      ...participant,
      id: participant.id || 'usr-' + Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString()
    };

    if (isDummy) {
      const idx = memoryStore.participants.findIndex(p => p.id === newRecord.id);
      if (idx > -1) {
        memoryStore.participants[idx] = newRecord;
      } else {
        memoryStore.participants.push(newRecord);
      }
      return newRecord;
    }

    try {
      const { data, error } = await supabase
        .from('participants')
        .insert([newRecord])
        .select();

      if (error) {
        console.error('addParticipant Error:', error);
        return newRecord; // 에러 발생 시에도 진행을 위해 fallback
      }
      return data?.[0] || newRecord;
    } catch (err) {
      console.error('addParticipant Exception:', err);
      return participant;
    }
  },

  // 관계 전체 조회
  getRelations: async () => {
    if (isDummy) {
      return memoryStore.relations;
    }
    try {
      const { data, error } = await supabase
        .from('relations')
        .select('*');
      if (error) {
        console.error('getRelations Error:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getRelations Exception:', err);
      return [];
    }
  },

  // 특정 사용자가 호스트이거나 게스트인 관계 목록 전체 조회
  getRelationsByUser: async (userId) => {
    if (isDummy) {
      const relations = memoryStore.relations.filter(r => r.hostId === userId || r.guestId === userId);
      
      const hostIds = relations
        .filter(r => r.guestId === userId)
        .map(r => r.hostId);

      if (hostIds.length > 0) {
        const networkRelations = memoryStore.relations.filter(r => hostIds.includes(r.hostId));
        const combined = [...relations];
        networkRelations.forEach(nr => {
          if (!combined.some(c => c.id === nr.id)) {
            combined.push(nr);
          }
        });
        return combined;
      }
      return relations;
    }

    try {
      const { data: directRelations, error } = await supabase
        .from('relations')
        .select('*')
        .or(`hostId.eq.${userId},guestId.eq.${userId}`);

      if (error) {
        console.error('getRelationsByUser Error:', error);
        return [];
      }

      const relations = directRelations || [];

      // 2. 내가 게스트로 참여해 엮인 호스트의 ID 목록을 추출
      const hostIds = relations
        .filter(r => r.guestId === userId)
        .map(r => r.hostId);

      if (hostIds.length > 0) {
        // 해당 호스트들이 맺은 다른 모든 관계를 조회 (in 쿼리)
        const { data: networkRelations, error: netError } = await supabase
          .from('relations')
          .select('*')
          .in('hostId', hostIds);

        if (!netError && networkRelations) {
          // 중복 병합
          const combined = [...relations];
          networkRelations.forEach(nr => {
            if (!combined.some(c => c.id === nr.id)) {
              combined.push(nr);
            }
          });
          return combined;
        }
      }

      return relations;
    } catch (err) {
      console.error('getRelationsByUser Exception:', err);
      return [];
    }
  },

  // 특정 호스트에 대한 게스트의 관계도 목록 조회
  getRelationsByHost: async (hostId) => {
    if (isDummy) {
      return memoryStore.relations.filter(r => r.hostId === hostId);
    }
    try {
      const { data, error } = await supabase
        .from('relations')
        .select('*')
        .eq('hostId', hostId);
      
      if (error) {
        console.error('getRelationsByHost Error:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getRelationsByHost Exception:', err);
      return [];
    }
  },

  // 관계 추가
  addRelation: async (relation) => {
    const newRelation = {
      ...relation,
      id: relation.id || 'rel-' + Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString()
    };

    if (isDummy) {
      const idx = memoryStore.relations.findIndex(r => r.id === newRelation.id);
      if (idx > -1) {
        memoryStore.relations[idx] = newRelation;
      } else {
        memoryStore.relations.push(newRelation);
      }
      return newRelation;
    }

    try {
      const { data, error } = await supabase
        .from('relations')
        .insert([newRelation])
        .select();

      if (error) {
        console.error('addRelation Error:', error);
        return newRelation;
      }
      return data?.[0] || newRelation;
    } catch (err) {
      console.error('addRelation Exception:', err);
      return relation;
    }
  },

  // 오래된 데이터 파기
  cleanupExpired: async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    if (isDummy) {
      memoryStore.participants = memoryStore.participants.filter(p => p.registeredAt >= todayStart);
      memoryStore.relations = memoryStore.relations.filter(r => r.registeredAt >= todayStart);
      return { success: true };
    }

    try {
      // participants 정리
      const { error: pError } = await supabase
        .from('participants')
        .delete()
        .lt('registeredAt', todayStart);

      // relations 정리
      const { error: rError } = await supabase
        .from('relations')
        .delete()
        .lt('registeredAt', todayStart);

      if (pError || rError) {
        console.error('cleanupExpired Error:', pError, rError);
      }
      
      return { success: true };
    } catch (err) {
      console.error('cleanupExpired Exception:', err);
      return { success: false };
    }
  }
}
