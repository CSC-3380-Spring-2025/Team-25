import React from 'react'

function Login() {
    return (
    <div>
        <h1 className='text-3xl font-bold'>Login</h1>
        <form className='flex flex-col gap-4'>
            <input type="email" placeholder='Email' className='border p-2 rounded' />
            <input type="password" placeholder='Password' className='border p-2 rounded' />
            <button type="submit" className='bg-blue-500 text-white p-2 rounded'>Login</button>
        </form>
        <p className='mt-4'>Don't have an account? <a href="/register" className='text-blue-500'>Register</a></p>
    </div>
    )
}

export default Login