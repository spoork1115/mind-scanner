import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    // 24시간 지난 데이터 파기 실행
    const result = db.cleanupExpired();
    
    return NextResponse.json({
      success: true,
      message: '보관 기간이 만료된 임직원 검사 로그를 성공적으로 정제 파기했습니다.',
      cleanedCount: result.cleanedCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Cleanup API Error:', err);
    return NextResponse.json({ error: '데이터 정제 스크립트 실행 중 에러가 발생했습니다.' }, { status: 500 });
  }
}

// POST 호출도 동일하게 대응
export async function POST(request) {
  return GET(request);
}
