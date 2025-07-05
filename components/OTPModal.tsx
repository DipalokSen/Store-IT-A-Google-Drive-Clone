"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { useState } from 'react'
import Image from "next/image"

import { Button } from "./ui/button"
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.action"
import { useRouter } from "next/navigation"
const OTPModal = ({email,accountId}:{
    email:string;
    accountId:string
}) => {
  
   const [isOpen, setisOpen] = useState(true);
   const [password, setpassword] = useState('');
   const [isLoading, setisLoading] = useState(false);

   const router=useRouter()
   
   const handleSubmit =async (e:React.MouseEvent<HTMLButtonElement>)=>{
       e.preventDefault()
       try{
        setisLoading(true)

        const sessionId=await verifySecret({accountId,password})

        if(sessionId) router.push("/")

       }catch(error){
        console.log("failed To send Otp");
        
       }   
       
       finally{
        setisLoading(false)
       }


   }

   const handleResend =async ()=>{
    await sendEmailOTP({email})
   }

  
    return (
    
   
    
    
    <AlertDialog open={isOpen} onOpenChange={setisOpen}>
 
  <AlertDialogContent className="shad-alert-dialog">
    <AlertDialogHeader className="flex justify-center relative">
      <AlertDialogTitle className="h2 text-center">Enter Your Opt
        <Image src="/assets/icons/close-dark.svg"
        alt="close"
        height={16}
        width={16}
        className="otp-close-button"
        onClick={()=>setisOpen(false)}
        />
      </AlertDialogTitle>
      <AlertDialogDescription className="suntitle-2 text-center text-light-100">
        We Sent A OTP To <span className="text-brand">{email}</span>
      </AlertDialogDescription>
    </AlertDialogHeader>

<InputOTP maxLength={6} value={password} onChange={(value)=>
    setpassword(value)
}>
  <InputOTPGroup className="shad-otp">
    <InputOTPSlot index={0} className="shad-otp-slot"/>
    <InputOTPSlot index={1} className="shad-otp-slot"/>
    <InputOTPSlot index={2} className="shad-otp-slot"/>
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} className="shad-otp-slot"/>
    <InputOTPSlot index={4} className="shad-otp-slot"/>
    <InputOTPSlot index={5} className="shad-otp-slot"/>
  </InputOTPGroup>
</InputOTP>

<div className="flex flex-col w-full gap-4">
<AlertDialogAction onClick={handleSubmit} className="shad-submit-btn h-12" type="button">Submit 
    
   {isLoading && <Image src="/assets/icons/loader.svg"
        alt="load"
        height={16}
        width={16}
        className="ml-3 animate-spin"
        
        />
   }
</AlertDialogAction>

<div className="text-center subtitle-2 mt-2 text-light-100">
    Didn't Get The OTP?
    <Button 
    type="button"
    variant='link'
    className="pl-1 text-brand"
    onClick={handleResend}
    >

    Click To Resend
    </Button>
    
    
</div>


</div>


    <AlertDialogFooter>
      
      
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default OTPModal
