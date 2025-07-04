"use server"
import { createAdminClient } from "../appwrite"

import { InputFile } from "node-appwrite/file"
import { appwriteConfig } from "../appwrite/config";
import { ID, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { url } from "inspector";
import { getCurrentUser } from "./user.action";
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


const createQueries = (getCurrentUser: any) => {
    
const queries = [
    Query.or(
        [
            Query.equal("owner", getCurrentUser.$id),
            Query.contains("user", getCurrentUser.email)

        ])
    
]
 return queries
}

export const getFiles= async ()=>{
    const {database}=await createAdminClient()
    try{
        const currentUser=await getCurrentUser()
        if(!currentUser) throw new Error("User not authenticated")
          
            const queries=createQueries(currentUser)

            const files=await database.listDocuments(
                appwriteConfig.databaseid,
                appwriteConfig.filesCollectionId,
                queries,
            )


            return parseStringify(files)


            
    }catch(error){  
        handleError(error,"Failed To Get Files")
    }
}


export const renameFile =async ({fileId,name,extension,path}:RenameFileProps)=>{

 const {database}=await createAdminClient()
 try{
      const newName=`${name}.${extension}`
      const updateFile=await database.updateDocument(
        appwriteConfig.databaseid,
        appwriteConfig.filesCollectionId,
        fileId,
        {name:newName}
      )
        revalidatePath(path)
 return parseStringify(updateFile)
 
 }catch(error){
    handleError(error,"Failed To Rename File")
 }

 

}