// pages/api/test.ts
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI not defined");

    const client = await MongoClient.connect(mongoUri);
    const db = client.db("MarksDB");

    await client.close();
    res.status(200).json({ status: true, message: "MongoDB connected successfully" });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
}
