import React from 'react'

// Banner functional component
// This component serves as a promotional section for the LevelUp Budget application
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
      Contact Us
      </h1>
        
            {/* Description paragraph */}
      <p className="mt-4 sm:text-xl/relaxed">
        Have questions, feedback, or just want to say hi? We're here to help! Reach out to us anytime at <a className="text-blue-500"href="mailto:levelupbudgethelp@gmail.com">levelupbudgethelp@gmail.com</a>
      </p>
    </div>
  </div>
</section>
    )
}

export default Banner // Exporting the component for use in other parts of the app
