import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const sessionCookie = request.cookies.get('admin-session')
    
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    // Fetch all photos ordered by creation date (newest first)
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        nickname: true,
        filename: true,
        originalName: true,
        mimeType: true,
        size: true,
        imageUrl: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      photos
    })
  } catch (error) {
    console.error('Fetch photos error:', error)
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    )
  }
}