import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from "@/components/Thumbnail"
import FormattedDateTime from './FormattedDateTime'
import { Label } from '@radix-ui/react-label'
import { convertFileSize, formatDateTime } from '@/lib/utils'
import { Input } from './ui/input'
import Image from 'next/image'
import { Button } from './ui/button'
const ImageThumbnail = ({ file }: { file: Models.Document }) => {
  return (

    <div className="file-content-thumbnail">
      <Thumbnail type={file.type1} url={file.url} extension={file.extension} />
     <div className="flex flex-col">
     
       <p className='suntitle-2'>{file.name}</p>
       
       <FormattedDateTime
         date={file.$createdAt}
         className="caption" />


     </div>
    </div>
  )
}

const DetailRow=({label, value}:{label:string,value:string})=>(
    
    <div className="flex">
<p className="file-details-label">{label}</p>
    <p className="file-details-value">{value}</p>

    </div>
    

)

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />

      <DetailRow label="Format:" value={file.extension} />
      <DetailRow label="Size:" value={convertFileSize(file.size)} />

      <DetailRow label="Owner:" value={file.owner.fullName} />

      <DetailRow label="Last Edit:" value={formatDateTime(file.$updatedAt)}  />

    </>
  )



}

interface Props {
  file: Models.Document,
  onInputChange:React.Dispatch<React.SetStateAction<string[]>>,
  onRemove: (email:string) => void
}

  export const ShareInput =({file,onInputChange,onRemove}:Props)=>(

      <>
      <ImageThumbnail file={file} />
      <p className="subtitle-2 pl-1 text-light-200">Share the file with other user</p>
      <Input 
  type='email'
    placeholder='Enter email address'
    onChange={(e)=>onInputChange(e.target.value.trim().split(","))}
   className='share-input-field'

/>

<div className="pt-4">
    <div className="flex justify-between">
        <p className='suntitle-2 text-light-100'>Shared with</p>
        <p className='suntitle-2 text-light-100'>{file.user.length} users</p>

    </div>
    <ul className="pt-2">
        {
            file.user.map((email:string)=>(
                <li className="flex justify-between gap-4 items-center" key={email}>

                <p className="suntitle-2">{email}</p>

                <Button onClick={()=>onRemove(email)} className='share-remove-user'>
            <Image src="assets/icons/remove.svg" alt="remove" width={24} height={24} />
                </Button>
                
                
                </li>
            ))
        }
    </ul>
</div>

      </>
  )
  