'use client';

import { Button, Card, Flex } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center relative overflow-clip">
      <div className="max-w-screen-2xl px-8 pt-4 pb-8 w-full bg-transparent">
        {/* Hero Section */}
        <section className="md:flex justify-betweem items-center h-screen">
          <div className="relative z-50 md:w-1/2 px-4 py-2">
            <h1 className="font-bold text-5xl  my-6">Trustworthy Crowdfunding</h1>

            <Link href="/prize/explore">
              <Button
                className="bg-gradient-to-r from-[#005A6D] to-[#147EA3]"
                color="primary"
              >
                Explore Prizes
              </Button>
            </Link>
            <Flex
              className="backdrop-blur-md rounded-lg py-6 px-5 my-4 sm:w-[80%]"
              style={{
                background: `rgba(125, 185, 206, 0.15)`,
              }}
              justify="space-between"
              align="center"
            >
              <div>
                <h3 className="my-0">$32,460</h3>
                <p className="my-0">Total contributions</p>
              </div>
              <div>
                <h3 className="my-0">63</h3>
                <p className="my-0">Prize winners</p>
              </div>
              <div>
                <h3 className="my-0">17</h3>
                <p className="my-0">Prizes won</p>
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
            <div className="hidden sm:block absolute h-screen w-16 right-0 top-0">
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
        </section>
        {/* How it works */}
        <div className="flex flex-col items-center">
          <h1>Why viaPrize?</h1>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            <ReasonCard
              Title="Reason 1"
              Description="30B is wasted annually on crowdfunding campaigns that never deliver"
              image="/home/piggy-bank-was-thrown-broke-gold-coins-flowed-out.jpg"
            />
            <ReasonCard
              Title="Reason 2"
              Description="With viaPrize either the campaign delivers or you receive a refund"
              image="/home/3d-cryptocurrency-rendering-design.jpg"
            />
            <ReasonCard
              Title="Reason 3"
              Description="Win prizes!"
              image="/home/team-working-animation-project.jpg"
            />
          </div>
        </div>

        <section className="flex flex-col items-center my-14">
          <Image
            src="/home/howItWorks.png"
            width={1000}
            height={1000}
            alt="How it works"
            className="rounded-md max-w-full h-auto"
          />
        </section>
        <section className="flex flex-col items-center my-14">
          <h1 className="text-3xl font-bold">3 Roles in a Prize</h1>
          <Image
            src="/rolesInPrize.png"
            width={1000}
            height={500}
            alt="How it works"
            className="rounded-md max-w-full h-auto"
          />
        </section>
      </div>
    </div>
  );
}

function ReasonCard({
  Title,
  Description,
  image,
}: {
  Title: string;
  Description: string;
  image: string;
}) {
  return (
    <Card shadow="sm" padding="lg" radius="lg" className="bg-[#486B78]">
      <Card.Section className="p-4 rounded-lg">
        <Image
          src={image}
          height={200}
          alt="Reason 1"
          width={160}
          className="w-full object-cover rounded-lg"
        />
      </Card.Section>

      <h3 className="text-xl text-white font-bold my-0">{Title}</h3>

      <p className="text-base text-white">{Description}</p>
      {/* //TODO: Add read more button  */}

      {/* <Button className="bg-[#DFEDF2] text-black rounded-lg" fullWidth mt="md">
        Read More
      </Button> */}
    </Card>
  );
}
