// Fallback database configuration
export const getDatabaseUrl = () => {
  // Check if we're in production and DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  
  // Fallback to file-based SQLite for development or if PostgreSQL is not available
  return "file:./dev.db"
}

export const getDatabaseProvider = () => {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
    return 'postgresql'
  }
  return 'sqlite'
}