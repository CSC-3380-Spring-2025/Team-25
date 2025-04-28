import React from 'react';
import Image from "next/image";
import { Button } from '@/components/ui/button';


function Header() {

  const onClick = () => {
    console.log('Navigate to Home');
  }

  return (
    <div className='p-5 flex items-center justify-between shadow-md'>
      <Image
        src={'/logo.svg'}
        alt='logo'
        width={50}
        height={30}
      />
      <h1 className="text-3xl font-bold sm:text-5xl">
        Budget Tracker
        </h1>
      <div className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
        <a href="http://localhost:3000/sign-in" className="text-sm font-semibold">Sign In</a>
      </div>
    </div>
  );
}


export default Header;
