"use client"
import Image from 'next/image'
import React from 'react'
import { Input } from './ui/input'
import { useState,useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce';

import { getFiles } from '@/lib/actions/file.action'
import { Models } from 'node-appwrite'
import ThumbNail from '@/components/Thumbnail'
import FormattedDateTime from './FormattedDateTime'

import { useRouter } from 'next/navigation'
const Search = () => {
  
  const [query, setquery] = useState("");

  const [debouncedQuery] = useDebounce(query, 300);
  const [result, setresult] = useState<Models.Document[]>([]);
  const [open, setopen] = useState(false);
  const router=useRouter()
  const path=usePathname()
  const searchParams=useSearchParams()
  const searchQuery=searchParams.get('query') || '';
  console.log('Search Query:', searchQuery);

  
  
  
  useEffect(() => {
    
    
    
    const fetchFiles=async ()=>{

   const files=await getFiles({searchText:debouncedQuery})
    
   if(debouncedQuery.length===0){
    setresult([]);
    setopen(false);
    return router.push(path.replace(searchParams.toString(),""));
   }
   
   setresult(files.documents);
    setopen(true);
    }

    


        fetchFiles()     
    
  }, [debouncedQuery]);
  
  
  
  useEffect(() => {
    if(!searchQuery){
      setquery("")

    }
    
  }, [searchQuery]);
  

  const handleClick=(file:Models.Document)=>{

    setopen(!open);
    setresult([]);
   router.push(
  `/${file.type1 === "video" || file.type1 === "audio" ? "media" : file.type1 + "s"}?query=${file.name}`
)
  }
  return (
    <div className='search'>
      <div className="search-input-wrapper">
   <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} />
<Input 
value={query}
placeholder='Search files'
onChange={(e) => setquery(e.target.value)}
className='search-input'


/>


{open &&(

   <ul className='search-result'>
    {result.length>0?(
      result.map((file)=>(
       <li key={file.$id} className='flex items-center justify-between' onClick={()=>handleClick(file)}>
        <div className="flex cursor-pointer items-center gap-4">
          <ThumbNail type={file.type1} extension={file.extension} url={file.url} />
        
        <p className='subtitle-2 line-clamp-1 text-light-100'>{file.name}

        </p>
        </div>
        <FormattedDateTime date={file.$createdAt} />
        </li> 
      ))
    ):(
      <li className='no-result'>No results found</li>
    )}
   </ul>


)}
      </div>
      
    </div>
  )
}

export default Search
