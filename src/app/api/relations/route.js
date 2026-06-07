export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    await db.init(); // 클라우드 DB 연동 초기화
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId 파라미터가 필요합니다.' }, { status: 400 });
    }

    const relations = db.getRelationsByUser(userId);
    return NextResponse.json({
      success: true,
      relations
    });
  } catch (err) {
    console.error('Relations API Error:', err);
    return NextResponse.json({ error: '서버 에러' }, { status: 500 });
  }
}
