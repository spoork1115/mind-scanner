import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { questions } from '@/data/questions';
import { 
  RESULT_TYPES, 
  generateWitNickname, 
  calculateScore, 
  analyzeRelationship 
} from '@/data/resultTypes';


export async function POST(request) {
  try {
    // 1. 동기화 초기화
    await db.init();

    const { profile, answers, hostId } = await request.json();

    // 타로 단독 혹은 설문 답변 유효성 검사
    if (!profile || (!answers && !profile.tarotId)) {
      return NextResponse.json({ error: '필수 데이터가 부족합니다.' }, { status: 400 });
    }

    // 2. 성향 지표 합산
    const scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, P: 0, J: 0 };
    let burnoutScore = 0;
    let mbti = 'ISFP'; // 기본값

    // 설문 답변이 있는 경우
    if (answers && Object.keys(answers).length > 0) {
      questions.forEach(q => {
        const selectedOptionIndex = answers[q.id];
        if (selectedOptionIndex === undefined) return;
        
        const option = q.options[selectedOptionIndex === 'A' ? 0 : 1];
        if (!option) return;

        Object.keys(option.score).forEach(key => {
          scores[key] += option.score[key];
        });
        burnoutScore += option.burnout;
      });

      mbti = [
        scores.E >= 2 ? 'E' : 'I',
        scores.N >= 2 ? 'N' : 'S',
        scores.T >= 2 ? 'T' : 'F',
        scores.P >= 2 ? 'P' : 'J'
      ].join('');
    } else {
      // 타로 단독 모드인 경우 타로 카드에 기반해 가상의 성격 유형 대입
      const tarotMbti = { fool: 'ENFP', magician: 'ENTP', empress: 'ESFJ', hermit: 'INTJ', chariot: 'ESTJ', wheel: 'ESFP' };
      mbti = tarotMbti[profile.tarotId] || 'ISFP';
    }

    // 3. 결과 템플릿 매핑
    const baseResult = RESULT_TYPES[mbti] || RESULT_TYPES.ISFP;
    
    // 4. 계획된 우연 이론 기반 맞춤 텍스트 가공
    const personalizedFortune = `올해 ${profile.zodiac}띠 생존 흐름과 사내 ${profile.role} 직무 역학을 결합해 분석한 결과입니다. ${baseResult.fortune}`;
    const personalizedWarning = `${profile.role} 역할로서 업무 도중 ${baseResult.warning}`;

    // 5. 번아웃 자가 진단 평가
    let burnoutState = 'safe'; 
    let burnoutTitle = '양호 (충전 중)';
    let burnoutAdvice = '업무 강도가 적절하며, 스트레스 관리가 잘 되고 있습니다. 현재 페이스를 유지하세요!';
    let showBenefitLink = false;

    if (burnoutScore >= 3) {
      burnoutState = 'danger';
      burnoutTitle = '경고 (방전 경보! 🔥)';
      burnoutAdvice = '업무 피로도가 한계치에 다다랐습니다. "오후 3시 커피 쏟음 주의!" 잠시 옥상 바람을 쐬거나 사내 복지 시설을 꼭 이용하세요.';
      showBenefitLink = true;
    } else if (burnoutScore >= 1) {
      burnoutState = 'warning';
      burnoutTitle = '주의 (피로 누적)';
      burnoutAdvice = '자신도 모르게 피로가 누적되고 있습니다. 예정에 없던 회의나 갑작스러운 추가 업무는 차분히 우선순위를 나누어 처리하세요.';
    }

    // 위트 있는 자동 닉네임 생성 (타로 카드 ID 도 함께 반영)
    const witNickname = generateWitNickname(mbti, profile.zodiac, profile.role, profile.tarotId);

    // 6. 데이터베이스에 저장
    const participantId = 'usr-' + Math.random().toString(36).substr(2, 9);
    const savedRecord = await db.addParticipant({
      id: participantId,
      name: witNickname,
      role: profile.role,
      age: profile.age,
      gender: profile.gender,
      zodiac: profile.zodiac,
      mood: profile.mood,
      mbti: mbti,
      tarotId: profile.tarotId || null,
      tarotCards: profile.tarotCards || null,
      tarotQuestion: profile.tarotQuestion || null,
      tarotSpread: profile.tarotSpread || null
    });

    // 7. 호스트 ID가 넘어왔을 경우 관계도 매핑 처리 (양방향 연결)
    let relationRecord = null;
    let hostName = '';
    if (hostId) {
      const hostUser = db.getParticipants().find(p => p.id === hostId);
      if (hostUser) {
        hostName = hostUser.name;
        const score = calculateScore(hostUser, savedRecord);
        const relType = analyzeRelationship(hostUser, savedRecord, score);
        
        relationRecord = await db.addRelation({
          hostId: hostId,
          hostName: hostUser.name,
          hostMbti: hostUser.mbti,
          hostZodiac: hostUser.zodiac,
          hostRole: hostUser.role,
          guestId: savedRecord.id,
          guestName: savedRecord.name,
          guestBirth: profile.birthDate || '',
          guestZodiac: savedRecord.zodiac,
          guestRole: savedRecord.role,
          guestMbti: mbti,
          influenceType: relType.type,
          influenceTitle: relType.title,
          influenceDesc: relType.desc,
          compatibilityScore: score
        });
      }
    }

    // 최종 결과 JSON 리턴
    return NextResponse.json({
      success: true,
      participantId: savedRecord.id,
      mbti: mbti,
      title: baseResult.title,
      mascot: baseResult.mascot,
      description: baseResult.description,
      fortune: personalizedFortune,
      happenstance: baseResult.happenstance,
      happenstanceType: baseResult.happenstanceType,
      warning: personalizedWarning,
      burnout: {
        score: burnoutScore,
        state: burnoutState,
        title: burnoutTitle,
        advice: burnoutAdvice,
        showBenefit: showBenefitLink
      },
      scores: scores,
      tarotId: profile.tarotId || null,
      tarotCards: profile.tarotCards || null,
      tarotQuestion: profile.tarotQuestion || null,
      tarotSpread: profile.tarotSpread || null,
      name: witNickname,
      relation: relationRecord ? {
        hostName: hostName,
        influenceType: relationRecord.influenceType,
        influenceTitle: relationRecord.influenceTitle,
        influenceDesc: relationRecord.influenceDesc,
        compatibilityScore: relationRecord.compatibilityScore
      } : null
    });

  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
