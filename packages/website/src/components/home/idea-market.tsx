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

export default function IdeaMarket() {
  return (
    <section className="flex flex-col items-center gap-10  justify-center py-20">
      <div className="flex flex-col items-center text-center justify-center gap-3 max-w-3xl">
        <h2 className="text-4xl  font-medium">An Idea MarketPlace</h2>
        <p className="text-xl text-muted-foreground text-balance">
          A prize is a project proposal combined with a reward for anyone who
          completes the project
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-screen-2xl mx-auto gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage src="/hero/avatar.png" />
            </Avatar>
            <CardTitle>For Visionaries</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p>
              We know you have lot of ideas, but you don't have the resources to
              implement them.
            </p>
            <ol className="list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <Check />
                <span>You can get funding for your idea</span>
              </li>
              <li className="flex items-center gap-2">
                <Check />
                <span>Find the right team to implement your idea</span>
              </li>
              <li className="flex items-center gap-2">
                <Check />
                <span>And also Validate your idea with the community</span>
              </li>
            </ol>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/prize/create">Create a Proposal</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage src="/hero/avatar.png" />
            </Avatar>
            <CardTitle>For Freelancers</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p>
              You are a developer and you want to earn more? and tired of
              searching for projects on fiverr and upwork?
            </p>
            <ol className="list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <Check />
                <span>Find projects that match your skills</span>
              </li>
              <li className="flex items-center gap-2">
                <Check />
                <span>
                  You can compete with other freelancers and win the prize
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check />
                <span>You can earn and also be part of the project</span>
              </li>
            </ol>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/prize/explore">Explore Prizes</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage src="/hero/avatar.png" />
            </Avatar>
            <CardTitle>For Investors</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p>
              You are an investor and invest into early stage projects? and
              ideas ? and also we make sure your investment if your investment
              is not successful
            </p>
            <ol className="list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <Check />
                <span>You can invest into ideas that you believe in</span>
              </li>
              <li className="flex items-center gap-2">
                <Check />
                <span>
                  Your investment is protected by money-back guarantee
                </span>
              </li>
            </ol>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/prize/explore">Explore Prizes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
