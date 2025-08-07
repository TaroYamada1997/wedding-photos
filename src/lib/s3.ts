import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME!

export async function uploadToS3(file: Buffer, fileName: string, mimeType: string): Promise<string> {
  const key = `wedding-photos/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: mimeType,
    ACL: 'public-read', // Make images publicly readable
  })

  await s3Client.send(command)
  
  // Return the public URL
  return `https://${BUCKET_NAME}.s3.${process.env.S3_REGION || 'ap-northeast-1'}.amazonaws.com/${key}`
}

export async function deleteFromS3(url: string): Promise<void> {
  // Extract key from URL
  const key = url.split('/').slice(-2).join('/')
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}