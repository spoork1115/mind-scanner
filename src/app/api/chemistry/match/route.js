import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// MBTI 궁합 가중치 연산 함수
function calculateChemistryScore(user, partner) {
  let score = 50; // 기본 점수

  const uMbti = user.mbti;
  const pMbti = partner.mbti;

  if (!uMbti || !pMbti || uMbti.length !== 4 || pMbti.length !== 4) return score;

  // 1. 인식 기능 (N/S) 일치 여부: 세상을 바라보는 관점이 같을 때 소통이 잘 통하므로 보너스
  if (uMbti[1] === pMbti[1]) {
    score += 20;
  }

  // 2. 판단 기능 (T/F) 불일치 여부: 머리와 가슴의 상호보완적인 시너지
  if (uMbti[2] !== pMbti[2]) {
    score += 15;
  }

  // 3. 외향/내향 (E/I) 불일치 여부: 한쪽이 주도하고 한쪽이 경청하는 조화
  if (uMbti[0] !== pMbti[0]) {
    score += 10;
  }

  // 4. 생활 양식 (P/J) 불일치 여부: 계획성과 유연성의 보완
  if (uMbti[3] !== pMbti[3]) {
    score += 5;
  }

  // 5. 띠별 조화 (삼합 매칭 보너스: 예 - 쥐/용/원숭이, 소/뱀/닭, 호랑이/말/개, 토끼/양/돼지)
  const zodiacHarmony = {
    '쥐': ['용', '원숭이'],
    '소': ['뱀', '닭'],
    '호랑이': ['말', '개'],
    '토끼': ['양', '돼지'],
    '용': ['쥐', '원숭이'],
    '뱀': ['소', '닭'],
    '말': ['호랑이', '개'],
    '양': ['토끼', '돼지'],
    '원숭이': ['쥐', '용'],
    '닭': ['소', '뱀'],
    '개': ['호랑이', '말'],
    '돼지': ['토끼', '양']
  };

  if (zodiacHarmony[user.zodiac]?.includes(partner.zodiac)) {
    score += 10; // 띠 궁합 삼합 보너스
  }

  return Math.min(100, score);
}

export async function POST(request) {
  try {
    const { participantId } = await request.json();

    if (!participantId) {
      return NextResponse.json({ error: '참여자 ID가 유효하지 않습니다.' }, { status: 400 });
    }

    const participants = db.getParticipants();
    const currentUser = participants.find(p => p.id === participantId);

    if (!currentUser) {
      return NextResponse.json({ error: '참여자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 본인 제외 및 매칭 대상 필터링
    const candidates = participants.filter(p => p.id !== participantId);

    if (candidates.length === 0) {
      return NextResponse.json({ error: '매칭 가능한 다른 임직원이 없습니다.' }, { status: 404 });
    }

    // 각 후보군과의 케미 점수 계산
    const scoredCandidates = candidates.map(partner => {
      const chemistryScore = calculateChemistryScore(currentUser, partner);
      return {
        partner,
        score: chemistryScore
      };
    });

    // 최고 점수 순 정렬
    scoredCandidates.sort((a, b) => b.score - a.score);
    const bestMatch = scoredCandidates[0];

    // 매칭 타이틀 및 조언 가이드 매핑
    let matchTitle = '환상의 협업 콤비';
    let matchAdvice = '서로의 강점을 살려 프로젝트를 성공시킬 최고의 파트너입니다. 오늘 커피 타임을 제안해 보세요!';

    if (currentUser.role !== bestMatch.partner.role) {
      matchTitle = '오늘의 베스트 런치 파트너';
      matchAdvice = '역할과 직책이 다른 신선한 조합입니다. 오늘 점심은 격식 없이 편안하게 같이 나누며 소통하기 좋습니다.';
    }

    return NextResponse.json({
      success: true,
      partner: {
        role: bestMatch.partner.role,
        zodiac: bestMatch.partner.zodiac,
        mood: bestMatch.partner.mood,
        mbti: bestMatch.partner.mbti,
      },
      chemistryScore: bestMatch.score,
      matchTitle,
      matchAdvice
    });

  } catch (err) {
    console.error('Match API Error:', err);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
