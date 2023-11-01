import { Button, Card, Flex } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div
      className="w-full min-h-screen flex justify-center py-4 relative overflow-hidden"
      style={{
        background: `radial-gradient(243.55% 153.69% at 23.48% -1.07%, #EBF3F5 6.99%, #C5E2F0 100%)`,
      }}
    >
      <div className="max-w-screen-2xl px-8 py-8 w-full">
        {/* Hero Section */}
        <div className="md:flex justify-betweem items-center h-screen">
          <div className="relative z-50 md:w-1/2 px-4 py-2">
            <h2 className="font-normal text-lg text-black uppercase my-0">
              Crowdfund the future
            </h2>
            <h1 className="font-bold text-3xl text-black my-0">
              Meet Viaprize Where Where Ideas Bloom, and your Funds Safeguarded Securely
            </h1>
            <p className="text-lg text-gray-600 my-4">
              Simple and sleek design with users in mind. Viaprize is a platform that
              allows
            </p>
            <Button className="bg-gradient-to-r from-[#005A6D] to-[#147EA3]">
              <Link href="/prize/explore">Explore Prizes</Link>
            </Button>
            <Flex
              className="backdrop-blur-md rounded-lg py-6 px-5 my-4 text-black"
              style={{
                background: `rgba(125, 185, 206, 0.15)`,
              }}
              justify="space-between"
              align="center"
            >
              <div>
                <h3 className="my-0">$50 million</h3>
                <p className="my-0">Total Prize Money</p>
              </div>
              <div>
                <h3 className="my-0">100+</h3>
                <p className="my-0">Total Prizes</p>
              </div>
              <div>
                <h3 className="my-0">500+</h3>
                <p className="my-0">Total Participants</p>
              </div>
            </Flex>
          </div>
          <div className="md:w-1/2">
            <div
              className="absolute right-[-30%] top-[-40%] w-[80vw] h-[80vw] rounded-full"
              style={{
                background: `linear-gradient(136deg, #D8E6EF 27.28%, #B4D8E4 87.37%)`,
              }}
            />
            <div className="absolute h-screen w-16 right-0 top-0">
              <div className="h-1/2 w-full bg-gradient-to-t from-[#35A7A0] to-[#8ee8d8]" />
              <div className="h-1/2 w-full bg-gradient-to-t from-[#89C8DD] to-[#73ADC1]" />
            </div>
            <Image
              alt="hero image"
              height={500}
              width={500}
              className="relative z-10 object-cover w-full"
              src="/home/hero.png"
            />
          </div>
        </div>
        {/* How it works */}

        <div className="flex flex-col items-center">
          <h1 className="text-black">WHY VIAPRIZE?</h1>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            <GoodCard
              Title="Secure"
              Description="We use the latest technology to ensure that your funds are safe and secure
              We use the latest technology to ensure that your funds are safe and secure
              "
            />
            <GoodCard
              Title="Secure"
              Description="We use the latest technology to ensure that your funds are safe and secure
              We use the latest technology to ensure that your funds are safe and secure
              "
            />
            <GoodCard
              Title="Secure"
              Description="We use the latest technology to ensure that your funds are safe and secure
              We use the latest technology to ensure that your funds are safe and secure
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GoodCard({ Title, Description }: { Title: string; Description: string }) {
  return (
    <Card shadow="sm" padding="lg" radius="lg" className="bg-[#015C70]">
      <Card.Section className="p-4 rounded-lg">
        <Image
          src="/placeholder.jpg"
          height={160}
          alt="Reason 1"
          width={160}
          className="w-full object-cover rounded-lg"
        />
      </Card.Section>

      <h3 className="text-xl text-white font-bold my-0">{Title}</h3>

      <p className="text-base text-white my-0">{Description}</p>

      <Button className="bg-[#DFEDF2] text-black rounded-lg" fullWidth mt="md">
        Book classic tour now
      </Button>
    </Card>
  );
}
