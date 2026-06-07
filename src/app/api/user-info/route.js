export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RESULT_TYPES } from '@/data/resultTypes';

export async function GET(request) {
  try {
    await db.init(); // 클라우드 DB 연동 초기화
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID 파라미터가 유효하지 않습니다.' }, { status: 400 });
    }

    const participants = db.getParticipants();
    const user = participants.find(p => p.id === id);

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    const mbti = user.mbti || 'ISFP';
    const baseResult = RESULT_TYPES[mbti] || RESULT_TYPES.ISFP;
    
    // 계획된 우연 이론 기반 맞춤 텍스트 가공
    const personalizedFortune = `올해 ${user.zodiac}띠 생존 흐름과 사내 ${user.role} 직무 역학을 결합해 분석한 결과입니다. ${baseResult.fortune}`;
    const personalizedWarning = `${user.role} 역할로서 업무 도중 ${baseResult.warning}`;

    const burnoutState = 'safe';
    const burnoutTitle = '양호 (충전 중)';
    const burnoutAdvice = '업무 강도가 적절하며, 스트레스 관리가 잘 되고 있습니다. 현재 페이스를 유지하세요!';

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        zodiac: user.zodiac,
        mbti: user.mbti,
        title: baseResult.title,
        mascot: baseResult.mascot,
        description: baseResult.description,
        fortune: personalizedFortune,
        happenstance: baseResult.happenstance,
        happenstanceType: baseResult.happenstanceType,
        warning: personalizedWarning,
        burnout: {
          score: 0,
          state: burnoutState,
          title: burnoutTitle,
          advice: burnoutAdvice,
          showBenefit: false
        },
        scores: {
          E: mbti.includes('E') ? 2 : 0,
          I: mbti.includes('I') ? 2 : 0,
          N: mbti.includes('N') ? 2 : 0,
          S: mbti.includes('S') ? 2 : 0,
          T: mbti.includes('T') ? 2 : 0,
          F: mbti.includes('F') ? 2 : 0,
          P: mbti.includes('P') ? 2 : 0,
          J: mbti.includes('J') ? 2 : 0
        },
        tarotId: user.tarotId || null,
        tarotCards: user.tarotCards || null,
        tarotQuestion: user.tarotQuestion || null,
        tarotSpread: user.tarotSpread || null
      }
    });
  } catch (err) {
    console.error('User info API Error:', err);
    return NextResponse.json({ error: '서버 에러' }, { status: 500 });
  }
}

