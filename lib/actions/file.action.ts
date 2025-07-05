"use server"
import { createAdminClient, createSessionClient } from "../appwrite"

import { InputFile } from "node-appwrite/file"
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query, Users } from "node-appwrite";
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


const createQueries = (getCurrentUser:Models.Document,types:string[],searchText:string,sort:string,limit?:number) => {
    
const queries = [
    Query.or(
        [
            Query.equal("owner", getCurrentUser.$id),
            Query.contains("user", getCurrentUser.email)

        ])


    
]
   if(types.length>0){
    queries.push(Query.equal("type1", types))
   }
   if(searchText) queries.push(Query.contains("name", searchText))

    if(limit) queries.push(Query.limit(limit))

  const [sortBy,orderBy]=sort.split('-')
  queries.push(orderBy==="asc"?Query.orderAsc(sortBy):Query.orderDesc(sortBy))
      
 return queries
}

export const getFiles= async ({types=[],searchText='',sort=`$createdAt-desc`,limit}:GetFilesProps)=>{
    const {database}=await createAdminClient()
    try{
        const currentUser=await getCurrentUser()
        if(!currentUser) throw new Error("User not authenticated")
          
            const queries=createQueries(currentUser,types,searchText,sort,limit)

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




export const updateFileUsers =async ({fileId,emails,path}:UpdateFileUsersProps)=>{

 const {database}=await createAdminClient()
 try{
      
      const updateFile=await database.updateDocument(
        appwriteConfig.databaseid,
        appwriteConfig.filesCollectionId,
        fileId,
        {user:emails


            
        }
      )
        revalidatePath(path)
 return parseStringify(updateFile)
 
 }catch(error){
    handleError(error,"Failed To Rename File")
 }

 

}


export const deleteFile =async ({fileId,bucketFileId,path}:DeleteFileProps)=>{

 const {database,storage}=await createAdminClient()
 try{
      
      const deleteFile=await database.deleteDocument(
        appwriteConfig.databaseid,
        appwriteConfig.filesCollectionId,
        fileId
        
      )

      if(deleteFile){
        await storage.deleteFile(appwriteConfig.bucketId,bucketFileId)
    
    }
        revalidatePath(path)
 return parseStringify({success:true})
 
 }catch(error){
    handleError(error,"Failed To Rename File")
 }

 

}

export async function getTotalSpaceUsed() {
  try {
    const { database } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await database.listDocuments(
      appwriteConfig.databaseid,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])],
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((file) => {
      const fileType = file.type1 as FileType;
      
      // Check if the fileType exists in totalSpace to prevent undefined errors
      if (totalSpace[fileType]) {
        totalSpace[fileType].size += file.size;
        totalSpace.used += file.size;

        if (
          !totalSpace[fileType].latestDate ||
          new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
        ) {
          totalSpace[fileType].latestDate = file.$updatedAt;
        }
      } else {
        // Handle unexpected file types as 'other'
        totalSpace.other.size += file.size;
        totalSpace.used += file.size;

        if (
          !totalSpace.other.latestDate ||
          new Date(file.$updatedAt) > new Date(totalSpace.other.latestDate)
        ) {
          totalSpace.other.latestDate = file.$updatedAt;
        }
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used: ");
  }
}