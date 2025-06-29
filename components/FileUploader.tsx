"use client"
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl } from '@/lib/utils'

import { useState } from 'react'

import Image from 'next/image'

import { getFileType } from '@/lib/utils'
import { getFileIcon } from '@/lib/utils'

import Thumbnail from "@/components/Thumbnail"
import { log } from 'console'

import { toast } from "sonner"
import { MAX_FILE_SIZE } from '@/constants'
import { uploadFile } from '@/lib/actions/file.action'
import { usePathname } from 'next/navigation'


interface Props{
  ownerId:string,
  accountId:string,
  className?:string
}



const FileUploader = ({ownerId,accountId,className=''}:Props) => {
  
  
  
  const path=usePathname()
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
  setfiles(acceptedFiles);

  const uploadPromies=acceptedFiles.map(async (file)=>{
    if(file.size >MAX_FILE_SIZE){
      setfiles((prevFiles)=>prevFiles.filter((f)=>
    f.name!=file.name
    ))
    return toast("Error Uploading File", {
          description: <p className='font-bold text-brand'>Try Uploading File That Less than 50 MB</p>,
          action: {
            label: <Image  src="assets/icons/remove.svg" width={20} height={20} alt='X'/>,
            onClick: () => console.log("Undo"),
          }})
    }

    return uploadFile({file, ownerId, accountId,path}).then((uploadedFile)=>{
      if(uploadedFile){
        
        
        
        setfiles((prevFiles)=>prevFiles.filter((f)=>
          f.name!=file.name
        ))
        
        toast.success("File Uploaded Successfully", {
          description: <p className='font-bold text-brand'>File {uploadedFile.name} Uploaded Successfully</p>,
          action: {
            label: <Image  src="assets/icons/remove.svg" width={20} height={20} alt='X'/>,
            onClick: () => console.log("Undo"),
          }
        })
      }
    })
       

  })



await Promise.all(uploadPromies)


}, [ownerId, accountId, path]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
const [files, setfiles] = useState<File[]>([]);
  
const handleRemoveFile =(e:React.MouseEvent<HTMLImageElement>,fileName:string)=>{
   
   
    e.stopPropagation()
    setfiles((prevFiles)=>prevFiles.filter((file)=>
    file.name!=fileName
    ))
}

return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />

      
      
      <Button className={cn("uploader-button",className)} type='button'>

        <Image src="assets/icons/upload.svg"
       width={24}
       height={24}
       alt="l"



/>


      </Button>


      {

       files.length > 0 && <ul className='uploader-preview-list'>
        <h3 className='h4 text-light-100'>Uploading</h3>

      {files.map((file,index)=>{

            const { type, extension } = getFileType(file.name);

            return (
              <li key={index} className='uploader-preview-item'>



              <div className="flex items-center gap-3">
                <Thumbnail
                type={type}
                extension={extension}
                url={convertFileToUrl(file)}
                />
              <div className="uploader-preview name">
                {file.name}
                <Image src="/assets/icons/file-loader.gif" width={70} height={26} alt='loading' />
              </div>
              </div>
              <Image src="assets/icons/remove.svg" width={24} height={24} alt='remove' onClick={(e) => handleRemoveFile(e, file.name)} />
              </li>
            )

             
})}


       </ul> 

      }
      
      
      
       
      
    </div>
  )
}

export default FileUploader
