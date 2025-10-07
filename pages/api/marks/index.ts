import { MongoClient , InsertOneResult } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";


type Data = {
  data?: any;
  result?: InsertOneResult<any>;
  status?: boolean;
  message?: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse <Data | { error: string }>
){
    if(req.method == "GET"){
        const client = await MongoClient.connect(
             "mongodb+srv://rawanmahmoud323_db_user:<rawan2002$$>@cluster0.6ks2vfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    let db= client.db("MarksDB");
    let marksCollection= db.collection("marks");
    let data = await marksCollection.find().toArray();
    // حساب average لكل طالب
    data = data.map(student => ({
        ...student,
        average: (student.mid + student.final + student.activites) / 3
    }));
     await client.close();
    res.status(200).json({
        status:true,
        data: data
    });

    }else{
        res.status(405).json({
            status:false,
            message:"Method not allowed",
        })
    }}
