import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    // Full-height flex container to center content both vertically and horizontally
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center w-full max-w-md">
        
        {/* Centered heading */}
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 text-center">
          Sign in to your account
        </h2>

        {/* Clerk SignIn component */}
        <SignIn />
      </div>
    </div>
  )
}
