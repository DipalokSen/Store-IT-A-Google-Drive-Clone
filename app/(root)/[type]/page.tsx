
import FileCard from '@/components/FileCard'
import { getFiles } from '@/lib/actions/file.action'
import { getFileTypesParams } from '@/lib/utils'
import { Models } from 'node-appwrite'
import React from 'react'
// import Sort from '@/components/sort'

import Sort from '@/components/Sort'
const page = async ({searchParams,params}:SearchParamProps) => {
  const type = ( (await params)?.type as string )
   
  const types=getFileTypesParams(type) as FileType[]
 const searchText=((await searchParams)?.query as string) || ''
  const sort=((await searchParams)?.sort as string) || ''
  const files=await getFiles({types, searchText, sort})

  console.log('Files:', files);
    return (
    <div className='page-container'>
      <section className='w-full'>
        <h1 className='h1 capitalize'>{type}</h1>
        <div className="total-size-section">
          <p className='body-1'>
            Total: <span className='h5'>0 MB</span>
          </p>


          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-100">
              Sort by:
            </p>
              
               <Sort /> 
           
          </div>

        </div>
      </section>

      {files.total > 0 ? (
          <section className='file-list'>
            {files.documents.map((file:Models.Document)=>(
              <FileCard key={file.$id} file={file} />
            ))}
          </section>
      ):<p className='no-files'> No files uploaded</p>}
    </div>
  )
}

export default page
