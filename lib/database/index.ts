import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

let cached = (global as any).mongoose || { conn: null, promise: null }

/**
 * Connects to the database.
 * @returns {Promise<mongoose.Connection>} The connection to the database.
 * @throws {Error} If MONGODB_URI is missing.
 */
export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn

  console.log('Connecting to database')

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI, {
        dbName: 'event-app',
        bufferCommands: false,
      })

    cached.conn = await cached.promise
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }

  return cached.conn
}
