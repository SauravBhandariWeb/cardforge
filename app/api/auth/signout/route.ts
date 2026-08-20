import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await removeAuthCookie();

    return NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
