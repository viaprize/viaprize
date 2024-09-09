import Image from 'next/image'

import LoginCard from '@/components/auth/login-card'

export default function Dashboard() {
  return (
    <>
      <div className="w-full md:grid  max-h-dvh h-dvh md:grid-cols-2">
        <LoginCard />
        <div className="hidden bg-muted lg:block">
          <Image
            src="https://images.unsplash.com/photo-1507919909716-c8262e491cde?q=80&w=3432"
            alt="Image"
            width="1920"
            height="1080"
            className="h-dvh w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  )
}
