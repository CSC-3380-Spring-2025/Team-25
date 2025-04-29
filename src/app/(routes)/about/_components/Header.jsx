'use client'

import React from 'react';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import {useUser, UserButton} from "@clerk/nextjs";
import {Link} from 'next/link';


function Header() {

    const {user, isSignedIn} = useUser();

  return (
    <div className='p-5 flex items-center justify-between border-1 shadow-md'>
      <Image 
        src={'/logo2.svg'}
        alt='logo'
        width={50}
        height={50}
      />

      {isSignedIn?
      <UserButton/> :
      <div className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
        <a href="http://localhost:3000/sign-in" className="text-sm font-semibold">Sign In</a>
      </div>
    }
    </div>
  );
}


export default Header;
