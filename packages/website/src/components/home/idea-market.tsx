import { Avatar, AvatarImage } from '@viaprize/ui/avatar'
import { Button } from '@viaprize/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@viaprize/ui/card'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { AnimatedGroup } from '../common/animated-group'
export default function IdeaMarket() {
  const cardData = [
    {
      title: 'For Visionaries',
      imageSrc: '/hero/avatar.png',
      description:
        "We know you have lot of ideas, but you don't have the resources to implement them.",
      listItems: [
        'You can get funding for your idea',
        'Find the right team to implement your idea',
        'And also Validate your idea with the community',
      ],
      link: '/prize/create',
      linkText: 'Create a Proposal',
    },
    {
      title: 'For Freelancers',
      imageSrc: '/hero/avatar.png',
      description:
        'You are a developer and you want to earn more? and tired of searching for projects on fiverr and upwork?',
      listItems: [
        'Find projects that match your skills',
        'You can compete with other freelancers and win the prize',
        'You can earn and also be part of the project',
      ],
      link: '/prize/explore',
      linkText: 'Explore Prizes',
    },
    {
      title: 'For Investors',
      imageSrc: '/hero/avatar.png',
      description:
        'You are an investor and invest into early stage projects? and ideas ? and also we make sure your investment if your investment is not successful',
      listItems: [
        'You can invest into ideas that you believe in',
        'Your investment is protected by money-back guarantee',
      ],
      link: '/prize/explore',
      linkText: 'Explore Prizes',
    },
  ]

  return (
    <section className="flex flex-col items-center gap-10  justify-center py-20 px-4">
      <div className="flex flex-col items-center text-center justify-center gap-3 max-w-3xl">
        <AnimatedGroup preset="blur-slide">
          <h2 className="text-4xl  font-medium">An Idea MarketPlace</h2>
          <p className="text-xl text-muted-foreground text-balance">
            A prize is a project proposal combined with a reward for anyone who
            completes the project
          </p>
        </AnimatedGroup>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-screen-2xl mx-auto gap-3">
        {cardData.map((card) => (
          <Card
            key={card.title}
            className="justify-between h-full flex flex-col"
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <Avatar>
                <AvatarImage src={card.imageSrc} />
              </Avatar>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p>{card.description}</p>
              <ol className="list-none p-0 m-0">
                {card.listItems.map((item, idx) => (
                  <li key={item[0]} className="flex items-center gap-2">
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={card.link}>{card.linkText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
