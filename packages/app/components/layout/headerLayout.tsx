import Link from "next/link";

export default function HeaderLayout  ()  {
  return (
    <div className="bg-black h-[70px] w-full text-white">
      <Link href="/prize/explorePrize">
        explore prizes
      </Link>
      <Link href="/prize/123">
        just switching
      </Link>
    </div>
  )
}

