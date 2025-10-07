import { MongoClient , InsertOneResult, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";


type Data = {
  data?: any;
  status?: boolean;
  message?: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse <Data | { error: string }>
){
    if(req.method == "DELETE"){
     const id = req.query.id;
    // Ensure id is a string
     const objectId = Array.isArray(id) ? id[0] : id;

    const client = await MongoClient.connect(
      "mongodb+srv://rawanmahmoud323_db_user:<rawan2002$$>@cluster0.6ks2vfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    let db= client.db("MarksDB");
    let marksCollection= db.collection("marks");
    // _id from mongodb
    let deleted = await marksCollection.deleteOne({
        _id : new ObjectId(objectId)
    });
 //deleted.deletedCount يحتوي على عدد المستندات التي تم حذفها.   
//إذا حذف مستند واحد → deletedCount = 1
 let isDeleted= deleted.deletedCount>0;
await client.close();

    res.status(isDeleted ? 200:400).json({
        status: isDeleted,
        message: isDeleted ?"Deleted succesfully" : "Delete failed !",
    });

    }else{
        res.status(405).json({
            status:false,
            message:"Method not allowed",
        })
    }}
