import React from 'react'
import Image from "next/image";
import { Button } from '@/components/ui/button';
import Login from './Login.jsx';
import { useNavigate } from 'react-router-dom';

function Header() {

    const handleclick = () => {
        navigation.navigate('/Login.jsx')
      };

    return (
        <div className='p-5 flex justify-between items-center border shadow-md'>
            <Image src={'./logo.svg'}
            alt='logo'
            width={50}
            height={30}
            />
            <Button onClick={handleclick}>Get Started</Button>
        </div>
    )
}

export default Header
