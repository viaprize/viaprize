import { auth } from '@/server/auth'
import { Button } from '@viaprize/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@viaprize/ui/sheet'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Header() {
  const session = await auth()

  return (
    <nav className="fixed top-0 right-0 left-0 overflow-x-hidden z-[999] flex justify-between  bg-background/40 backdrop-blur-lg items-center py-4 px-8">
      <div className="flex items-center space-x-4">
        <Image src="/viaprizeBg.png" alt="Logo" width={32} height={32} />
        <h1 className="text-2xl font-bold">viaPrize</h1>
      </div>

      <div className="hidden sm:flex sm:items-center sm:space-x-4">
        <Link href="/prize">Prizes</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Button asChild>
          {session?.user ? (
            <Link href={`/profile/${session.user.username}`}>Profile</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </Button>
        <div className="flex items-center space-x-4 sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="z-[1000]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link href="/prize">Prizes</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                {session?.user ? (
                  <Link href={`/profile/${session.user.username}`}>
                    Profile
                  </Link>
                ) : (
                  <Link href="/login">Login</Link>
                )}
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="button">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
