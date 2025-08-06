'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PhotoUploadForm } from '@/components/PhotoUploadForm'

export default function Home() {
  const [, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 mt-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💕 結婚式の思い出</h1>
          <p className="text-gray-600 text-sm">
            素敵な瞬間を写真でシェアしてください
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {!uploadComplete ? (
            <PhotoUploadForm 
              onUploadStart={() => setIsUploading(true)}
              onUploadComplete={() => {
                setIsUploading(false)
                setUploadComplete(true)
              }}
              onUploadError={() => setIsUploading(false)}
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ありがとうございます！
              </h2>
              <p className="text-gray-600 mb-6">
                写真をアップロードしていただきありがとうございました。
                素敵な思い出をシェアしていただき、とても嬉しいです！
              </p>
              <button
                onClick={() => {
                  setUploadComplete(false)
                  setIsUploading(false)
                }}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                もう一度アップロード
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link 
            href="/admin"
            className="text-gray-400 text-xs hover:text-gray-600 transition-colors"
          >
            管理者ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}
