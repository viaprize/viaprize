import { Button } from '@viaprize/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <nav className="fixed top-0 z-50 flex justify-between w-[calc(100%-2rem)]  bg-background/40 backdrop-blur-lg items-center py-4 px-8">
      <div className="flex items-center space-x-4">
        <Image src="/viaprizeBg.png" alt="Logo" width={32} height={32} />
        <h1 className="text-2xl font-bold">Viaprize</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/prize">Prizes</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <Button>Login</Button>
    </nav>
  )
}
