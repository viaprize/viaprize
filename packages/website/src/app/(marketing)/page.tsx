import HeroSection from '@/components/home/hero'
import IdeaMarket from '@/components/home/idea-market'

export default async function Home() {
  return (
    <main className="flex flex-col ">
      <HeroSection />
      <IdeaMarket />
    </main>
  )
}
