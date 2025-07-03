import Link from 'next/link'
import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from "@/components/Thumbnail"


const FileCard = ({file}:{file:Models.Document}) => {
  return (
    <Link href={file.url} target='"_blank'>
      <div className="flex justify-between">
        <Thumbnail type={file.type1} extension={file.extension} url={file.url} />   
        </div>
        {file.name}
    </Link >
  )
}

export default FileCard
