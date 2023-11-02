import useAppUser from '@/context/hooks/useAppUser';
import { Badge, Button, Card, Flex } from '@mantine/core';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { BiSolidRightArrowCircle } from 'react-icons/bi';
import type { RenderPhotoProps } from 'react-photo-album';
import PhotoAlbum from 'react-photo-album';

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
    console.log(basePath);
    return {
      src: `${basePath}${index + 1}.png`,
      width: breakpoint,
      height: scaledHeight,
    };
  }),
}));

const navBarLinks = [
  {
    text: 'Home',
    link: '/',
  },
  {
    text: 'Prizes',
    link: '/prize/explore',
  },
  {
    text: 'Pacts',
    link: '/pact/home',
  },
  {
    text: 'about',
    link: '/about',
  },
];

export default function Home() {
  const router = useRouter();

  const { user, ready } = usePrivy();

  const { loginUser, refreshUser } = useAppUser();

  useEffect(() => {
    if (ready) {
      void refreshUser()
        .catch((error: FetchError) => {
          console.log({ error }, 'errror');
          if (error.status === 404) {
            router.push('/onboarding').catch(console.error);
          }
        })
        .then(console.log);
    }
  }, [ready]);

  return (
    <div
      className="w-full min-h-screen flex justify-center py-4 relative overflow-clip"
      style={{
        background: `radial-gradient(243.55% 153.69% at 23.48% -1.07%, #EBF3F5 6.99%, #C5E2F0 100%)`,
      }}
    >
      <div className="max-w-screen-2xl px-8 py-8 w-full">
        {/*Nav bar*/}
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <Image
              src="/viaprizeBg.png"
              alt="ViaPrize Logo"
              width={40}
              height={40}
              priority
              className="rounded-full"
            />
            <h3 className="font-bold text-2xl text-black">ViaPrize</h3>
          </div>
          <div className="flex gap-10 justify-between items-center">
            {navBarLinks.map((data) => (
              <NavBarLinks key={data.text} text={data.text} link={data.link} />
            ))}
            {user ? (
              <Badge variant="gradient">
                {user.wallet?.address.slice(0, 6)}...{user.wallet?.address.slice(-6, -1)}
              </Badge>
            ) : (
              <Button
                className="rounded-lg px-6 bg-gradient-to-r from-[#32a9c0] to-[#2794bc]"
                onClick={() => {
                  loginUser()
                    .then(() => {
                      console.log('logging in ');
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
        {/* Hero Section */}
        <section className="md:flex justify-betweem items-center h-screen">
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
          <h1 className="text-black capitalize">Why viarprize?</h1>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            <ReasonCard
              Title="Reason 1"
              Description="We use the latest technology to ensure that your funds are safe and secure
              We use the latest technology to ensure that your funds are safe and secure"
            />
            <ReasonCard
              Title="Reason 2"
              Description="We use the latest technology to ensure that your funds are safe and secure
              We use the latest technology to ensure that your funds are safe and secure"
            />
            <ReasonCard
              Title="Reason 3"
              Description="We use the latest technology to ensure that your funds are safe and secure
              We use the latest technology to ensure that your funds are safe and secure"
            />
          </div>
          <h2 className="text-black mt-6">Some More Stats</h2>
          <Flex
            className="backdrop-blur-md rounded-lg py-6 px-5 mb-4 text-black w-full"
            style={{
              background: `rgba(125, 185, 206, 0.15)`,
            }}
            justify="space-evenly"
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
            <div>
              <h3 className="my-0">500+</h3>
              <p className="my-0">Total Participants</p>
            </div>
          </Flex>
        </div>
        {/* Viaprize’s Core Functions  */}
        <section className="my-24 flex items-center flex-col gap-3">
          <h1 className="text-3xl font-bold text-black">
            Viaprize&apos;s Core Functions
          </h1>
          <FunctionCard
            Title="Prize"
            Description="Hey testing is the one of the hello sadlkfjlajsl Hey testing 
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello 
          sadlkfjlajsl Hey testing is the one of the hello sadlkfjlajsl Hey testing 
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello
          sadlkfjlajsl Hey testing is the one of the hello sadlkfjlajsl Hey testing 
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello 
          sadlkfjlajsl Hey testing is the one of the hello sadlkfjlajsl Hey testing
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello
          sadlkfjlajsl"
            know="linking"
            explore="sadlfsafasd"
          />
          <FunctionCard
            Title="Pact"
            Description="Hey testing is the one of the hello sadlkfjlajsl Hey testing 
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello 
          sadlkfjlajsl Hey testing is the one of the hello sadlkfjlajsl Hey testing 
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello
          sadlkfjlajsl Hey testing is the one of the hello sadlkfjlajsl Hey testing 
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello 
          sadlkfjlajsl Hey testing is the one of the hello sadlkfjlajsl Hey testing
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello
          sadlkfjlajsl"
            know="linking"
            explore="sadlfsafasd"
          />
          <FunctionCard
            Title="Go Fund Me"
            Description="Hey testing is the one of the hello sadlkfjlajsl Hey testing 
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello 
          sadlkfjlajsl Hey testing is the one of the hello sadlkfjlajsl Hey testing 
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello
          sadlkfjlajsl Hey testing is the one of the hello sadlkfjlajsl Hey testing 
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello 
          sadlkfjlajsl Hey testing is the one of the hello sadlkfjlajsl Hey testing
          is the one of the hello sadlkfjlajsl Hey testing is the one of the hello
          sadlkfjlajsl"
            know="linking"
            explore="sadlfsafasd"
          />
        </section>
        <section className="my-12 gap-3 ">
          <div className=" flex flex-col items-center">
            <h1 className="w-96 text-3xl text-center font-bold text-black">
              Tons of love who are building and working with Viaprize
            </h1>
            <Button 
            className='bg-gradient-to-r from-[#005A6D] to-[#147EA3]'
            >
              <Link
                href="https://t.me/viaprize"
              >
                Join Community
              </Link>
            </Button>
          </div>
          <div className="my-4" />
          <PhotoAlbum
            layout="masonry"
            photos={photos}
            renderPhoto={NextJsImage}
            columns={(containerWidth) => {
              if (containerWidth < 400) return 1;
              if (containerWidth < 800) return 2;
              return 3;
            }}
          />
        </section>
      </div>
    </div>
  );
}

function NavBarLinks({ text, link }: { text: string; link: string }) {
  return (
    <Link
      href={link}
      className="font-semibold text-lg text-gray-700 capitalize hover:text-black"
    >
      {text}
    </Link>
  );
}

function ReasonCard({ Title, Description }: { Title: string; Description: string }) {
  return (
    <Card shadow="sm" padding="lg" radius="lg" className="bg-[#486B78]">
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
    <Card className="bg-[#486B78] rounded-2xl p-10">
      <h1 className="my-0 text-white ">{Title}</h1>
      <p className="text-white md:max-w-[80%] text-lg lg:font-semibold leading-7">
        {Description}
      </p>
      <Flex gap="sm">
        <Button
          className="bg-[#E5F1F5] text-black font-bold gap-5 items-center"
          rightSection={<BiSolidRightArrowCircle size={14} />}
        >
          <Link href={know}>Know More</Link>
        </Button>
        <Button
          className="bg-[#E5F1F5] text-black font-bold flex gap-5 items-center"
          rightSection={<BiSolidRightArrowCircle size={14} />}
        >
          <Link href={explore}>explore prizes</Link>
        </Button>
      </Flex>
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
