import PrizeProfileTabs from '@/components/profile/prize-profile-tabs'
import UserBioSocials from '@/components/profile/user-bio-socials'
import {
  IconArrowLeft,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBulb,
  IconCoin,
  IconLink,
  IconTrophy,
} from '@tabler/icons-react'
import { Button } from '@viaprize/ui/button'
import { Separator } from '@viaprize/ui/separator'

interface UserPrizeStatusItem {
  value: number
  label: string
  icon?: React.ReactNode
}

interface UserData {
  avatar: string
  name: string
  username: string
  bio: string
  skillset: string[]
  userPrizeStatus: UserPrizeStatusItem[]
  links: { href: string; label: string; icon?: React.ReactNode }[]
}

export default function Profile() {
  const userData: UserData = {
    avatar: 'https://github.com/shadcn.png',
    name: 'Aryan Tiwari',
    username: 'johndoe',
    bio: `I'm a Designer and I love to create beautiful things. 
           I take contract works too`,
    skillset: ['Designer', 'Content Writer', 'Manager', 'Photographer'],
    userPrizeStatus: [
      {
        value: 300,
        label: 'Ideas Listed',
        icon: <IconBulb size={35} stroke={2} color="green" />,
      },
      {
        value: 50,
        label: 'Prizes Won',
        icon: (
          <IconTrophy size={35} stroke={2} color="green" className="ml-3" />
        ),
      },
      {
        value: 20,
        label: 'Contributed',
        icon: <IconCoin size={35} stroke={2} color="green" className="ml-3" />,
      },
    ],
    links: [
      {
        href: 'https://nepokin.com',
        label: 'nepokin.com',
        icon: <IconLink size={25} />,
      },
      {
        href: 'https://twitter.com/johndoe',
        label: 'Twitter',
        icon: <IconBrandTwitter size={25} />,
      },
      {
        href: 'https://linkedin.com/in/johndoe',
        label: 'LinkedIn',
        icon: <IconBrandLinkedin size={25} />,
      },
      {
        href: 'https://linkedin.com/in/johndoe',
        label: 'Instagram',
        icon: <IconBrandInstagram size={25} />,
      },
      {
        href: 'https://github.com/johndoe',
        label: 'GitHub',
        icon: <IconBrandGithub size={25} />,
      },
    ],
  }

  return (
    <>
      <Button variant="outline" className="ml-2 mt-2 mb-4">
        <IconArrowLeft className="mr-1" size={20} /> Back
      </Button>
      <div className="w-full flex justify-center items-center">
        <div className="max-w-[90%] w-[900px] border-2 border-b-0 rounded-xl">
          <UserBioSocials {...userData} />
          <Separator className="mt-1 mb-4" />
          <PrizeProfileTabs />
        </div>
      </div>
    </>
  )
}
