import React from 'react'
import Image from 'next/image'

function Banner() {
    return (
        <section className="flex items-center flex-col">
  <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-3xl font-extrabold sm:text-5xl">
        Contact
        <strong className="font-extrabold text-primary sm:block"> Contact. </strong>
      </h1>

      <p className="mt-4 sm:text-xl/relaxed">
        This is where the contact information will be displayed. You can add any relevant information here, such as phone numbers, email addresses, or physical addresses.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <href
          className="block w-full rounded-sm bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:ring-3 focus:outline-none sm:w-auto"
          href="http://localhost:3000/sign-in"
          onClick={() => console.log('Navigate to Login')}
        >
          Get Started
        </href>

        <a
          className="block w-full rounded-sm px-12 py-3 text-sm font-medium text-primary shadow-sm hover:text-gray-800 focus:ring-3 focus:outline-none sm:w-auto"
          href="#"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
</section>
    )
}

export default Banner
