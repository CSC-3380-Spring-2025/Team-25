import React from 'react';
import Image from "next/image";
import { SignInButton } from '@clerk/nextjs';


function Header() {
  const handleClick = () => {
    console.log('Navigate to Login');
  };

  return (
    <div className='p-5 flex items-center justify-between border-1 shadow-md'>
      <Image 
        src={'/logo.svg'}
        alt='logo'
        width={50}
        height={30}
      />
      <div className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
        <a href="http://localhost:3000/sign-in" className="text-sm font-semibold">Sign In</a>
      </div>
    </div>
  );
}

export default Header;