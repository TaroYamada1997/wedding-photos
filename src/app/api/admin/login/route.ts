import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'ユーザー名とパスワードが必要です' },
        { status: 400 }
      )
    }

    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // Create simple session (in production, use proper JWT or session management)
    const response = NextResponse.json({
      success: true,
      message: 'ログインに成功しました'
    })

    // Set a simple session cookie
    response.cookies.set('admin-session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'ログインに失敗しました' },
      { status: 500 }
    )
  }
}