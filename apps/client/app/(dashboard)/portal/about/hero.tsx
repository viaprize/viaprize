import { Button } from '@mantine/core';
import Image from 'next/image';

export default function PortalAboutHero() {
  return (
    <section
      //  className="flex flex-col justify-start gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row"
      className="py-10 pb-32 md:gap-28 lg:py-20"
    >
      <div className="hero-map" />
      <div className="relative z-20 ">
        {/* <Image
          src="/portals/Portal.png"
          alt="camp"
          width={50}
          height={50}
          className="absolute left-[-5px] top-[-30px] w-10 lg:w-[50px]"
        /> */}
        <h1 className="bold-52 lg:bold-88 mt-2 mb-0">Portals</h1>
        <p className="regular-16 mt-1 text-gray-30 xl:max-w-[520px]">
          Portals are a type of crowdfunding campaign with two main options
        </p>
        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <Button color="primary">Explore Portals</Button>
          {/* <Button
            rightSection={<Image src="/play.svg" alt="play" width={24} height={24} />}
          >
            How we work?
          </Button> */}
        </div>
      </div>

      {/* <div className="relative flex flex-1 items-start">
        <div className="relative z-20 flex w-[268px] flex-col gap-8 rounded-3xl bg-green-90 px-7 py-8">
          <div className="flex flex-col">
            <div className="flexBetween">
              <p className="regular-16 text-gray-20">Location</p>
              <Image src="/close.svg" alt="close" width={24} height={24} />
            </div>
            <p className="bold-20 text-white">Aguas Calientes</p>
          </div>

          <div className="flexBetween">
            <div className="flex flex-col">
              <p className="regular-16 block text-gray-20">Distance</p>
              <p className="bold-20 text-white">173.28 mi</p>
            </div>
            <div className="flex flex-col">
              <p className="regular-16 block text-gray-20">Elevation</p>
              <p className="bold-20 text-white">2.040 km</p>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
}
