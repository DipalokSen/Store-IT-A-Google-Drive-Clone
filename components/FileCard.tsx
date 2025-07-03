import Link from 'next/link'
import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from "@/components/Thumbnail"
import { convertFileSize } from '@/lib/utils'
import FormattedDateTime from './FormattedDateTime'
import ActionDropdown from './ActionDropdown'


const FileCard = ({file}:{file:Models.Document}) => {
  return (
    <Link href={file.url} target='"_blank' className='file-card'>
      <div className="flex justify-between">
        <Thumbnail type={file.type1} extension={file.extension} url={file.url} />

            <div className="flex flex-col items-end justify-between">
              <ActionDropdown file={file}/>
             <p>   {convertFileSize(file.size)}</p>
            </div>

        </div>
        <div className="file-card-details">
          <p className="subtitle-2 line-clamp-1">{file.name}</p>
          <FormattedDateTime date={file.$createdAt} className="body-2 text-light-200"/>

         <p className="caption text-light-200 line-clamp-1">By: {file.owner.fullName}</p>
        </div>
    </Link >
  )
}

export default FileCard
