import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('photo') as File
    const nickname = formData.get('nickname') as string

    if (!file || !nickname) {
      return NextResponse.json(
        { error: 'ファイルとニックネームが必要です' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '画像ファイルのみアップロード可能です' },
        { status: 400 }
      )
    }

    // Validate file size (5MB for Vercel)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズが大きすぎます (最大5MB)' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')

    // Generate unique filename for reference
    const filename = `${uuidv4()}.${file.type.split('/')[1]}`

    // Save to database with base64 data
    const photo = await prisma.photo.create({
      data: {
        nickname: nickname.trim(),
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        imageData: base64Data,
      },
    })

    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id,
        nickname: photo.nickname,
        filename: photo.filename,
        createdAt: photo.createdAt,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'アップロードに失敗しました' },
      { status: 500 }
    )
  }
}