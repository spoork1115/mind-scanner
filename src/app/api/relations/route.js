export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get('hostId');

    if (!hostId) {
      return NextResponse.json({ error: 'hostId 파라미터가 필요합니다.' }, { status: 400 });
    }

    const relations = db.getRelationsByHost(hostId);
    return NextResponse.json({
      success: true,
      relations
    });
  } catch (err) {
    console.error('Relations API Error:', err);
    return NextResponse.json({ error: '서버 에러' }, { status: 500 });
  }
}
