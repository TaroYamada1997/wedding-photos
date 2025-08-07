'use client'

import { useState, useRef } from 'react'
import { API_ENDPOINTS } from '@/lib/client-only'

interface PhotoUploadFormProps {
  onUploadStart: () => void
  onUploadComplete: () => void
  onUploadError: () => void
}

export function PhotoUploadForm({ 
  onUploadStart, 
  onUploadComplete, 
  onUploadError 
}: PhotoUploadFormProps) {
  const [nickname, setNickname] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for S3
        alert('ファイルサイズが大きすぎます。10MB以下の写真を選択してください。')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください。')
        return
      }

      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!selectedFile || !nickname.trim()) {
      alert('ニックネームと写真を入力してください。')
      return
    }

    setIsUploading(true)
    onUploadStart()

    const formData = new FormData()
    formData.append('photo', selectedFile)
    formData.append('nickname', nickname.trim())

    try {
      const response = await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        onUploadComplete()
        // Reset form
        setNickname('')
        setSelectedFile(null)
        setPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        const errorData = await response.json()
        console.error('Upload error details:', errorData)
        throw new Error(errorData.details || errorData.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`アップロードに失敗しました: ${errorMessage}`)
      onUploadError()
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
          ニックネーム
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="お名前またはニックネームを入力"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          disabled={isUploading}
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          写真を選択
        </label>
        
        {!selectedFile ? (
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-400 transition-colors">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-gray-600 text-sm">
                タップして写真を選択
              </p>
              <p className="text-gray-400 text-xs mt-1">
                JPG, PNG (最大10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview!}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null)
                  setPreview(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                disabled={isUploading}
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!selectedFile || !nickname.trim() || isUploading}
        className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
      >
        {isUploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>アップロード中...</span>
          </>
        ) : (
          <span>写真を送信</span>
        )}
      </button>
    </form>
  )
}