"use client"
import React from 'react'
import {
  Dialog,
   DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState } from 'react'
import Image from 'next/image'
import { Models } from 'node-appwrite'
import { actionsDropdownItems } from '@/constants'
import { set } from 'react-hook-form'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'
import { render } from 'react-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { deleteFile, renameFile, updateFileUsers } from '@/lib/actions/file.action'
import { FileDetails, ShareInput } from './ActionModalContent'
const ActionDropdown =  ({file}:{file:Models.Document}) => {
  
  const [isModelOpen, setisModelOpen] = useState(false);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [action, setaction] = useState<ActionType | null>(null);
  const [name, setname] = useState(file.name);
  const [emails, setemails] = useState<string[]>([]);
  
  const path=usePathname()
  


const closeModal=()=>{
setisModelOpen(false);
setisDropdownOpen(false);
setaction(null);
setname(file.name);
}

const setAction=async ()=>{

if(!action) return;
let success=false
const actions={
  rename: () =>  renameFile({
      fileId: file.$id,
      name,
      extension: file.extension,
      path,
    }),
    delete: async () => deleteFile({
      fileId: file.$id,
      bucketFileId: file.bucketFileId,
      
      path,
    }),
    share: async () => updateFileUsers({
      fileId: file.$id,
      emails: emails,
      path,
    })
} 

success=await actions[action.value as keyof typeof actions]();

if(success){
  closeModal();
}

}

const handleRemove=async (email:string)=>{

const updatedEmails = emails.filter((e)=> e!=email)

const success=await updateFileUsers({
  fileId: file.$id,
  emails: updatedEmails,
  path,})
  
if(success){
  setemails(updatedEmails);
  closeModal();
}

}



  const renderDialogContent=()=>{

    
    if(!action) return null;
    return (
        
  < DialogContent className='shad-dialog button'>
    <DialogHeader className='flex flex-col gap-4'>
      <DialogTitle>{action.label}</DialogTitle>
     {
        action.value==="rename" && (
            <Input 
            type='text'
            value={name}
            onChange={(e)=>setname(e.target.value)}
            />
        )
     }

     {
      action.value==="details" && (
            <FileDetails file={file} />
        )
     }

      {
      action.value==="share" && (
            <ShareInput file={file} onInputChange={setemails} onRemove={handleRemove}/>
        )
     }

     {
      action.value==="delete" && (
         <p className='delete-confirmation'>Are You Sure You Want To Delete It?{` `}
         <span className='delete-file-name'>{file.name}</span>
</p>
        )
     }
    </DialogHeader>

    {
        ["delete","share","rename"].includes(action.value) && (
        <DialogFooter className='flex flex-col gap-4 md:flex-row'>
       
        <Button className='modal-cancel-button' onClick={closeModal}>
        Cancel
        </Button>
        
        <Button className='modal-submit-button' onClick={setAction}>
           {action.value==="delete"?"Delete":action.value==="share"?"Share":action.value==="rename"?"Rename":"Submit"}
        </Button>
        </DialogFooter>
        
        )
    }
  </DialogContent>
    )
  }
  
    return (
    <Dialog open={isModelOpen} onOpenChange={setisModelOpen}>
 <DropdownMenu open={isDropdownOpen} onOpenChange={setisDropdownOpen}>
  <DropdownMenuTrigger className='shad-no-focus'><Image src="/assets/icons/dots.svg" width={34} height={34} alt='dotua'/></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel className='max-w-[200px] truncate'>{file.name}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    
    {actionsDropdownItems.map((actionItem)=>(
 <DropdownMenuItem key={actionItem.value} className='shad-dropdown-item' onClick={()=>{
        setaction(actionItem)
if(
    ["share", "delete", "rename","details"].includes(actionItem.value)
) {
    setisModelOpen(true)
    setisDropdownOpen(false);
}





 }}>
    
   {
    actionItem.value==="download"?<Link href={constructDownloadUrl(file.
bucketFileId)} target="_blank" className='flex items-center gap-2' download={file.name}><Image src={actionItem.icon} width={30} height={30} alt={actionItem.label} />
    <span className='text-sm'>{actionItem.label}</span> </Link> :
<div className='flex items-center gap-2'>
    <Image src={actionItem.icon} width={30} height={30} alt={actionItem.label} />
    <span className='text-sm'>{actionItem.label}</span>
    </div>
    
   } 

    












</DropdownMenuItem>
    ))
    }
    
    
  </DropdownMenuContent>
</DropdownMenu>
{renderDialogContent()}
</Dialog>
  )
}

export default ActionDropdown