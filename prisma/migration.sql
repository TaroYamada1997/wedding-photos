-- Migration for production database
-- Run this if there are issues with existing tables

-- Drop existing tables if they exist (be careful in production!)
-- DROP TABLE IF EXISTS "photos";
-- DROP TABLE IF EXISTS "admins";

-- Create tables with correct PostgreSQL types
CREATE TABLE IF NOT EXISTS "photos" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "imageData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "admins_username_key" ON "admins"("username");