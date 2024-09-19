import HeroSection from '@/components/home/hero'
import IdeaMarket from '@/components/home/idea-market'
import StepsForFunders from '@/components/home/steps'
import Testimonials from '@/components/home/testimonials'
export default async function Home() {
  return (
    <main className="flex flex-col ">
      <HeroSection />
      <IdeaMarket />
      <StepsForFunders />
      <Testimonials />
    </main>
  )
}
