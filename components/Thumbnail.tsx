import React from 'react'
import Image from 'next/image'
import { cn, getFileIcon } from '@/lib/utils'
interface Props{
  type:string,
  extension:string,
  url?:string
}

const Thumnail = ({type,extension,url=""}:Props) => {
  
  const isImage= type==="image" && extension!="svg"
  
  return (
    <figure className='thumbnail'>
      <Image src={isImage?url:getFileIcon(extension,type)} 
    width={100}
    height={100}
    className={cn("size-8 object-contain",isImage && "thumbnail-image")}
    alt='f'  
/>
    </figure>
  )
}

export default Thumnail
