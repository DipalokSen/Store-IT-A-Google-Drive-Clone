import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import React from 'react'
import { Toaster } from "@/components/ui/sonner"
const layout =async  ({children}:{children:React.ReactNode}) => {
  
   const currentUser=await getCurrentUser()
   console.log('Current user data:', currentUser);
   if (!currentUser) return redirect("/sign-in")
  return (

   

    <main className='flex h-screen'>
        <Sidebar {...currentUser}/>
        <section className='flex h-full flex-col flex-1'>
            <MobileNavigation {...currentUser }/> <Header accountId={currentUser.accountid} ownerId={currentUser.$id}/>
            <div className="main-content">{children}

            </div>
        </section>
      <Toaster />
    </main>
     
  )
}

export default layout
