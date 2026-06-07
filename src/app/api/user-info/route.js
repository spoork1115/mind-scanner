export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
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

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        role: user.role,
        zodiac: user.zodiac,
        mbti: user.mbti
      }
    });
  } catch (err) {
    console.error('User info API Error:', err);
    return NextResponse.json({ error: '서버 에러' }, { status: 500 });
  }
}
