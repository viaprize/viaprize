import { Button, Image, Title } from '@mantine/core';

export default function ImageTitleCard({
  title,
  img,
  logoURL,
}: {
  title: string;
  img: string;
  logoURL: string;
}) {
  return (
    <div className="max-h-fit  h-full p-0 space-y-3 relative">
      <div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center">
        <Title className="sm:text-1xl md:3xl lg:text-5xl">{title}</Title>
        <Button component="a" href="/qf/opencivics/explore">
          Go to explore page
        </Button>
      </div>
      <Image
        src={img}
        alt="Fundraisers Image"
        className="h-full w-full object-cover rounded-xl"
      />
      <Image
        src={logoURL}
        className="rounded-full w-[60px] h-[60px] lg:w-[140px] lg:h-[140px] absolute left-4 bottom-[-35px]"
      />
    </div>
  );
}
