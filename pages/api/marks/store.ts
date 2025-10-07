// pages/api/marks/store.ts
import { MongoClient, InsertOneResult } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data?: any;
  result?: InsertOneResult<any>;
  status?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // 1️⃣ تحقق من نوع الطلب
    if (req.method !== "POST") {
      return res.status(405).json({ status: false, message: "Method not allowed" });
    }

    console.log("Received body:", req.body);

    const { name, mid, final, activites } = req.body;

    // 2️⃣ تحقق من البيانات
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new Error("Name is required and must be a non-empty string");
    }
    if (typeof mid !== "number" || mid < 0 || mid > 30) {
      throw new Error("Mid must be a number between 0-30");
    }
    if (typeof final !== "number" || final < 0 || final > 50) {
      throw new Error("Final must be a number between 0-50");
    }
    if (typeof activites !== "number" || activites < 0 || activites > 20) {
      throw new Error("Activities must be a number between 0-20");
    }

    // 3️⃣ قراءة URI من Environment Variable
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MongoDB URI is not defined in environment variables");

    console.log("Connecting to MongoDB...");

    // 4️⃣ الاتصال بـ MongoDB
    const client = await MongoClient.connect(mongoUri);
    const db = client.db("MarksDB");
    const marksCollection = db.collection("marks");

    // 5️⃣ إدخال البيانات
    const result: InsertOneResult<any> = await marksCollection.insertOne(req.body);

    // 6️⃣ إغلاق الاتصال
    await client.close();

    console.log("Inserted successfully:", result.insertedId);

    return res.status(200).json({
      status: true,
      message: "Inserted successfully",
      data: req.body,
    });
  } catch (error: any) {
    // 7️⃣ طباعة الأخطاء لتسهيل التشخيص
    console.error("API ERROR:", error.message);

    // إرسال خطأ 500 مع رسالة واضحة
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}
