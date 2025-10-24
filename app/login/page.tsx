import { LoginForm } from "@/components/login-form"

export default function LoginPage() {

  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative"
      style={{
        backgroundImage: 'url(/login-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        height: '100vh'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
