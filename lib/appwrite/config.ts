

export const appwriteConfig={
    endpointUrl:process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId:process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    userCollectionId:process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
    filesCollectionId:process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
    secretkey:process.env.NEXT_APPWRITE_SECRET!,
    databaseid:process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,

}