import React from 'react'


// Banner functional component
// This component serves as a promotional section for the LevelUp Budget application
// It includes a title, description, call-to-action buttons, and an illustrative image
function Banner() {
    return (
        // Section container with vertical alignment and center alignment
        <section className="flex items-center flex-col">

            {/* Main content container with padding and responsive layout */}
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
                
                {/* Text content container */}
                <div className="mx-auto max-w-xl text-center">
                    
                    {/* Main heading */}
                    <h1 className="text-3xl font-extrabold sm:text-5xl">
                        LevelUp Budget
                    </h1>

                    {/* Description paragraph */}
                    <p className="mt-4 sm:text-xl/relaxed">
                      Tired of boring spreadsheets or overly complex budgeting apps? So were we. That’s why we built something new.
                      LevelUp Budget is a simple, intuitive budgeting app that helps you take control of your finances without the headaches.
                    </p>

                    {/* Button group container */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        
                        {/* 'Get Started' button */}
                        <a
                            className="block w-full rounded-sm bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:ring-3 focus:outline-none sm:w-auto"
                            href='/sign-in'
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner // Exporting the component for use in other parts of the app
