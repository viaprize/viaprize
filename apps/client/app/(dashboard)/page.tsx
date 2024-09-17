'use client';

import useAppUser from '@/components/hooks/useAppUser';
import SubscriptionForm from '@/components/newsletter/subscriptionForm';
import { Button, Card, Flex } from '@mantine/core';
import { usePrivy } from '@privy-io/react-auth';
import { IconTags } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BiSolidRightArrowCircle } from 'react-icons/bi';
import { FaTelegramPlane } from 'react-icons/fa';
import type { RenderPhotoProps } from 'react-photo-album';
import { PhotoAlbum } from 'react-photo-album';

const photoSizes: number[][] = [
  [2160, 2160],
  [2160, 1170],
  [2160, 1076],
  [2160, 890],
  [2160, 984],
  [2160, 984],
  [2160, 4260],
  [2160, 1048],
  [2160, 1896],
  [2160, 3840],
  [2160, 1264],
];
interface FetchError extends Error {
  status?: number;
}
const breakpoints: number[] = [1080, 640, 384, 256, 128, 96, 64, 48];

const basePath = '/home/tweets/tweet';

const photos: {
  src: string;
  width: number;
  height: number;
  srcSet: { src: string; width: number; height: number }[];
}[] = photoSizes.map(([width, height], index) => ({
  src: `${basePath}${index + 1}.png`,
  width,
  height,
  srcSet: breakpoints.map((breakpoint) => {
    const scaledHeight = Math.round((height / width) * breakpoint);
    return {
      src: `${basePath}${index + 1}.png`,
      width: breakpoint,
      height: scaledHeight,
    };
  }),
}));

export default function Home() {
  const router = useRouter();

  const { ready } = usePrivy();

  const { refreshUser } = useAppUser();

  useEffect(() => {
    if (ready) {
      void refreshUser()
        .catch((error: FetchError) => {
          console.log({ error }, 'errror');
          if (error.status === 404) {
            router.push('/onboarding');
          }
        })
        .then(console.log);
    }
  }, [ready]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center relative overflow-clip">
      {/*Nav bar*/}
      {/* <NavBar /> */}
      <div className="max-w-screen-2xl px-8 pt-3 pb-7 w-full bg-transparent">
        {/* Hero Section */}
        <section className="md:flex justify-betweem items-center min-h-screen">
          <div className="relative z-50 md:w-1/2 px-4 py-2">
            <h1 className="font-bold text-4xl sm:text-5xl my-6">
              The ultimate destination for all your prize
            </h1>
            <Flex gap="md" wrap="wrap" className="sm:w-[60%] lg:w-[70%]">
              <Link href="/prize/explore">
                <Button
                  className="bg-gradient-to-r from-[#005A6D] to-[#147EA3] w-full"
                  color="primary"
                >
                  Explore Prizes
                </Button>
              </Link>
              {/* <Link href="/portal/explore">
                <Button
                  className="bg-gradient-to-r from-[#005A6D] to-[#147EA3] w-full"
                  color="primary"
                >
                  Explore Fundraisers
                </Button>
              </Link> */}
            </Flex>
            <Flex
              className="backdrop-blur-md rounded-lg py-6 px-5 my-4 sm:w-[50%] lg:w-[50%] "
              style={{
                background: `rgba(125, 185, 206, 0.15)`,
              }}
              justify="space-between"
              align="center"
            >
              <div className="text-center">
                <h3 className="my-0"> $50,000+</h3>
                <h3 className="my-0">Total Won</h3>
              </div>
              <div className="text-center">
                <h3 className="my-0 ">100+</h3>
                <h3 className="my-0">Total Prizes</h3>
              </div>
            </Flex>
            <div className="flex justify-center w-full lg:w-[70%] my-2">
              <SubscriptionForm />
            </div>
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
              className="relative z-10 object-cover w-full max-sm:h-full"
              src="/home/hero.png"
            />
          </div>
        </section>

        {/* <div className="flex justify-center w-full">
          <SubscriptionForm />
        </div> */}
        {/* How it works */}
        <div className="flex flex-col items-center my-4">
          <h1>Why VPRZ?</h1>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            <ReasonCard
              Title="Simplicity"
              Description="Easy global transactions"
              image="/home/piggy-bank-was-thrown-broke-gold-coins-flowed-out.jpg"
            />
            <ReasonCard
              Title="Sovereignty"
              Description="With VPRZ either the prizes delivers or you receive a refund"
              image="/home/3d-cryptocurrency-rendering-design.jpg"
            />
            <ReasonCard
              Title="Stability"
              Description="Consistent process for anyone around the world "
              image="/home/team-working-animation-project.jpg"
            />
          </div>
        </div>
        <section className="my-24 flex items-center flex-col gap-3 w-full">
          <h1 className="text-3xl font-bold">VPRZ&apos;s Core Functions</h1>
          <FunctionCard
            Title="Prizes"
            Description="Create, Fund, and Win prizes"
            know="prize/about"
            explore="prize/explore"
          />
          {/* <FunctionCard
            Title="Portals"
            Description="Create pass-through campaigns or all-or-nothing campaigns"
            know="portal/about"
            explore="portal/explore"
          /> */}
        </section>
        {/* Our story */}
        <section className="flex flex-col items-center my-14 gap-5">
          <h1 className="text-3xl font-bold">Our Story</h1>
          <StoryCard
            Title="Beginning of something new"
            Description="During a pop-up village called Zuzalu, we witnessed 
            firsthand how the right economic mechanisms may gather a community to build prize. 
            Inspired by conversations with Vitalik Buterin and others, Noah Chon Lee launched a 
            prize to build an AI voice."
            image="/home/story/zuzalu.jpeg"
            side="left"
          />
          <StoryCard
            Title="The first prize"
            Description="With only this incentive, an impromptu hackathon emerged with 
            12 contributors and in five days the first AI voice for a nature entity in 
            history was built and presented to the Prime Minister of Montenegro."
            image="/home/story/prize.png"
            side="right"
          />
          <StoryCard
            Title="The Impact"
            Description="Prizes clearly incentivized collective action,
             but Noah needed to know if this could make a radical difference in peoples’ lives. 
              Next, he watched a kamikaze drone diving towards 
            him get shot down while driving into the frontline of Ukraine to complete 
            a prize for delivering medical supplies. The volunteer medics 
            received the supplies they were missing and because of this they were able 
            to treat 45 injured and said this undoubtedly saved at least one life. "
            image="/home/story/medics.png"
            side="left"
          />
          <StoryCard
            Title="The Impact Continues"
            Description="Half a year later thanks to contributions of 
            over 500 people on Gitcoin ecosystem supporting to VPRZ, 
            over 30 developers adding to our open source code, 
            and our core team of developers Dipanshu, Nithin, Swaraj, 
            and Aryan we now have this fully open source platform 
            for anyone to use. "
            image="/home/story/us.png"
            side="right"
          />
        </section>
        {/* Community */}
        <section className="my-12 gap-3 ">
          {/* <div className=" flex flex-col items-center mb-8"> */}
          {/* <h1 className="w-96 text-3xl text-center font-bold text-black">
              Tons of love who are building and working with viaPrize
            </h1> */}

          {/* <Button
              rightSection={<FaTelegramPlane size={20} />}
              color="primary"
              className="bg-gradient-to-r from-[#005A6D] to-[#147EA3]  h-[30%] py-3 text-lg"
            >
              <Link href="https://t.me/viaPrize">Join the Community</Link>
            </Button>
          </div> */}
          {/* <div className="my-4" />
          <PhotoAlbum
            layout="masonry"
            photos={photos}
            renderPhoto={NextJsImage}
            columns={(containerWidth) => {
              if (containerWidth < 400) return 1;
              if (containerWidth < 800) return 2;
              return 3;
            }}
          /> */}
        </section>
        {/* Footer */}
      </div>
    </div>
  );
}

function StoryCard({
  Title,
  Description,
  image,
  side,
}: {
  Title: string;
  Description: string;
  image: string;
  side: 'left' | 'right';
}) {
  return (
    <div
      className={`bg-[#4c717f] md:flex ${
        side === 'right' ? 'flex-row-reverse' : ''
      } p-6 rounded-lg shadow-lg`}
    >
      <div className="p-4 rounded-lg">
        <Image
          src={image}
          height={300}
          alt="Reason 1"
          width={460}
          className="max-h-fit max-md:w-full h-full md:max-w-[300px] object-cover rounded-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl text-white font-bold my-0">{Title}</h3>
        <p className="text-base text-white">{Description}</p>
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
    </Card>
  );
}

function FunctionCard({
  Title,
  Description,
  explore,
  know,
}: {
  Title: string;
  Description: string;
  explore: string;
  know: string;
}) {
  return (
    <Card className="bg-[#486B78] rounded-2xl p-10 w-full">
      <h1 className="my-0 text-white ">{Title}</h1>
      <p className="text-white md:max-w-[80%] text-lg lg:font-semibold leading-7">
        {Description}
      </p>
      <div className="flex gap-4 max-sm:flex-col">
        {/* <Button
          className="bg-[#E5F1F5] text-black font-bold gap-5 items-center"
          rightSection={<BiSolidRightArrowCircle size={14} />}
          component="a"
          href={know}
        >
          Know More
        </Button> */}
        <Button
          className="bg-[#E5F1F5] text-black font-bold gap-5 items-center"
          rightSection={<BiSolidRightArrowCircle size={14} />}
          component="a"
          href={explore}
        >
          Explore
        </Button>
      </div>
    </Card>
  );
}

function NextJsImage({
  photo,
  imageProps: { alt, title, sizes, onClick },
  wrapperStyle,
}: RenderPhotoProps) {
  return (
    <div style={{ ...wrapperStyle, position: 'relative' }}>
      <Image
        fill
        className="rounded-lg"
        src={photo}
        placeholder={'blurDataURL' in photo ? 'blur' : undefined}
        {...{ alt, title, sizes, onClick }}
      />
    </div>
  );
}
