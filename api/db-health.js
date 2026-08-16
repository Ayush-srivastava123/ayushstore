import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add MONGODB_URI");
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  try {
    const client = await clientPromise;

    // Try DB connection
    const db = client.db("AyushStore");

    // Simple test query
    await db.command({ ping: 1 });

    res.status(200).json({
      ok: true,
      db: "connected ✅",
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      db: "failed ❌",
      error: error.message,
    });
  }
}
