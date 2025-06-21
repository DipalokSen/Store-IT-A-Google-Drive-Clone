"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"







import React from 'react'
import { createAcount } from "@/lib/actions/user.action"

import { useState } from "react"
type formType="sign-in" | "sign-up"





const authFormSchema=(FormType:formType)=>{
return z.object({
    email:z.string().email(),
    FullName:FormType=="sign-up"?z.string().min(2).max(50):z.string().optional(),
})
}
const AuthForm = ({type}:{type:formType}) => {
  const [AcountId, setAcountId] = useState('');
   const formSchema=authFormSchema(type)
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FullName: "",email:""
    },
  })
 
  // 2. Define a submit handler.
const onSubmit=async (values: z.infer<typeof formSchema>) =>{
    
    console.log(values)
  const user = await createAcount({
  fullName: values.FullName || '',
  email: values.email,
});

setAcountId(user.accountId)
  }

  
  
  
    return (
    <>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 auth-form">
        <h1 className="form-title">{type==="sign-in"?"Sign-In":"Sign-Up"}</h1>
        
        {type==="sign-up" &&<FormField
          control={form.control}
          name="FullName"
          render={({ field }) => (

            
            <FormItem>
                <div className="shad-form-tem">
              <FormLabel className="shad-form-label">FullName</FormLabel>

              <FormControl>
                <Input placeholder="Enter Your Full Name" {...field} />
              </FormControl>
                </div>  
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage className="shad-"/>
            </FormItem>
          )}
        />}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (

            
            <FormItem>
                <div className="shad-form-tem">
              <FormLabel className="shad-form-label">Email</FormLabel>

              <FormControl>
                <Input placeholder="Enter Your Email Address" {...field} />
              </FormControl>
                </div>  
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage className="shad-"/>
            </FormItem>
          )}
        />
        <Button type="submit" className="form-submit-button">{type==="sign-in"?"Sign-In":"Sign-Up"}</Button>
        <div className="body-2 flex justify-center">
            <p className="text-light-100">

            
            {type==="sign-up"?"Alredy Have An Account?":"Dont Have An Account?"}
            </p>
            <Link className="ml-1 font-medium text-brand" href={type==="sign-in"?"/sign-in":"sign-up"}>{type==="sign-in"?"Sign Up":"Sign-In"}</Link>
        </div>
      </form>
    </Form>
    {/* otp */}
    </>
  )
}

export default AuthForm
