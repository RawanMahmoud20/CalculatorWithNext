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
    //تحقق من نوع الطلب
    if (req.method !== "POST") {
      return res.status(405).json({ status: false, message: "Method not allowed" });
    }

    console.log("Received body:", req.body);

    const { name, mid, final, activites } = req.body;

    //  تحقق من الاسم
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new Error("Name is required and must be a non-empty string");
    }
    // التحقق من أن الاسم يحتوي فقط على حروف (عربية أو إنجليزية) ومسافات
    const nameRegex = /^[A-Za-z\u0600-\u06FF\s]+$/;
    if (!nameRegex.test(name)) {
      throw new Error("Name must contain only letters (no numbers or symbols)");
    } 
  //  دالة عامة للتحقق من القيم الرقمية
    const validateNumber = (value: any, min: number, max: number, fieldName: string) => {
      // تأكد أن القيمة رقم حقيقي (وليس نص)
      if (typeof value !== "number" || isNaN(value)) {
        throw new Error(`${fieldName} must be a valid number`);
      }

      // تأكد أن القيمة تحتوي على 3 خانات كحد أقصى
      if (value.toString().length > 3) {
        throw new Error(`${fieldName} must not exceed 3 digits`);
      }

      // تأكد أن القيمة ضمن المدى المطلوب
      if (value < min || value > max) {
        throw new Error(`${fieldName} must be between ${min} and ${max}`);
      }
    };


    validateNumber(mid, 0, 30, "Mid");
    validateNumber(final, 0, 50, "Final");
    validateNumber(activites, 0, 20, "Activities");
    

    // 3️⃣ قراءة URI من Environment Variable
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MongoDB URI is not defined in environment variables");

    console.log("Connecting to MongoDB...");

    // 4️⃣ الاتصال بـ MongoDB
const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("MarksDB");
    const marksCollection = db.collection("marks");

    // 5️⃣ إدخال البيانات
    const result: InsertOneResult<any> = 
    await marksCollection.insertOne(req.body);

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
