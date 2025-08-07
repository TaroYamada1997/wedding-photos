import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { uploadToS3 } from '@/lib/s3'

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

    // Validate file size (10MB for S3)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズが大きすぎます (最大10MB)' },
        { status: 400 }
      )
    }

    // Convert file to buffer for S3 upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `${uuidv4()}.${fileExtension}`

    // Upload to S3
    const imageUrl = await uploadToS3(buffer, filename, file.type)

    // Save to Supabase database
    const photo = await prisma.photo.create({
      data: {
        nickname: nickname.trim(),
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        imageUrl, // Store S3 URL instead of base64
      },
    })

    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id,
        nickname: photo.nickname,
        filename: photo.filename,
        imageUrl: photo.imageUrl,
        createdAt: photo.createdAt,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'アップロードに失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : error) : undefined
      },
      { status: 500 }
    )
  }
}