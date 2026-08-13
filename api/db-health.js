import mongoose from 'mongoose';

let connectionPromise;

export default async function handler(_req, res) {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return res.status(500).json({ ok: false, database: 'missing MONGODB_URI' });
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    }

    await connectionPromise;
    return res.status(200).json({
      ok: true,
      database: 'connected',
      state: mongoose.connection.readyState
    });
  } catch (error) {
    connectionPromise = undefined;
    console.error('MongoDB health check failed:', error);
    return res.status(500).json({
      ok: false,
      database: 'connection_failed',
      error: error?.message || 'Unknown database error'
    });
  }
}
