'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Photo {
  id: string
  nickname: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  createdAt: string
}

export default function AdminDashboard() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/admin/photos')
      if (response.status === 401) {
        router.push('/admin')
        return
      }
      
      if (!response.ok) {
        throw new Error('データの取得に失敗しました')
      }
      
      const data = await response.json()
      setPhotos(data.photos || [])
    } catch (err) {
      setError('データの取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin')
    } catch (err) {
      console.error('Logout error:', err)
      router.push('/admin')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込んでいます...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
              <p className="text-gray-600 mt-1">
                アップロードされた写真: {photos.length}枚
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              まだ写真がアップロードされていません
            </h3>
            <p className="text-gray-600">
              ゲストが写真をアップロードするとここに表示されます。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-square">
                  <img
                    src={`/api/image/${photo.id}`}
                    alt={`Photo by ${photo.nickname}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {photo.nickname}
                  </h3>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {photo.originalName}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(photo.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPhoto.nickname}さんの写真
                </h2>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedPhoto.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <img
                src={`/api/image/${selectedPhoto.id}`}
                alt={`Photo by ${selectedPhoto.nickname}`}
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
              />
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><strong>ファイル名:</strong> {selectedPhoto.originalName}</p>
                <p><strong>ファイルサイズ:</strong> {formatFileSize(selectedPhoto.size)}</p>
                <p><strong>ファイル形式:</strong> {selectedPhoto.mimeType}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}