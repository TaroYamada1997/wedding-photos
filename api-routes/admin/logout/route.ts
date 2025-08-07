import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'ログアウトしました'
    })

    // Clear the session cookie
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'ログアウトに失敗しました' },
      { status: 500 }
    )
  }
}