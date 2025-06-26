import Image from 'next/image'
import React from 'react'
import Search from '@/components/Search'
import FileUploader from "@/components/FileUploader"
import { signoutUser } from '@/lib/actions/user.action'

const Header = () => {
  return (
    
    <header className='header'>

        <Search/>

        <div className="header-wrapper">
            <FileUploader/>
            <form action={async ()=>{
              "use server"
              await signoutUser()
            }}>
                <button type='submit' className='sign-out-button'>
                    <Image src="/assets/icons/logout.svg"
                    alt='logout'
                    width={16}
                    height={16}
                    className='w-6'

                    />
                </button>
            </form>
        </div>

    </header>
  )
}

export default Header
