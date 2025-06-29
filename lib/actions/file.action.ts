"use server"
import { createAdminClient } from "../appwrite"

import { InputFile } from "node-appwrite/file"
import { appwriteConfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { url } from "inspector";
const handleError = (error: unknown, message: string) => {

    console.log(error, message);
    throw error




}
export const uploadFile=async ({file,ownerId,accountId,path}:UploadFileProps)=>{
const {storage,database}=await createAdminClient()
try{
    const inputfile=InputFile.fromBuffer(file,file.name);

    const bucketFile=await storage.createFile(appwriteConfig.bucketId,ID.unique(),inputfile)

    const fileDocument={
        type1:getFileType(bucketFile.name).type,
        name:bucketFile.name,
        url:constructFileUrl(bucketFile.$id),
        extension:getFileType(bucketFile.name).extension,
        size:bucketFile.sizeOriginal,
        owner:ownerId,
        accountId,
        user:[],
        bucketFileId:bucketFile.$id
    }

    const newFile=await database.createDocument(
        appwriteConfig.databaseid,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
    ).catch( async (error:unknown)=>{
        await storage.deleteFile(appwriteConfig.bucketId,bucketFile.$id)
        handleError(error,"Failed To Create File Document")
    })
revalidatePath(path)
return parseStringify(newFile)

}catch(error){
   handleError(error,"Failed To Upload The Data")
}
}