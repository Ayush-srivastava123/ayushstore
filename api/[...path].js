import app from '../backend/src/app.js';
import { connectDatabase } from '../backend/src/config/db.js';

let connectionPromise;

export default async function handler(req, res) {
  if (!connectionPromise) connectionPromise = connectDatabase();
  await connectionPromise;
  return app(req, res);
}
