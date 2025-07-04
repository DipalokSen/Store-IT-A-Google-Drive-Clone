import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from "@/components/Thumbnail"
import FormattedDateTime from './FormattedDateTime'
import { Label } from '@radix-ui/react-label'
import { convertFileSize, formatDateTime } from '@/lib/utils'

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