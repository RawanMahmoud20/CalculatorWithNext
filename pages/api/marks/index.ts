import { MongoClient , InsertOneResult } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";


type Data = {
  data?: any;
  result?: InsertOneResult<any>;
  status?: boolean;
  message?: string;
};
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string }>) {
  if (req.method === "GET") {
    try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);


      const db = client.db("MarksDB");
      const marksCollection = db.collection("marks");

      let data = await marksCollection.find().toArray();

      // تأكدي من أن القيم موجودة قبل الحساب
      data = data.map(student => ({
        ...student,
        average: ((student.mid || 0) + (student.final || 0) + (student.activites || 0)) / 3
      }));

      await client.close();

      res.status(200).json({
        status: true,
        data
      });
    } catch (err: any) {
      console.error("Server Error:", err.message);
      res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
  } else {
    res.status(405).json({ status: false, message: "Method not allowed" });
  }
}
