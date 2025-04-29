import React from 'react'

function Footer() {
    return (
        <div className='p-1 bg-black text-white border-amber-50'>
        <h1 >        
        <nav className='flex gap-5 items-center justify-center sm:text-1xl'>
        <a href='/'>Home</a>
        <a href='/'>About</a>
        <a href='/'>Services</a>
        <a href='/contact'>Contact</a>
        </nav>
        </h1>
        </div>
    )
}

export default Footer