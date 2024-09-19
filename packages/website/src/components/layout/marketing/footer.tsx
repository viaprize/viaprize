import { Button } from '@viaprize/ui/button'
import Link from 'next/link'
import { BiLogoLinkedin, BiLogoTelegram, BiLogoTwitter } from 'react-icons/bi'

export default function Footer() {
  return (
    <footer className="flex justify-between items-center py-4 bg-muted px-6 text-muted-foreground">
      <p>© 2024 Viaprize. All rights reserved.</p>
      <div className="flex items-center space-x-4">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </div>
      <div className="flex items-center ">
        <Button asChild size="icon" variant="ghost">
          <Link href="https://x.com/viaprize">
            <BiLogoTwitter className="text-2xl" />
          </Link>
        </Button>
        <Button asChild size="icon" variant="ghost">
          <Link href="https://t.me/viaprize">
            <BiLogoTelegram className="text-2xl" />
          </Link>
        </Button>
        <Button asChild size="icon" variant="ghost">
          <Link href="https://linkedin.com/company/viaprize">
            <BiLogoLinkedin className="text-2xl" />
          </Link>
        </Button>
      </div>
    </footer>
  )
}
