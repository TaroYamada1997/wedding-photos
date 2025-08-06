import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    })

    if (existingAdmin) {
      return NextResponse.json({
        message: '管理者ユーザーは既に作成されています。',
        admin: { username: 'admin' }
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      message: '管理者ユーザーが正常に作成されました。',
      admin: { 
        id: admin.id, 
        username: admin.username 
      },
      login: {
        username: 'admin',
        password: 'admin123'
      }
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json(
      { 
        error: '初期化に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}