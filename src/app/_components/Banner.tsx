import React from 'react'
import Image from 'next/image'

function Banner() {
    return (
        <section className="flex items-center flex-col">
  <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-3xl font-extrabold sm:text-5xl">
        LevelUp Budget
      </h1>

      <p className="mt-4 sm:text-xl/relaxed">
      At LevelUp Budget, we're on a mission to make personal finance not just manageable, but actually enjoyable.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          className="block w-full rounded-sm bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:ring-3 focus:outline-none sm:w-auto"
          href='/sign-in'
        >
          Get Started
        </a>

        <a
          className="block w-full rounded-sm px-12 py-3 text-sm font-medium text-primary shadow-sm hover:text-gray-800 focus:ring-3 focus:outline-none sm:w-auto"
          href="/about"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
  <Image src={"/Untitled.png"} alt="demo=placeholder" width={800} height={500} className='mt-5 rounded-xl border-2'/>
</section>
    )
}

export default Banner
