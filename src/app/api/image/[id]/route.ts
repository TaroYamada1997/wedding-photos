import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: params.id },
      select: { imageData: true, mimeType: true }
    })

    if (!photo) {
      return NextResponse.json(
        { error: '画像が見つかりません' },
        { status: 404 }
      )
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(photo.imageData, 'base64')

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': photo.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Image fetch error:', error)
    return NextResponse.json(
      { error: '画像の取得に失敗しました' },
      { status: 500 }
    )
  }
}