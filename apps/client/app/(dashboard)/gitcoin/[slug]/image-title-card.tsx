import { Card, Image, Text, Title } from '@mantine/core';

export default function ImageTitleCard({
  title,
  img,
}: {
  title: string;
  img: string;
}) {
  return (
    <div className="max-h-fit  h-full p-0 space-y-3">
      <Title className="sm:text-1xl md:3xl lg:text-5xl">{title}</Title>
      <Image
        src={img}
        alt="Fundraisers Image"
        className="h-full w-full object-cover rounded-xl"
      />
    </div>
  );
}
