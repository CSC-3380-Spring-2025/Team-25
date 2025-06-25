'use client' // Directive for Next.js to render this component on the client side

import React from 'react';
import Image from "next/image";
import { useUser, UserButton } from "@clerk/nextjs";

// Header functional component
// This component serves as the header for the application, displaying the logo, title, and user sign-in status
function Header() {

    // Sign-in status from Clerk
    const { user, isSignedIn } = useUser();

    return (
        // Container with padding, horizontal layout, space-between alignment, and a shadow
        <div className='p-5 flex items-center justify-between border-1 shadow-md'>

            {/* Logo image */}
            <Image 
                src={'/logo2.svg'} // Path to logo
                alt='logo' // Alt text for accessibility
                width={50}
                height={50}
            />

            {/* App title */}
            <h1 className="text-3xl font-extrabold sm:text-3xl">
                LevelUp Budget
            </h1>

            {/* Conditional rendering: show UserButton if signed in, otherwise show 'Sign In' button */}
            {isSignedIn ? 
                // Clerk-provided user button for managing account/user session
                <UserButton/> 
                :
                // Sign In button styled with dark background and hover effect
                <div className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition cursor-pointer">
                    <a href="/sign-in" className="text-sm font-semibold">
                        Sign In
                    </a>
                </div>
            }
        </div>
    );
}

export default Header; // Exporting Header for use in layout or pages