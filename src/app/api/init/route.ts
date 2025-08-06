import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Try to create tables first (this will help with any schema issues)
    try {
      await prisma.$executeRaw`SELECT 1`; // Test connection
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { 
          error: 'データベース接続に失敗しました',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      )
    }

    // Check if admin already exists
    let existingAdmin;
    try {
      existingAdmin = await prisma.admin.findUnique({
        where: { username: 'admin' }
      })
    } catch (findError) {
      console.log('Admin table might not exist yet, will try to create admin anyway');
      existingAdmin = null;
    }

    if (existingAdmin) {
      return NextResponse.json({
        message: '管理者ユーザーは既に作成されています。',
        admin: { username: 'admin' },
        login: {
          username: 'admin',
          password: 'admin123'
        }
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
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : error) : undefined
      },
      { status: 500 }
    )
  }
}