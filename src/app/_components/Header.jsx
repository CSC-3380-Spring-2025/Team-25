import React from 'react';
import Image from "next/image";
import { Button } from '@/components/ui/button';


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
      <div className='flex items-center gap-4'>
        <Button> </Button>
      </div>
    </div>
  );
}

export default Header;