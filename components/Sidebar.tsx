"use client"
import { avatarPlaceholderUrl, navItems } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface Props{
   fullName:string,
   email:string,
   avatar:string
}

const Sidebar = ({fullName,email,avatar}:Props) => {
  
  const pathname=usePathname()
  
    return (
    <aside  className='sidebar'>

   <Link href="/">
   
   <Image src="/assets/icons/logo-full-brand.svg"
   alt='logo'
   width={160}
   height={60}
   className='hidden h-auto lg:block'
/>
   
<Image src="/assets/icons/logo-brand.svg"
   alt='logo'
   width={52}
   height={52}
   className='lg:hidden'
/>


   
   </Link>

   <nav className='sidebar-nav'>

    <ul className='flex flex-col flex-1 gap-6'>

 {navItems.map((item)=>(
    <Link href={item.url} key={item.name}>
        <li className={cn("sidebar-nav-item",pathname===item.url && "shad-active")}>

        
        <Image className={cn("nav-icon",pathname===item.url && "nav-icon-active")}
        src={item.icon}
        width={24}
        height={24}
        alt='icon'
        
        
        />

        <p className='hidden lg:block'>{item.name}</p>

        </li>
    </Link>
 ))}


    </ul>
   </nav>

   <Image src="/assets/images/files-2.png"
   alt='logo'
   width={500}
   height={418}
   className='w-full'
   />


   <div className='sidebar-user-info'>
    <Image src={avatarPlaceholderUrl} alt='placeholder'
    width={44}
    height={44}
    />


    <div className='hidden lg:block'>
        <p className="sutitle-2 capitalize">{fullName}</p>
        <p className="caption">{email}</p>
    </div>
   </div>



    </aside>
  )
}

export default Sidebar
