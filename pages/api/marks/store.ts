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
    res: NextApiResponse<Data | { error: string }>
) {
    if (req.method == "POST") {
        if (req.body && Object.keys(req.body).length > 0 ) {
            let { name, mid, final, activites } = req.body;
            let status = 200;
            if (name != "" &&  name != null) {
                
            if(mid  >= 0 && mid <= 30){
            if (final >= 0 && final <= 50) {
                if (activites >= 0 && activites <= 20) {
                // to connect with mongodb
                const client = await MongoClient.connect(
                    "mongodb://localhost:27017");
                // Every table => collection , row => document
                // select DB and Collection
                let db = client.db("MarksDB");
                let marksCollection = db.collection("marks");
                // to inset data
                let insertResult: InsertOneResult<any> = await marksCollection.insertOne(
                    req.body);
                // to close connection
                await client.close();
                //  to send response 
                return res.status(status).json({
                    status:true,
                    message:"Inserted successfully",
                    data: req.body,
                    // result: insertResult,
                });
                
               }else{
                return res.status(400).json({
                        status: false,
                        message: "Activities mark must be between 0 to 20"
                    });           
                    }

                }else{
                    
                return res.status(400).json({
                        status: false,
                        message: "Final mark must be between 0 to 50"
                    });
                }
                }else{
            return res.status(400).json({
                    status: false,
                    message: "Mid mark must be between 0 to 30"
                });      
                }
              
            }else{
                res.status(400).json({
                    status: false,
                    message: "You must enter the name ",
                });
            }
        }else{
            res.status(400).json({
            status: false,
            message: "Enter requier data",
        }) 
        }

    } else {
        res.status(405).json({
            status: false,
            message: "Method not allowed",
        })
    }
}