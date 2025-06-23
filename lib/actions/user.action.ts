"use server"

import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"
import { console } from "inspector"

import { parseStringify } from "../utils"
import { cookies } from "next/headers"

const getUserByEmail = async (email: string) => {

    const { database } = await createAdminClient()

    const result = await database.listDocuments(
        appwriteConfig.databaseid,
        appwriteConfig.userCollectionId,
        [Query.equal("email", [email])]
    )
    return result.total > 0 ? result.documents[0] : null
}

const handleError = (error: unknown, message: string) => {

    console.log(error, message);
    throw error




}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailToken(ID.unique(), email)
        return session.userId
    } catch (error) {
        handleError(error, "Failed To Send OTP")
    }

}


export const createAcount = async ({ fullName, email }: { fullName: string, email: string }) => {


    const existingUser = await getUserByEmail(email)

    const accountId = await sendEmailOTP({ email })

    if (!accountId) throw new Error("Failed To Send OTP")
    
        if(!existingUser){
            const {database} = await createAdminClient()

            await database.createDocument(
                appwriteConfig.databaseid,
                appwriteConfig.userCollectionId,
                ID.unique(),
                {
                    fullName,
                    email,
                    avatar:"https://imgs.search.brave.com/ylx77uLn7_0fnxdCDluBtWe0AY6p-OaQTxdoykpvrqw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ2/ODc0NDE1Mi92ZWN0/b3IvcGxhY2Vob2xk/ZXItaHVtYW4tYXZh/dGFyLXdlYnNpdGUt/dGVtcGxhdGUtaWxs/dXN0cmF0aW9uLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1D/RVd1cHQ0YzFHNFVY/QnBFU04zamQ0aVd3/Q0MyYWVvTzNEVjFn/MjljMUI4PQ",
                    accountid: accountId
                }
            )


        }

        return parseStringify({accountId})
        



    }

   export const verifySecret = async ({ accountId, password }: {
    accountId: string;
    password: string;
}) => {
    try {
        const { account } = await createAdminClient();
        
        // createSession returns the session directly, not an object
        const session = await account.createSession(accountId, password);
        
        // Set the cookie
        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true, // Use this in production
        });
        
        return parseStringify({sessionId:session.$id}); // Return the session if needed
        
    } catch (error) {
        console.error('Failed to verify secret:', error);
        throw error; // Re-throw to handle in the calling function
    }
}


