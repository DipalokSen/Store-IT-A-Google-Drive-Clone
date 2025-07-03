
import FileCard from '@/components/FileCard'
import { getFiles } from '@/lib/actions/file.action'
import { Models } from 'node-appwrite'
import React from 'react'
// import Sort from '@/components/sort'
const page = async ({params}:SearchParamProps) => {
  const type = ( (await params)?.type as string )


  const files=await getFiles()

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
              
              {/* <Sort /> */}
           
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
