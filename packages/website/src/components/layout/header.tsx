import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <div className="hidden bg-background md:flex h-[60px] w-full items-center justify-between px-5 rounded-md">
      <Link href="/" className="flex items-center space-x-4">
        <Image src="/viaprizeBg.png" alt="Logo" width={32} height={32} />
        <h1 className="text-2xl font-bold">viaPrize</h1>
      </Link>
      {/* TODO: Add search component dont remove this comment */}
      {/* <div className="flex items-center justify-between space-x-7 font-semibold"></div> */}
      {/* <div className="flex items-center">
        <Button variant="ghost" size="icon" className="size-7">
          <BiSolidMessageSquare className="text-lg" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7">
          <IoNotifications className="text-lg" />
        </Button>
        <Search />
      </div> */}
    </div>
  )
}
