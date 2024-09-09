import { Button } from "@viaprize/ui/button";
import { Card, CardFooter, CardHeader } from "@viaprize/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen px-40 flex lg:flex-row   justify-between items-center">
      <Image
        src="/hero/test.svg"
        alt="Hero"
        width="1920"
        height="1080"
        className="h-screen absolute inset-0 w-screen z-10 dark:brightness-[0.2] dark:grayscale"
      />
      <div className="z-20 max-w-2xl gap-2">
        <h2 className="text-4xl font-bold">Build the Future</h2>
        <h1 className="text-7xl font-bold">
          via <span className="text-primary text">Prizes</span>
        </h1>
        <p className="text-xl mt-4">
          List and build the world’s most needed product ideas
        </p>
        <div className="mt-8 flex flex-col gap-1 justify-start">
          <Button type="button" className="rounded-full px-7 py-6">
            Explore Prizes
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-7 py-6"
          >
            Create Prize
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-9 w-[50%] aspect-[3/4] gap-3 ">
        <Card className="relative justify-between flex flex-col overflow-hidden col-start-1 col-span-1 row-start-1 row-end-5">
          <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/10 to-black z-10 pointer-events-none" />
          <Image
            src="https://images.unsplash.com/photo-1645902718798-4e5d55ec767c"
            alt="ukraine"
            width="1920"
            height="1080"
            className="absolute  h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
          <CardHeader className="z-10 relative text-white">
            <h1 className="text-3xl">$3k +</h1>
            <p className="text-sm">Deliver Medical Supplies in Ukraine</p>
          </CardHeader>
          <CardFooter className="items-center flex justify-between gap-8 relative z-10 w-full">
            <ArrowRight className="text-primary size-16" />
            <h4 className="text-3xl text-white leading-8 w-fit">
              A Life Saved
            </h4>
          </CardFooter>
        </Card>
        <Card className="col-start-2 row-start-1 col-span-1 row-end-3 ">
          <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/10 to-black z-10 pointer-events-none" />
          test
        </Card>
        <Card className="col-start-2 row-start-3 col-span-1 row-end-6 ">
          <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/10 to-black z-10 pointer-events-none" />
          test
        </Card>
        <Card className="col-start-2 row-start-6 col-span-1 row-end-9 ">
          <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/10 to-black z-10 pointer-events-none" />
          test
        </Card>
        <Card className="col-start-3 row-start-1 col-span-1 row-end-3">
          test
        </Card>
        <Card className="col-start-3 col-span-1 row-start-3 row-end-7">
          test
        </Card>
        <Card className="col-start-3 row-start-7 col-span-1 row-end-10 ">
          test
        </Card>
      </div>
    </section>
  );
}
