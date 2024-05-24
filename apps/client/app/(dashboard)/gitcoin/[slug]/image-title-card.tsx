import { Card, Image, Text, Title } from '@mantine/core';

export default function ImageTitleCard({
  title,
  name,
  img,
}: {
  title: string;
  name: string;
  img: string;
}) {
  return (
    <Card
      shadow="md"
      withBorder
      radius="md"
      className="relative max-h-fit rounded-lg h-full p-0"
    >
      <Image src={img} alt="Portal Image" className="h-full w-full object-cover" />
      <div
        style={{
          position: 'absolute',
          left: '2rem',
          bottom: '1rem',
        }}
        className="text-white flex flex-col gap-2 z-10"
      >
        <Title className="sm:text-1xl md:4xl lg:text-6xl">{title}</Title>
        <Text className="sm:text-80px  md:text-2xl lg:text-3xl">{name}</Text>
      </div>
      <div
        className="rounded-lg"
        style={{
          position: 'absolute',
          left: '0',
          bottom: '0px',
          width: '100%',
          height: '50%',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </Card>
  );
}
