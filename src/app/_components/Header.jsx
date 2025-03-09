import React from 'react'
import Image from "next/image";
import { Button } from '@/components/ui/button';


function Header() {
    return (
        <div className='p-5 flex justify-between items-center shadow-md'>
            <Image src={'./logo.svg'}
            alt='logo'
            width={50}
            height={30}
            />
            <Button>Get Started</Button>
        </div>
    )
}

export default Header