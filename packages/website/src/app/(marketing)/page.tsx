import { AnimatedGroup } from '@/components/common/animated-group'
import ContactSection from '@/components/home/contact-us'
import HeroSection from '@/components/home/hero'
import IdeaMarket from '@/components/home/idea-market'
import StepsForFunders from '@/components/home/steps'
import Testimonials from '@/components/home/testimonials'
import { env } from '@/env'
import { redirect } from 'next/navigation'

export default async function Home() {
  return redirect('https://vprz.org/')
  // return (
  //   <main className="overflow-hidden">
  //     <HeroSection />
  //     <IdeaMarket />
  //     {/* <StepsForFunders /> */}
  //     <Testimonials />
  //     <ContactSection />
  //   </main>
  // )
}
