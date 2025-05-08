import React from 'react'

// Footer functional component
// This component serves as a navigation footer for the application
// It includes links to different sections of the app (Home, About, Services, Contact)
function Footer() {
    return (
        // Outer container with padding, black background, white text, and a border color (though border not applied without width)
        <div className='p-1 bg-black text-white border-amber-50'>

            {/* Header element used here to wrap the navigation (semantically optional) */}
            <h1>        

                {/* Navigation bar with horizontal spacing, center alignment, and responsive text size */}
                <nav className='flex gap-5 items-center justify-center sm:text-1xl'>

                    {/* Navigation links */}
                    <a href='/'>Home</a>
                    <a href='/about'>About</a>
                    <a href='/contact'>Contact</a>

                </nav>
            </h1>
        </div>
    )
}

export default Footer // Exporting the Footer component for use in the app
